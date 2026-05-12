$ErrorActionPreference = "Stop"

$frontendDev = Join-Path $PSScriptRoot "frontend\scripts\dev.ps1"

if (-not (Test-Path -LiteralPath $frontendDev)) {
    throw "Frontend dev starter was not found at '$frontendDev'."
}

& $frontendDev @args
exit $LASTEXITCODE
