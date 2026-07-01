$ErrorActionPreference = 'Stop'

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$RuntimeDir = Join-Path $RepoRoot '.local-control'
$LogDir = Join-Path $RuntimeDir 'logs'
$StatePath = Join-Path $RuntimeDir 'state.json'

New-Item -ItemType Directory -Force -Path $RuntimeDir, $LogDir | Out-Null

function Write-Title {
  Clear-Host
  Write-Host '=========================================' -ForegroundColor DarkGray
  Write-Host ' The Wedding - Local Control Panel' -ForegroundColor Cyan
  Write-Host '=========================================' -ForegroundColor DarkGray
  Write-Host "Repo: $RepoRoot" -ForegroundColor DarkGray
  Write-Host ''
}

function Pause-Menu {
  Write-Host ''
  Read-Host 'Press Enter to continue' | Out-Null
}

function Get-State {
  if (-not (Test-Path -LiteralPath $StatePath)) {
    return [ordered]@{}
  }

  $raw = Get-Content -LiteralPath $StatePath -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) {
    return [ordered]@{}
  }

  $json = $raw | ConvertFrom-Json
  $state = [ordered]@{}
  foreach ($property in $json.PSObject.Properties) {
    $state[$property.Name] = $property.Value
  }
  return $state
}

function Save-State($State) {
  $State | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $StatePath -Encoding UTF8
}

function Test-ServiceRunning($ServiceName) {
  $state = Get-State
  if (-not $state.Contains($ServiceName)) {
    return $false
  }

  $pidValue = [int]$state[$ServiceName].pid
  return $null -ne (Get-Process -Id $pidValue -ErrorAction SilentlyContinue)
}

function Get-ServiceLogPath($ServiceName) {
  return Join-Path $LogDir "$ServiceName.log"
}

function Clear-WebCache {
  if (Test-ServiceRunning 'web') {
    throw 'Stop Web before clearing apps/web/.next.'
  }

  $nextDir = Join-Path $RepoRoot 'apps/web/.next'
  if (-not (Test-Path -LiteralPath $nextDir)) {
    Write-Host 'Web cache is already clean.' -ForegroundColor DarkGray
    return
  }

  $resolvedRoot = $RepoRoot.ProviderPath
  $resolvedNext = (Resolve-Path -LiteralPath $nextDir).Path
  $expectedPrefix = Join-Path $resolvedRoot 'apps\web'
  if (-not $resolvedNext.StartsWith($expectedPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove unexpected path: $resolvedNext"
  }

  Remove-Item -LiteralPath $resolvedNext -Recurse -Force
  Write-Host 'Cleared apps/web/.next.' -ForegroundColor Green
}

function Start-LocalService($ServiceName, $Command, $OpenUrl = $null, [switch]$CleanWebCache) {
  if (Test-ServiceRunning $ServiceName) {
    Write-Host "$ServiceName is already running." -ForegroundColor Yellow
    if ($OpenUrl) {
      Start-Process $OpenUrl
    }
    return
  }

  if ($CleanWebCache) {
    Clear-WebCache
  }

  $logPath = Get-ServiceLogPath $ServiceName
  $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Add-Content -LiteralPath $logPath -Encoding UTF8 -Value ""
  Add-Content -LiteralPath $logPath -Encoding UTF8 -Value "===== $timestamp - starting $ServiceName ====="
  Add-Content -LiteralPath $logPath -Encoding UTF8 -Value "Command: $Command"

  $cmdLine = 'cd /d "' + $RepoRoot.ProviderPath + '" && ' + $Command + ' >> "' + $logPath + '" 2>&1'
  $process = Start-Process `
    -FilePath 'cmd.exe' `
    -ArgumentList @('/d', '/s', '/c', $cmdLine) `
    -WorkingDirectory $RepoRoot `
    -WindowStyle Hidden `
    -PassThru

  $state = Get-State
  $state[$ServiceName] = [ordered]@{
    pid = $process.Id
    command = $Command
    log = $logPath
    startedAt = (Get-Date).ToString('o')
  }
  Save-State $state

  Write-Host "$ServiceName started. PID: $($process.Id)" -ForegroundColor Green
  Write-Host "Log: $logPath" -ForegroundColor DarkGray
  if ($OpenUrl) {
    Start-Process $OpenUrl
  }
}

function Get-ChildProcessIds($ProcessId) {
  $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue
  foreach ($child in $children) {
    Get-ChildProcessIds $child.ProcessId
    $child.ProcessId
  }
}

function Stop-ProcessTree($ProcessId) {
  $childIds = @(Get-ChildProcessIds $ProcessId)
  foreach ($childId in $childIds) {
    Stop-Process -Id $childId -Force -ErrorAction SilentlyContinue
  }
  Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
}

function Stop-LocalService($ServiceName) {
  $state = Get-State
  if (-not $state.Contains($ServiceName)) {
    Write-Host "$ServiceName is not tracked." -ForegroundColor Yellow
    return
  }

  $pidValue = [int]$state[$ServiceName].pid
  if (Get-Process -Id $pidValue -ErrorAction SilentlyContinue) {
    Stop-ProcessTree $pidValue
    Write-Host "$ServiceName stopped." -ForegroundColor Green
  } else {
    Write-Host "$ServiceName was not running. Cleaning state." -ForegroundColor Yellow
  }

  $state.Remove($ServiceName)
  Save-State $state
}

function Show-Status {
  $state = Get-State
  if ($state.Count -eq 0) {
    Write-Host 'No local services are tracked.' -ForegroundColor Yellow
    return
  }

  foreach ($service in $state.Keys) {
    $item = $state[$service]
    $pidValue = [int]$item.pid
    $running = $null -ne (Get-Process -Id $pidValue -ErrorAction SilentlyContinue)
    $status = if ($running) { 'RUNNING' } else { 'STOPPED' }
    $color = if ($running) { 'Green' } else { 'Red' }
    Write-Host ("{0,-8} {1,-8} PID={2}  Log={3}" -f $service, $status, $pidValue, $item.log) -ForegroundColor $color
  }
}

function Select-LogFile {
  $known = @(
    @{ Name = 'api'; Path = Get-ServiceLogPath 'api' },
    @{ Name = 'web'; Path = Get-ServiceLogPath 'web' }
  )

  Write-Host 'Select log:'
  for ($i = 0; $i -lt $known.Count; $i++) {
    Write-Host " $($i + 1). $($known[$i].Name) - $($known[$i].Path)"
  }
  Write-Host ' 0. Cancel'

  $choice = (Read-Host 'Choice').Trim()
  if ($choice -eq '0') {
    return $null
  }

  $index = 0
  if ([int]::TryParse($choice, [ref]$index) -and $index -ge 1 -and $index -le $known.Count) {
    return $known[$index - 1].Path
  }

  Write-Host 'Invalid choice.' -ForegroundColor Red
  return $null
}

function Show-LastLog {
  $path = Select-LogFile
  if (-not $path) {
    return
  }
  if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "Log does not exist yet: $path" -ForegroundColor Yellow
    return
  }

  $linesInput = (Read-Host 'How many lines? (default 120)').Trim()
  $lines = 120
  if (-not [string]::IsNullOrWhiteSpace($linesInput)) {
    [void][int]::TryParse($linesInput, [ref]$lines)
  }

  Get-Content -LiteralPath $path -Tail $lines
}

function Follow-Log {
  $path = Select-LogFile
  if (-not $path) {
    return
  }
  if (-not (Test-Path -LiteralPath $path)) {
    New-Item -ItemType File -Force -Path $path | Out-Null
  }

  Write-Host "Following $path. Press Ctrl+C to stop following." -ForegroundColor Cyan
  Get-Content -LiteralPath $path -Tail 80 -Wait
}

function Show-ErrorLog {
  $path = Select-LogFile
  if (-not $path) {
    return
  }
  if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "Log does not exist yet: $path" -ForegroundColor Yellow
    return
  }

  Select-String -LiteralPath $path -Pattern 'error','exception','failed','fatal','warn','EADDRINUSE','ECONNREFUSED','Prisma','TypeError','ReferenceError' -CaseSensitive:$false |
    Select-Object -Last 120 |
    ForEach-Object {
      Write-Host ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
    }
}

function Invoke-HealthCheck {
  $checks = @(
    @{ Name = 'Web'; Url = 'http://localhost:3000' },
    @{ Name = 'API'; Url = 'http://localhost:4000/api/v1' }
  )

  foreach ($check in $checks) {
    try {
      $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 5
      Write-Host ("{0,-4} {1} {2}" -f $check.Name, $response.StatusCode, $check.Url) -ForegroundColor Green
    } catch {
      Write-Host ("{0,-4} FAIL {1} - {2}" -f $check.Name, $check.Url, $_.Exception.Message) -ForegroundColor Red
    }
  }
}

function Open-LocalUrls {
  Start-Process 'http://localhost:3000'
  Start-Process 'http://localhost:3000/dashboard'
  Start-Process 'http://localhost:3000/dashboard/themes'
  Start-Process 'http://localhost:4000/api/v1'
}

function Run-CommandInPanel($Command) {
  Write-Host "Running: $Command" -ForegroundColor Cyan
  Push-Location $RepoRoot
  try {
    cmd.exe /c $Command
  } finally {
    Pop-Location
  }
}

function Show-Menu {
  Write-Host 'Run local'
  Write-Host ' 1. Start API only'
  Write-Host ' 2. Start Web only'
  Write-Host ' 3. Start API + Web'
  Write-Host ' 4. Stop API'
  Write-Host ' 5. Stop Web'
  Write-Host ' 6. Stop all'
  Write-Host ''
  Write-Host 'Logs and status'
  Write-Host ' 7. Show status'
  Write-Host ' 8. Show last log lines'
  Write-Host ' 9. Follow live log'
  Write-Host '10. Show error/warning lines'
  Write-Host '11. Health check local URLs'
  Write-Host '12. Open local URLs'
  Write-Host ''
  Write-Host 'Checks'
  Write-Host '13. Run format check'
  Write-Host '14. Run lint'
  Write-Host '15. Run typecheck'
  Write-Host '16. Run tests'
  Write-Host '17. Run build'
  Write-Host '18. Clear Web .next cache'
  Write-Host '19. Run API migrations'
  Write-Host ''
  Write-Host ' 0. Exit'
  Write-Host ''
}

:mainMenu while ($true) {
  Write-Title
  Show-Status
  Write-Host ''
  Show-Menu
  $choice = (Read-Host 'Choose').Trim()

  try {
    switch ($choice) {
      '1' { Start-LocalService 'api' 'pnpm.cmd --filter @the-wedding/api dev'; Pause-Menu }
      '2' {
        Start-LocalService 'web' 'pnpm.cmd --filter @the-wedding/web dev' 'http://localhost:3000' -CleanWebCache
        Pause-Menu
      }
      '3' {
        Start-LocalService 'api' 'pnpm.cmd --filter @the-wedding/api dev'
        Start-LocalService 'web' 'pnpm.cmd --filter @the-wedding/web dev' 'http://localhost:3000' -CleanWebCache
        Pause-Menu
      }
      '4' { Stop-LocalService 'api'; Pause-Menu }
      '5' { Stop-LocalService 'web'; Pause-Menu }
      '6' { Stop-LocalService 'api'; Stop-LocalService 'web'; Pause-Menu }
      '7' { Show-Status; Pause-Menu }
      '8' { Show-LastLog; Pause-Menu }
      '9' { Follow-Log }
      '10' { Show-ErrorLog; Pause-Menu }
      '11' { Invoke-HealthCheck; Pause-Menu }
      '12' { Open-LocalUrls; Pause-Menu }
      '13' { Run-CommandInPanel 'pnpm.cmd format:check'; Pause-Menu }
      '14' { Run-CommandInPanel 'pnpm.cmd lint'; Pause-Menu }
      '15' { Run-CommandInPanel 'pnpm.cmd typecheck'; Pause-Menu }
      '16' { Run-CommandInPanel 'pnpm.cmd test'; Pause-Menu }
      '17' { Run-CommandInPanel 'pnpm.cmd build'; Pause-Menu }
      '18' { Clear-WebCache; Pause-Menu }
      '19' { Run-CommandInPanel 'pnpm.cmd --filter @the-wedding/api migration:run'; Pause-Menu }
      '0' { break mainMenu }
      default { Write-Host 'Invalid choice.' -ForegroundColor Red; Pause-Menu }
    }
  } catch {
    Write-Host ''
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Pause-Menu
  }
}
