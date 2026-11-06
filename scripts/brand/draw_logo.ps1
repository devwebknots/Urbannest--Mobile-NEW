# Draws the Urban Nest house logo (src/assets/images/brand/urban_nest_logo.png).
# Usage: powershell -File scripts/brand/draw_logo.ps1 -Out <png> [-Scale 2] [-Bg #RRGGBB]
# Shape coordinates are in a 240 x 232 box; Scale multiplies the output size.
param([string]$Out, [double]$Scale = 3, [string]$Bg = '')
Add-Type -AssemblyName System.Drawing
$W = 240; $H = 232
$bmp = New-Object System.Drawing.Bitmap ([int]($W*$Scale)), ([int]($H*$Scale))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.PixelOffsetMode = 'HighQuality'; $g.CompositingQuality = 'HighQuality'
if ($Bg) { $g.Clear([System.Drawing.ColorTranslator]::FromHtml($Bg)) } else { $g.Clear([System.Drawing.Color]::Transparent) }
$g.ScaleTransform($Scale, $Scale)
function C($r,$gg,$b,$a=255){ [System.Drawing.Color]::FromArgb($a,$r,$gg,$b) }
function PF($x,$y){ New-Object System.Drawing.PointF ([single]$x),([single]$y) }

# Closed polygon with a rounded corner (radius r) at each vertex: @(x,y,r, ...)
function RoundPoly($v) {
  $n = $v.Length / 3; $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $pts = @(); for ($i=0;$i -lt $n;$i++){ $pts += ,@($v[$i*3],$v[$i*3+1],$v[$i*3+2]) }
  for ($i=0;$i -lt $n;$i++) {
    $p=$pts[$i]; $a=$pts[($i-1+$n)%$n]; $b=$pts[($i+1)%$n]; $r=$p[2]
    $da=[Math]::Sqrt(($a[0]-$p[0])*($a[0]-$p[0])+($a[1]-$p[1])*($a[1]-$p[1]))
    $db=[Math]::Sqrt(($b[0]-$p[0])*($b[0]-$p[0])+($b[1]-$p[1])*($b[1]-$p[1]))
    $r=[Math]::Min($r,[Math]::Min($da,$db)/2)
    $p1=PF ($p[0]+($a[0]-$p[0])/$da*$r) ($p[1]+($a[1]-$p[1])/$da*$r)
    $p2=PF ($p[0]+($b[0]-$p[0])/$db*$r) ($p[1]+($b[1]-$p[1])/$db*$r)
    $k=0.55
    $c1=PF ($p1.X+($p[0]-$p1.X)*$k) ($p1.Y+($p[1]-$p1.Y)*$k)
    $c2=PF ($p2.X+($p[0]-$p2.X)*$k) ($p2.Y+($p[1]-$p2.Y)*$k)
    if ($i -eq 0) { $path.StartFigure() } else { $path.AddLine($prev, $p1) }
    $path.AddBezier($p1,$c1,$c2,$p2); $prev=$p2; if($i -eq 0){$first=$p1}
  }
  $path.AddLine($prev,$first); $path.CloseFigure(); return ,$path
}

$outer = RoundPoly @(0,232,22, 0,86,30, 120,0,24, 240,86,30, 240,232,22)
$hole  = RoundPoly @(58,190,8, 58,100,12, 120,54,14, 168,89,3, 168,260,0, 137,260,0, 137,153,17, 116,153,11, 79,190,9)
$body = New-Object System.Drawing.Region $outer
$body.Exclude($hole)
# Round the two bottom corners beside the door gap
function CutCorner($region, $sx, $sy, $cx, $cy, $r) {
  $sq = New-Object System.Drawing.Region (New-Object System.Drawing.RectangleF ([single]$sx), ([single]$sy), ([single]$r), ([single]$r))
  $circ = New-Object System.Drawing.Drawing2D.GraphicsPath
  $circ.AddEllipse([single]($cx-$r), [single]($cy-$r), [single](2*$r), [single](2*$r))
  $sq.Exclude($circ); $region.Exclude($sq)
}
CutCorner $body 168 220 180 220 12
CutCorner $body 125 220 125 220 12

# Main ribbon: pale ice blue (top-left) -> vivid blue (bottom-right), 45 deg
$lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush (PF 20 20), (PF 220 220), (C 255 255 255), (C 0 0 0)
$cb = New-Object System.Drawing.Drawing2D.ColorBlend 5
$cb.Colors = @((C 238 246 255),(C 190 219 251),(C 122 180 253),(C 46 132 253),(C 18 98 242))
$cb.Positions = @([single]0,[single]0.22,[single]0.45,[single]0.66,[single]1)
$lg.InterpolationColors = $cb
$g.FillRegion($lg, $body)

# Right leg folds under the roof: darker face below a soft curve
$fold = New-Object System.Drawing.Drawing2D.GraphicsPath
$fold.StartFigure()
$fold.AddBezier((PF 168 89),(PF 200 106),(PF 230 126),(PF 240 168))
$fold.AddLine((PF 240 168),(PF 250 240)); $fold.AddLine((PF 250 240),(PF 160 240)); $fold.AddLine((PF 160 240),(PF 168 89))
$fold.CloseFigure()
$legR = $body.Clone(); $legR.Intersect($fold)
$lg2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush (PF 186 84), (PF 214 238), (C 0 0 0), (C 0 0 0)
$cb2 = New-Object System.Drawing.Drawing2D.ColorBlend 4
$cb2.Colors = @((C 8 62 205),(C 14 84 232),(C 18 98 248),(C 34 116 255))
$cb2.Positions = @([single]0,[single]0.3,[single]0.65,[single]1)
$lg2.InterpolationColors = $cb2
$g.FillRegion($lg2, $legR)
# Soft sheen along the right edge of the folded leg
$g.SetClip($legR, [System.Drawing.Drawing2D.CombineMode]::Replace)
# Shadow just under the fold line
for ($i=6; $i -ge 1; $i--) {
  $pen = New-Object System.Drawing.Pen (C 4 40 150 (14)), ($i*2.2)
  $g.DrawBezier($pen,(PF 168 89),(PF 200 106),(PF 230 126),(PF 240 168))
}
$g.ResetClip()

# Hook: ribbon curls over the left wall at the bottom
$g.SetClip($body, [System.Drawing.Drawing2D.CombineMode]::Replace)
$curl = New-Object System.Drawing.Drawing2D.GraphicsPath
$curl.StartFigure(); $curl.AddBezier((PF 56 189),(PF 58 212),(PF 68 226),(PF 86 234))
$curl.AddLine((PF 86 234),(PF 140 234)); $curl.AddLine((PF 140 234),(PF 140 186)); $curl.AddLine((PF 140 186),(PF 56 189)); $curl.CloseFigure()
$lg3 = New-Object System.Drawing.Drawing2D.LinearGradientBrush (PF 56 182), (PF 142 236), (C 92 160 255), (C 34 116 252)
for ($i=5; $i -ge 1; $i--) {
  $pen = New-Object System.Drawing.Pen (C 20 70 190 (12)), ($i*1.8)
  $g.DrawBezier($pen,(PF 56 189),(PF 58 212),(PF 68 226),(PF 86 234))
}
$g.ResetClip()

$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
