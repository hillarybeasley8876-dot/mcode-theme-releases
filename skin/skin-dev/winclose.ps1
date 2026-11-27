# Asks the client's main window to close the way its own X button does (MiniMax Code then hides to the tray).
Add-Type @"
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class WClose {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextLength(IntPtr h);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
  public static List<IntPtr> All() { var l = new List<IntPtr>(); EnumWindows((h, p) => { l.Add(h); return true; }, IntPtr.Zero); return l; }
}
"@
$pids = @(Get-Process -Name "MiniMax Code" -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
foreach ($h in [WClose]::All()) {
  $p = 0; [void][WClose]::GetWindowThreadProcessId($h, [ref]$p)
  if ($pids -notcontains [int]$p) { continue }
  $cb = New-Object System.Text.StringBuilder 256; [void][WClose]::GetClassName($h, $cb, 256)
  if ($cb.ToString() -ne "Chrome_WidgetWin_1" -or [WClose]::GetWindowTextLength($h) -eq 0 -or -not [WClose]::IsWindowVisible($h)) { continue }
  [void][WClose]::PostMessage($h, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero)
  Write-Output ("WM_CLOSE -> hwnd {0}" -f $h)
}
