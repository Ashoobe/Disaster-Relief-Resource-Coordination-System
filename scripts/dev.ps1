param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ViteArgs
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendDir = Split-Path -Parent $ScriptDir
$RepoRoot = Split-Path -Parent $FrontendDir
$BackendStarter = Join-Path $RepoRoot "backend\start-backend.ps1"

if (-not (Test-Path -LiteralPath $BackendStarter)) {
    throw "Backend starter was not found at '$BackendStarter'."
}

& $BackendStarter -WaitUntilReady

Set-Location -LiteralPath $FrontendDir

if ($ViteArgs.Count -gt 0) {
    & npm run dev:frontend -- @ViteArgs
} else {
    & npm run dev:frontend
}

exit $LASTEXITCODE
