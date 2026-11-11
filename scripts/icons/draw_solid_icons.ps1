# Draws solid (filled) icons for the Maintenance ticket tiles as white
# 128 x 128 PNGs (tinted at runtime with tintColor). Shapes are built on a
# 100-unit grid, drawn 4x larger and scaled down for smooth edges.
#   hvac.png        three-blade fan with a hub
#   plumbing.png    wall tap with handle, spout and a water drop
#   electrical.png  lightning bolt with soft corners
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File scripts/icons/draw_solid_icons.ps1

param(
  [string]$OutDir = (Join-Path $PSScriptRoot '..\..\src\assets\icons\maintenance'),
  [int]$Size = 128
)

Add-Type -AssemblyName System.Drawing

$big = $Size * 4
$k = $big / 100.0

function New-Canvas {
  $bmp = New-Object System.Drawing.Bitmap $big, $big
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  return @($bmp, $g)
}

function Save-Small($bmp, $name) {
  $small = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($small)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($bmp, 0, 0, $Size, $Size)
  $file = Join-Path $out "$name.png"
  $small.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $small.Dispose()
  Write-Output "wrote $file"
}

function P([double]$x, [double]$y) { New-Object System.Drawing.PointF ([float]($x * $k)), ([float]($y * $k)) }

function Add-RoundRect($path, [double]$x, [double]$y, [double]$w, [double]$h, [double]$r) {
  $d = 2 * $r * $k
  $X = $x * $k; $Y = $y * $k; $W = $w * $k; $H = $h * $k
  $path.StartFigure()
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

New-Item -ItemType Directory -Force $OutDir | Out-Null
$out = (Resolve-Path $OutDir).Path
$white = [System.Drawing.Brushes]::White
$clear = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Transparent)

# ---------- hvac: three curved blades + hub ----------
$c = New-Canvas; $bmp = $c[0]; $g = $c[1]
foreach ($angle in 0, 120, 240) {
  $blade = New-Object System.Drawing.Drawing2D.GraphicsPath
  # Petal from the centre out to the tip and back, curving clockwise
  $blade.AddBezier((P 50 50), (P 38 38), (P 36 10), (P 56 8))
  $blade.AddBezier((P 56 8), (P 76 6), (P 72 34), (P 50 50))
  $blade.CloseFigure()
  $m = New-Object System.Drawing.Drawing2D.Matrix
  $m.RotateAt($angle, (P 50 50))
  $blade.Transform($m)
  $g.FillPath($white, $blade)
}
# Hub ring: solid disc, then a clear gap around a small centre dot
$g.FillEllipse($white, (38 * $k), (38 * $k), (24 * $k), (24 * $k))
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$g.FillEllipse($clear, (43 * $k), (43 * $k), (14 * $k), (14 * $k))
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
$g.FillEllipse($white, (46.5 * $k), (46.5 * $k), (7 * $k), (7 * $k))
Save-Small $bmp 'hvac'
$g.Dispose(); $bmp.Dispose()

# ---------- plumbing: wall plate, body, handle, spout, drop ----------
$c = New-Canvas; $bmp = $c[0]; $g = $c[1]
$tap = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundRect $tap 8 30 9 30 3      # wall plate
Add-RoundRect $tap 14 34 38 20 6    # body
Add-RoundRect $tap 28 12 34 9 4.5   # handle bar
Add-RoundRect $tap 40 18 9 18 2     # handle stem
$tap.FillMode = [System.Drawing.Drawing2D.FillMode]::Winding
$g.FillPath($white, $tap)
# Spout: thick rounded line from the body, bending down
$spout = New-Object System.Drawing.Drawing2D.GraphicsPath
$spout.AddLine((P 46 44), (P 62 44))
$spout.AddArc((54 * $k), (44 * $k - 0 ), (16 * $k), (16 * $k), 270, 90)
$spout.AddLine((P 70 52), (P 70 62))
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([float](14 * $k))
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($pen, $spout)
# Water drop under the spout
$drop = New-Object System.Drawing.Drawing2D.GraphicsPath
$drop.AddBezier((P 70 74), (P 66 80), (P 63 84), (P 63 88))
$drop.AddBezier((P 63 88), (P 63 96), (P 77 96), (P 77 88))
$drop.AddBezier((P 77 88), (P 77 84), (P 74 80), (P 70 74))
$drop.CloseFigure()
$g.FillPath($white, $drop)
Save-Small $bmp 'plumbing'
$g.Dispose(); $bmp.Dispose()

# ---------- electrical: lightning bolt with soft corners ----------
$c = New-Canvas; $bmp = $c[0]; $g = $c[1]
$bolt = New-Object System.Drawing.Drawing2D.GraphicsPath
$bolt.AddPolygon([System.Drawing.PointF[]]@((P 58 8), (P 22 56), (P 46 56), (P 40 92), (P 78 40), (P 54 40), (P 62 8)))
$soft = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([float](6 * $k))
$soft.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.FillPath($white, $bolt)
$g.DrawPath($soft, $bolt)
Save-Small $bmp 'electrical'
$g.Dispose(); $bmp.Dispose()
