param([string]$OutDir, [double]$Seconds = 17, [int]$IntervalMs = 180, [int]$X = 320, [int]$Y = 180, [int]$W = 1920, [int]$H = 1080)
# Screen-grabs a fixed rectangle at a steady interval. Uses GDI BitBlt with CAPTUREBLT directly (the .NET
# CopyFromScreen wrapper rejects that flag), so layered windows such as the boot launcher are included.
# File names carry the seconds since this script started.
$ErrorActionPreference = "Stop"
Add-Type -ReferencedAssemblies System.Drawing @"
using System; using System.Drawing; using System.Runtime.InteropServices;
public static class Grab {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr h);
  [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr h, IntPtr dc);
  [DllImport("gdi32.dll")] static extern IntPtr CreateCompatibleDC(IntPtr dc);
  [DllImport("gdi32.dll")] static extern IntPtr CreateCompatibleBitmap(IntPtr dc, int w, int h);
  [DllImport("gdi32.dll")] static extern IntPtr SelectObject(IntPtr dc, IntPtr o);
  [DllImport("gdi32.dll")] static extern bool BitBlt(IntPtr d, int x, int y, int w, int h, IntPtr s, int sx, int sy, uint rop);
  [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr o);
  [DllImport("gdi32.dll")] static extern bool DeleteDC(IntPtr dc);
  public static Bitmap Shot(int x, int y, int w, int h) {
    IntPtr screen = GetDC(IntPtr.Zero), mem = CreateCompatibleDC(screen), bmp = CreateCompatibleBitmap(screen, w, h);
    IntPtr old = SelectObject(mem, bmp);
    BitBlt(mem, 0, 0, w, h, screen, x, y, 0x00CC0020u | 0x40000000u);   // SRCCOPY | CAPTUREBLT
    SelectObject(mem, old);
    Bitmap result = Image.FromHbitmap(bmp);
    DeleteObject(bmp); DeleteDC(mem); ReleaseDC(IntPtr.Zero, screen);
    return result;
  }
}
"@
[void][Grab]::SetProcessDPIAware()
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 88L
$sw = [Diagnostics.Stopwatch]::StartNew()
$i = 0
while ($sw.Elapsed.TotalSeconds -lt $Seconds) {
  $t = $sw.Elapsed.TotalSeconds
  $bmp = [Grab]::Shot($X, $Y, $W, $H)
  $bmp.Save((Join-Path $OutDir ("s_{0:000}_{1:00.00}.jpg" -f $i, $t)), $codec, $ep)
  $bmp.Dispose()
  $i++
  $wait = $i * $IntervalMs / 1000.0 - $sw.Elapsed.TotalSeconds
  if ($wait -gt 0) { Start-Sleep -Milliseconds ([int]($wait * 1000)) }
}
Write-Output ("grabbed {0} frames in {1:0.0}s" -f $i, $sw.Elapsed.TotalSeconds)
