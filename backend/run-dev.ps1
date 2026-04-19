Param(
  [string]$EnvFile
)

function Load-EnvFile($path) {
  if (-not (Test-Path $path)) { return }
  Get-Content $path | ForEach-Object { $_.Trim() } |
    Where-Object { $_ -and -not $_.StartsWith('#') } |
    ForEach-Object {
      if ($_ -match '^\s*([^=]+)\s*=\s*(.*)\s*$') {
        $name = $matches[1]
        $value = $matches[2]
        # strip optional quotes
        $value = $value -replace "^[`'`"]|[`'`"]$", ''
        Set-Item -Path "Env:$name" -Value $value
      }
    }
}

Write-Host "[DRRCS] Dev runner starting (backend)" -ForegroundColor Cyan

# Only auto-load a real backend .env. The checked-in backend.environment file is a template
# and should only be used when explicitly passed to -EnvFile after replacing placeholders.
$resolvedEnvFile = $null

if ($PSBoundParameters.ContainsKey('EnvFile') -and -not [string]::IsNullOrWhiteSpace($EnvFile)) {
  $resolvedEnvFile = $EnvFile
} elseif (Test-Path "$PSScriptRoot\.env") {
  $resolvedEnvFile = "$PSScriptRoot\.env"
}

if ($resolvedEnvFile -and (Test-Path $resolvedEnvFile)) {
  Write-Host "Loading env from: $resolvedEnvFile"
  Load-EnvFile -path $resolvedEnvFile
} else {
  Write-Host "No backend env file found. Using process/user env vars."
}

if ($env:MONGODB_URI -match 'mongodb\+srv://username:password@cluster\.mongodb\.net') {
  Write-Warning "Ignoring placeholder MONGODB_URI from template values. Spring will use the local fallback URI instead."
  Remove-Item Env:MONGODB_URI -ErrorAction SilentlyContinue
}

# Ensure CORS allows your Vite dev origin(s)
if (-not $env:CORS_ALLOWED_ORIGINS -or [string]::IsNullOrWhiteSpace($env:CORS_ALLOWED_ORIGINS)) {
  $env:CORS_ALLOWED_ORIGINS = "http://127.0.0.1:3000,http://localhost:3000"
}

Write-Host "CORS_ALLOWED_ORIGINS=$($env:CORS_ALLOWED_ORIGINS)" -ForegroundColor Yellow

if ($env:MONGODB_URI) {
  Write-Host "MONGODB_URI is set (using Atlas/local connection string)" -ForegroundColor Yellow
} else {
  Write-Warning "MONGODB_URI is not set. Spring will fall back to mongodb://localhost:27017/disaster_relief"
}

Push-Location $PSScriptRoot
try {
  Write-Host "Starting Spring Boot on http://localhost:8080 ..." -ForegroundColor Green
  mvn -DskipTests spring-boot:run
}
finally {
  Pop-Location
}
