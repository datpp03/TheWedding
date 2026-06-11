$ErrorActionPreference = "Stop"

$commands = @("node", "pnpm", "docker")

foreach ($command in $commands) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    Write-Error "$command is not available in PATH"
  }
}

Write-Output "Prerequisites found."

