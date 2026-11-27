param([string]$Out = "", [string]$ProcName = "MiniMax Code")
# Lists the top-level windows of a process and, with -Out, saves a PrintWindow capture of its
# largest visible window (works while the window is covered by others; not while hidden/minimized).
$ErrorActionPreference = "Stop"
Add-Type -ReferencedAssemblies System.Drawing @"
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class WShot {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsZoomed(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  public static List<IntPtr> All() {
    var list = new List<IntPtr>();
    EnumWindows((h, l) => { list.Add(h); return true; }, IntPtr.Zero);
    return list;
  }
}
"@
[void][WShot]::SetProcessDPIAware()
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms
$pids = @(Get-Process -Name $ProcName -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
$fg = [WShot]::GetForegroundWindow()
$best = $null; $bestArea = 0
foreach ($h in [WShot]::All()) {
  $p = 0; [void][WShot]::GetWindowThreadProcessId($h, [ref]$p)
  if ($pids -notcontains [int]$p) { continue }
  $sb = New-Object System.Text.StringBuilder 512; [void][WShot]::GetWindowText($h, $sb, 512)
  $cb = New-Object System.Text.StringBuilder 256; [void][WShot]::GetClassName($h, $cb, 256)
  $r = New-Object WShot+RECT; [void][WShot]::GetWindowRect($h, [ref]$r)
  $c = New-Object WShot+RECT; [void][WShot]::GetClientRect($h, [ref]$c)
  $vis = [WShot]::IsWindowVisible($h); $min = [WShot]::IsIconic($h); $max = [WShot]::IsZoomed($h)
  $w = $r.R - $r.L; $hh = $r.B - $r.T
  if ($w -le 1 -or $hh -le 1) { continue }
  $dpi = [WShot]::GetDpiForWindow($h)
  Write-Output ("hwnd={0} pid={1} class={2} vis={3} min={4} max={5} fg={6} rect={7},{8} {9}x{10} client={11}x{12} dpi={13} titleLen={14}" -f $h, $p, $cb.ToString(), $vis, $min, $max, ($h -eq $fg), $r.L, $r.T, $w, $hh, $c.R, $c.B, $dpi, $sb.Length)
  if ($vis -and -not $min -and $cb.ToString() -eq "Chrome_WidgetWin_1" -and ($w * $hh) -gt $bestArea) { $best = $h; $bestArea = $w * $hh; $bw = $w; $bh = $hh }
}
foreach ($s in [System.Windows.Forms.Screen]::AllScreens) {
  Write-Output ("screen {0} bounds={1},{2} {3}x{4} work={5}x{6} primary={7}" -f $s.DeviceName, $s.Bounds.X, $s.Bounds.Y, $s.Bounds.Width, $s.Bounds.Height, $s.WorkingArea.Width, $s.WorkingArea.Height, $s.Primary)
}
if ($Out -and $best) {
  $bmp = New-Object System.Drawing.Bitmap $bw, $bh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $hdc = $g.GetHdc()
  $ok = [WShot]::PrintWindow($best, $hdc, 2)
  $g.ReleaseHdc($hdc); $g.Dispose()
  $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  Write-Output ("captured hwnd={0} ok={1} {2}x{3} -> {4}" -f $best, $ok, $bw, $bh, $Out)
} elseif ($Out) {
  Write-Output "no visible window to capture"
}
