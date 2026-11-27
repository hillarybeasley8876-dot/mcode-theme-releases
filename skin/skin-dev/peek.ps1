param([string]$Out, [int]$HoldMs = 1300)
# Shows the client's hidden main window without activating it, saves a PrintWindow capture
# (includes the native caption buttons), then hides it again.
$ErrorActionPreference = "Stop"
Add-Type -ReferencedAssemblies System.Drawing @"
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class Peek {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextLength(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  public static List<IntPtr> All() { var l = new List<IntPtr>(); EnumWindows((h, p) => { l.Add(h); return true; }, IntPtr.Zero); return l; }
}
"@
[void][Peek]::SetProcessDPIAware()
Add-Type -AssemblyName System.Drawing
$pids = @(Get-Process -Name "MiniMax Code" -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
$target = [IntPtr]::Zero
foreach ($h in [Peek]::All()) {
  $p = 0; [void][Peek]::GetWindowThreadProcessId($h, [ref]$p)
  if ($pids -notcontains [int]$p) { continue }
  $cb = New-Object System.Text.StringBuilder 256; [void][Peek]::GetClassName($h, $cb, 256)
  if ($cb.ToString() -eq "Chrome_WidgetWin_1" -and [Peek]::GetWindowTextLength($h) -gt 0) { $target = $h; break }
}
if ($target -eq [IntPtr]::Zero) { Write-Output "no window"; exit 1 }
$wasVisible = [Peek]::IsWindowVisible($target)
if (-not $wasVisible) { [void][Peek]::ShowWindow($target, 4) }
Start-Sleep -Milliseconds $HoldMs
$r = New-Object Peek+RECT; [void][Peek]::GetWindowRect($target, [ref]$r)
$w = $r.R - $r.L; $hh = $r.B - $r.T
$bmp = New-Object System.Drawing.Bitmap $w, $hh
$g = [System.Drawing.Graphics]::FromImage($bmp); $hdc = $g.GetHdc()
$ok = [Peek]::PrintWindow($target, $hdc, 2)
$g.ReleaseHdc($hdc); $g.Dispose()
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
if (-not $wasVisible) { [void][Peek]::ShowWindow($target, 0) }
Write-Output ("captured ok={0} {1}x{2} wasVisible={3} visibleNow={4}" -f $ok, $w, $hh, $wasVisible, [Peek]::IsWindowVisible($target))
