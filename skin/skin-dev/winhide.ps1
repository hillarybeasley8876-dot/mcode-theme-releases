param([string]$Mode = "hide", [string]$ProcName = "MiniMax Code")
# hide | show | min : applies ShowWindow to the process's main Chromium window (same state as "closed to tray").
Add-Type @"
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class WHide {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextLength(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  public static List<IntPtr> All() { var l = new List<IntPtr>(); EnumWindows((h, p) => { l.Add(h); return true; }, IntPtr.Zero); return l; }
}
"@
$pids = @(Get-Process -Name $ProcName -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
$cmd = switch ($Mode) { "hide" { 0 } "show" { 4 } "min" { 7 } default { 0 } }
foreach ($h in [WHide]::All()) {
  $p = 0; [void][WHide]::GetWindowThreadProcessId($h, [ref]$p)
  if ($pids -notcontains [int]$p) { continue }
  $cb = New-Object System.Text.StringBuilder 256; [void][WHide]::GetClassName($h, $cb, 256)
  if ($cb.ToString() -ne "Chrome_WidgetWin_1" -or [WHide]::GetWindowTextLength($h) -eq 0) { continue }
  [void][WHide]::ShowWindow($h, $cmd)
  Write-Output ("{0} hwnd={1} visibleNow={2}" -f $Mode, $h, [WHide]::IsWindowVisible($h))
}
