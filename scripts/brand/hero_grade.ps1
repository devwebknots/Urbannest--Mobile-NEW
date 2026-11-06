# Builds a guest hero slide (1170 x 1215) matching hero_bg.png: the house photo
# sits in the lower-right, solid navy (#002C5A) sky covers the left and top and
# fades into it, blue-hour grade, navy fade at the bottom. The left side stays
# clear so the headline / Explore button never sit on the building.
# Example: -In photo.jpg -Out hero.jpg -PhotoW 900 -PhotoH 700 -Cx 0.6 -Bright 0.62 -Contrast 1.3
param(
  [string]$In, [string]$Out,
  [int]$PhotoW = 900, [int]$PhotoH = 700,   # size of the photo area (lower-right)
  [double]$Cx = 0.5,                        # horizontal focus inside the source
  [int]$Tint = 40, [int]$Dark = 20,         # blue tint / darkening overlays (0-255)
  [double]$Bright = 1.0, [double]$Contrast = 1.0,
  [int]$FadeLeft = 380                      # width of the left navy fade into the photo
)
Add-Type -AssemblyName System.Drawing
$W = 1170; $H = 1215
$src = [System.Drawing.Image]::FromFile($In)
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
$navy = [System.Drawing.Color]::FromArgb(255, 0, 44, 90)
function C($a, $r, $gg, $b) { [System.Drawing.Color]::FromArgb($a, $r, $gg, $b) }
function P($x, $y) { New-Object System.Drawing.Point ([int]$x), ([int]$y) }
$g.Clear($navy)

# Photo area, anchored to the bottom-right
$px = $W - $PhotoW; $py = $H - $PhotoH
$ar = $PhotoW / $PhotoH
$sh = $src.Height; $sw = [int]($sh * $ar)
if ($sw -gt $src.Width) { $sw = $src.Width; $sh = [int]($sw / $ar) }
$sx = [int]([Math]::Max(0, [Math]::Min($src.Width - $sw, $src.Width * $Cx - $sw / 2)))
$sy = $src.Height - $sh

# Grade: brightness x contrast, cooler (less red, more blue)
$c = $Contrast; $b = $Bright; $t = (1 - $c) / 2
$m = New-Object System.Drawing.Imaging.ColorMatrix
$m.Matrix00 = [single]($c * $b * 0.82); $m.Matrix11 = [single]($c * $b * 0.95); $m.Matrix22 = [single]($c * $b * 1.12)
$m.Matrix33 = 1; $m.Matrix44 = 1
$m.Matrix40 = [single]$t; $m.Matrix41 = [single]$t; $m.Matrix42 = [single]($t + 0.02)
$ia = New-Object System.Drawing.Imaging.ImageAttributes; $ia.SetColorMatrix($m)
$g.DrawImage($src, (New-Object System.Drawing.Rectangle $px, $py, $PhotoW, $PhotoH), $sx, $sy, $sw, $sh, 'Pixel', $ia)

if ($Dark -gt 0) { $g.FillRectangle((New-Object System.Drawing.SolidBrush (C $Dark 0 8 30)), $px, $py, $PhotoW, $PhotoH) }
if ($Tint -gt 0) { $g.FillRectangle((New-Object System.Drawing.SolidBrush (C $Tint 0 60 140)), $px, $py, $PhotoW, $PhotoH) }

# Left fade: solid navy at the photo's left edge -> clear
$lf = New-Object System.Drawing.Drawing2D.LinearGradientBrush (P ($px - 1) 0), (P ($px + $FadeLeft) 0), $navy, (C 0 0 44 90)
$g.FillRectangle($lf, $px, $py, $FadeLeft, $PhotoH)
# Top fade: solid navy at the photo's top edge -> clear
$tfH = [int]($PhotoH * 0.4)
$tf = New-Object System.Drawing.Drawing2D.LinearGradientBrush (P 0 ($py - 1)), (P 0 ($py + $tfH)), $navy, (C 0 0 44 90)
$g.FillRectangle($tf, $px, $py, $PhotoW, $tfH)
# Soft blue glow in the sky above the house (like the design's dusk light)
$gp = New-Object System.Drawing.Drawing2D.GraphicsPath; $gp.AddEllipse($px - 120, $py - 260, $PhotoW + 120, 620)
$pg = New-Object System.Drawing.Drawing2D.PathGradientBrush $gp
$pg.CenterColor = C 80 70 140 240; $pg.SurroundColors = @((C 0 70 140 240))
$g.FillPath($pg, $gp)
# Bottom fade into navy
$bs = $H - 220
$bf = New-Object System.Drawing.Drawing2D.LinearGradientBrush (P 0 ($bs - 1)), (P 0 $H), (C 0 0 44 90), $navy
$g.FillRectangle($bf, 0, $bs, $W, $H - $bs)

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]88)
$bmp.Save($Out, $enc, $ep)
"saved $Out"
