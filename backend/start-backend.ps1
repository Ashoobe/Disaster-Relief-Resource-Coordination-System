param(
    [string]$JarPath = "target\disaster-relief-platform-0.0.1-SNAPSHOT.war",
    [string]$EnvPath = ".env",
    [switch]$SkipDependencies,
    [switch]$WaitUntilReady,
    [int]$DependencyTimeoutSeconds = 180,
    [int]$ApiTimeoutSeconds = 120
)

$ErrorActionPreference = "Stop"

function Resolve-BackendPath {
    param([string]$Path)

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return $Path
    }

    return (Join-Path $PSScriptRoot $Path)
}

function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port
    )

    try {
        $client = [System.Net.Sockets.TcpClient]::new()
        $async = $client.BeginConnect($HostName, $Port, $null, $null)
        $connected = $async.AsyncWaitHandle.WaitOne(1000, $false)
        if ($connected) {
            $client.EndConnect($async)
        }
        $client.Close()
        return $connected
    } catch {
        return $false
    }
}

function Test-BackendReady {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:8080/v3/api-docs" -UseBasicParsing -TimeoutSec 3
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
    } catch {
        return $false
    }
}

function Wait-ForBackend {
    param([int]$TimeoutSeconds)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-BackendReady) {
            return $true
        }
        Start-Sleep -Seconds 2
    }
    return $false
}

function Ensure-DockerReady {
    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $docker) {
        throw "Docker was not found. Install Docker Desktop or start MongoDB, Redis, and Kafka manually."
    }

    & $docker.Source info *> $null
    if ($LASTEXITCODE -eq 0) {
        return $docker.Source
    }

    $dockerDesktop = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (Test-Path -LiteralPath $dockerDesktop) {
        Write-Host "Docker is not running. Starting Docker Desktop..."
        Start-Process -FilePath $dockerDesktop -WindowStyle Hidden | Out-Null
    }

    $deadline = (Get-Date).AddSeconds($DependencyTimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        & $docker.Source info *> $null
        if ($LASTEXITCODE -eq 0) {
            return $docker.Source
        }
        Start-Sleep -Seconds 3
    }

    throw "Docker did not become ready. Start Docker Desktop, then run this command again."
}

function Ensure-Dependencies {
    if ($SkipDependencies) {
        return
    }

    $services = New-Object System.Collections.Generic.List[string]
    $ports = @()

    if (-not (Test-TcpPort -HostName "127.0.0.1" -Port 27017)) {
        $services.Add("mongodb")
        $ports += [pscustomobject]@{ Name = "MongoDB"; Port = 27017 }
    }

    if (-not (Test-TcpPort -HostName "127.0.0.1" -Port 6379)) {
        $services.Add("redis")
        $ports += [pscustomobject]@{ Name = "Redis"; Port = 6379 }
    }

    if (-not (Test-TcpPort -HostName "127.0.0.1" -Port 9092)) {
        $services.Add("zookeeper")
        $services.Add("kafka")
        $ports += [pscustomobject]@{ Name = "Kafka"; Port = 9092 }
    }

    if ($services.Count -eq 0) {
        return
    }

    $composePath = Join-Path $PSScriptRoot "docker-compose.yml"
    if (-not (Test-Path -LiteralPath $composePath)) {
        throw "docker-compose.yml was not found at '$composePath'."
    }

    $docker = Ensure-DockerReady
    $serviceNames = $services | Select-Object -Unique
    Write-Host "Starting backend dependencies: $($serviceNames -join ', ')"
    & $docker compose -f $composePath up -d @serviceNames
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose could not start the backend dependencies."
    }

    $deadline = (Get-Date).AddSeconds($DependencyTimeoutSeconds)
    do {
        $missing = @($ports | Where-Object { -not (Test-TcpPort -HostName "127.0.0.1" -Port $_.Port) })
        if ($missing.Count -eq 0) {
            return
        }
        Start-Sleep -Seconds 2
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for backend dependencies: $($missing.Name -join ', ')."
}

$JarPath = Resolve-BackendPath $JarPath
$EnvPath = Resolve-BackendPath $EnvPath

Ensure-Dependencies

if (Test-BackendReady) {
    Write-Host "Backend API is already running at http://127.0.0.1:8080/api"
    return
}

if (Test-TcpPort -HostName "127.0.0.1" -Port 8080) {
    if (Wait-ForBackend -TimeoutSeconds 20) {
        Write-Host "Backend API is already running at http://127.0.0.1:8080/api"
        return
    }
    throw "Port 8080 is already in use, but the DRRCS backend is not responding at /v3/api-docs."
}

if (-not (Test-Path -LiteralPath $JarPath)) {
    throw "Backend artifact not found at '$JarPath'. Build the backend before starting it."
}

if (Test-Path -LiteralPath $EnvPath) {
    Get-Content -LiteralPath $EnvPath | ForEach-Object {
        $line = $_.Trim()
        if ($line.Length -eq 0 -or $line.StartsWith("#")) {
            return
        }

        $parts = $line -split "=", 2
        if ($parts.Count -ne 2) {
            return
        }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$logDir = Split-Path -Parent $JarPath
if (-not $logDir) {
    $logDir = "."
}

$java = (Get-Command java).Source
$process = Start-Process `
    -FilePath $java `
    -ArgumentList @("-jar", $JarPath) `
    -WorkingDirectory $PSScriptRoot `
    -RedirectStandardOutput (Join-Path $logDir "backend-run.log") `
    -RedirectStandardError (Join-Path $logDir "backend-run.err.log") `
    -WindowStyle Hidden `
    -PassThru

Write-Host "Backend started with PID $($process.Id)"

if ($WaitUntilReady) {
    Write-Host "Waiting for backend API at http://127.0.0.1:8080/api..."
    if (Wait-ForBackend -TimeoutSeconds $ApiTimeoutSeconds) {
        Write-Host "Backend API is ready at http://127.0.0.1:8080/api"
        return
    }

    $errorLog = Join-Path $logDir "backend-run.err.log"
    if (Test-Path -LiteralPath $errorLog) {
        Write-Host "Backend error log tail:"
        Get-Content -LiteralPath $errorLog -Tail 40
    }
    throw "Backend was started but did not become ready within $ApiTimeoutSeconds seconds."
}
