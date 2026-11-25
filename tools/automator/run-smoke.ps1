<#
  一条命令跑完模拟器冒烟：
    .\run-smoke.ps1            # 默认端口 9490
    .\run-smoke.ps1 -Port 9492

  做的事：退出旧实例 → 清理残留 → 以自动化模式启动 → 等端口就绪 → 跑 smoke.js → 输出退出码
  背景：automator 实例跑久了会退化（reLaunch 不跳转、getCurrentPages 停在旧页面），
        所以每次都重启，而不是复用。
#>
param(
  [int]$Port = 9490,
  [int]$WaitSeconds = 75,
  [string]$Project = 'D:\dsh\workplace\work\answer\hhxpoint-answer-1848759',
  [string]$Cli = 'D:\develop_tool\微信web开发者工具\cli.bat',
  [string]$Smoke = 'D:\dsh\workplace\tools\wx-auto\smoke.js'
)

$ErrorActionPreference = 'Continue'

Write-Host "[1/5] 退出旧实例" -ForegroundColor Cyan
& $Cli quit 2>&1 | Out-Null
Start-Sleep -Seconds 4
Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*develop_tool*' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

$left = (Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*develop_tool*' } | Measure-Object).Count
Write-Host "      残留进程: $left"

Write-Host "[2/5] 启动自动化（端口 $Port）" -ForegroundColor Cyan
$log = Join-Path $env:TEMP "wx-auto-$Port.log"
Start-Process -FilePath 'cmd.exe' -ArgumentList "/c `"`"$Cli`" auto --project `"$Project`" --auto-port $Port --trust-project > `"$log`" 2>&1`"" -WindowStyle Hidden

Write-Host "[3/5] 等端口就绪（最多 $WaitSeconds 秒）" -ForegroundColor Cyan
$ready = $false
for ($i = 0; $i -lt $WaitSeconds; $i += 3) {
  Start-Sleep -Seconds 3
  $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  if ($conn) { $ready = $true; Write-Host "      就绪：${i}s"; break }
}
if (-not $ready) {
  Write-Host "      端口未就绪，日志尾部：" -ForegroundColor Red
  Get-Content $log -ErrorAction SilentlyContinue | Select-Object -Last 8
  exit 2
}

# 模拟器编译还要一点时间，多等一会儿再断言
Start-Sleep -Seconds 20

Write-Host "[4/5] 跑冒烟" -ForegroundColor Cyan
& node $Smoke $Port
$code = $LASTEXITCODE

Write-Host "[5/5] 结果: 退出码 $code" -ForegroundColor $(if ($code -eq 0) { 'Green' } else { 'Red' })
exit $code
