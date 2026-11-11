# Draws modern line icons (Lucide, ISC licence, https://lucide.dev) as white
# 128 x 128 PNGs for the app (tinted at runtime with tintColor).
# Each icon is the original 24 x 24 SVG path data, scaled up, stroked with
# round caps / joins and anti-aliasing.
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File scripts/icons/draw_line_icons.ps1

param(
  [string]$OutDir = (Join-Path $PSScriptRoot '..\..\src\assets\icons\manage'),
  [int]$Size = 128,
  # Stroke width on the 24-unit grid (Lucide default is 2)
  [double]$Stroke = 1.8
)

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text.RegularExpressions;

public static class SvgLineIcon
{
    static readonly Regex Tok = new Regex(@"[MmLlHhVvCcSsQqAaZz]|[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?");

    public static void AddPath(GraphicsPath gp, string d, float k)
    {
        var toks = new List<string>();
        foreach (Match m in Tok.Matches(d)) toks.Add(m.Value);
        int i = 0; char cmd = 'M';
        float x = 0, y = 0, sx = 0, sy = 0, lcx = 0, lcy = 0; char prev = ' ';
        Func<float> n = () => float.Parse(toks[i++], CultureInfo.InvariantCulture);
        bool open = false;
        while (i < toks.Count)
        {
            if (char.IsLetter(toks[i][0])) { cmd = toks[i][0]; i++; }
            bool rel = char.IsLower(cmd);
            char c = char.ToUpper(cmd);
            float ox = rel ? x : 0, oy = rel ? y : 0;
            switch (c)
            {
                case 'M':
                    x = ox + n(); y = oy + n(); sx = x; sy = y;
                    gp.StartFigure(); open = true;
                    cmd = rel ? 'l' : 'L';
                    break;
                case 'L': { float nx = ox + n(), ny = oy + n(); gp.AddLine(x * k, y * k, nx * k, ny * k); x = nx; y = ny; break; }
                case 'H': { float nx = (rel ? x : 0) + n(); gp.AddLine(x * k, y * k, nx * k, y * k); x = nx; break; }
                case 'V': { float ny = (rel ? y : 0) + n(); gp.AddLine(x * k, y * k, x * k, ny * k); y = ny; break; }
                case 'C':
                {
                    float x1 = ox + n(), y1 = oy + n(), x2 = ox + n(), y2 = oy + n(), nx = ox + n(), ny = oy + n();
                    gp.AddBezier(x * k, y * k, x1 * k, y1 * k, x2 * k, y2 * k, nx * k, ny * k);
                    lcx = x2; lcy = y2; x = nx; y = ny; break;
                }
                case 'S':
                {
                    float x1 = (prev == 'C' || prev == 'S') ? 2 * x - lcx : x, y1 = (prev == 'C' || prev == 'S') ? 2 * y - lcy : y;
                    float x2 = ox + n(), y2 = oy + n(), nx = ox + n(), ny = oy + n();
                    gp.AddBezier(x * k, y * k, x1 * k, y1 * k, x2 * k, y2 * k, nx * k, ny * k);
                    lcx = x2; lcy = y2; x = nx; y = ny; break;
                }
                case 'Q':
                {
                    float qx = ox + n(), qy = oy + n(), nx = ox + n(), ny = oy + n();
                    gp.AddBezier(x * k, y * k, (x + 2f / 3 * (qx - x)) * k, (y + 2f / 3 * (qy - y)) * k,
                        (nx + 2f / 3 * (qx - nx)) * k, (ny + 2f / 3 * (qy - ny)) * k, nx * k, ny * k);
                    x = nx; y = ny; break;
                }
                case 'A':
                {
                    float rx = n(), ry = n(), phi = n(); int fa = (int)n(), fs = (int)n();
                    float nx = ox + n(), ny = oy + n();
                    Arc(gp, x, y, rx, ry, phi, fa != 0, fs != 0, nx, ny, k);
                    x = nx; y = ny; break;
                }
                case 'Z':
                    if (open) { gp.CloseFigure(); open = false; }
                    x = sx; y = sy; break;
            }
            prev = c;
        }
    }

    // SVG arc (endpoint form) -> cubic beziers
    static void Arc(GraphicsPath gp, double x1, double y1, double rx, double ry, double phiDeg,
        bool large, bool sweep, double x2, double y2, float k)
    {
        if (rx == 0 || ry == 0) { gp.AddLine((float)x1 * k, (float)y1 * k, (float)x2 * k, (float)y2 * k); return; }
        rx = Math.Abs(rx); ry = Math.Abs(ry);
        double phi = phiDeg * Math.PI / 180, cp = Math.Cos(phi), sp = Math.Sin(phi);
        double dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
        double x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy;
        double lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
        if (lam > 1) { double s = Math.Sqrt(lam); rx *= s; ry *= s; }
        double num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
        double den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
        double co = Math.Sqrt(Math.Max(0, num / den)) * (large == sweep ? -1 : 1);
        double cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx;
        double cx = cp * cxp - sp * cyp + (x1 + x2) / 2, cy = sp * cxp + cp * cyp + (y1 + y2) / 2;
        Func<double, double, double, double, double> ang = (ux, uy, vx, vy) =>
        {
            double a = Math.Atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a;
        };
        double t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
        double dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
        if (!sweep && dt > 0) dt -= 2 * Math.PI; else if (sweep && dt < 0) dt += 2 * Math.PI;
        int segs = (int)Math.Ceiling(Math.Abs(dt) / (Math.PI / 2));
        double step = dt / segs, a0 = t1;
        for (int s = 0; s < segs; s++)
        {
            double a1 = a0 + step, al = 4.0 / 3 * Math.Tan(step / 4);
            double c0 = Math.Cos(a0), s0 = Math.Sin(a0), c1 = Math.Cos(a1), s1 = Math.Sin(a1);
            double[] p = { c0, s0, c0 - al * s0, s0 + al * c0, c1 + al * s1, s1 - al * c1, c1, s1 };
            var pts = new PointF[4];
            for (int j = 0; j < 4; j++)
            {
                double ex = p[j * 2] * rx, ey = p[j * 2 + 1] * ry;
                pts[j] = new PointF((float)((cp * ex - sp * ey + cx) * k), (float)((sp * ex + cp * ey + cy) * k));
            }
            gp.AddBezier(pts[0], pts[1], pts[2], pts[3]);
            a0 = a1;
        }
    }

    // elements: "path:<d>" or "circle:cx,cy,r"
    public static void Render(string file, string[] elements, int size, float stroke)
    {
        float k = size / 24f;
        using (var bmp = new Bitmap(size, size, System.Drawing.Imaging.PixelFormat.Format32bppArgb))
        using (var g = Graphics.FromImage(bmp))
        using (var pen = new Pen(Color.White, stroke * k))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.Transparent);
            pen.StartCap = LineCap.Round; pen.EndCap = LineCap.Round; pen.LineJoin = LineJoin.Round;
            foreach (var el in elements)
            {
                using (var gp = new GraphicsPath())
                {
                    if (el.StartsWith("circle:"))
                    {
                        var v = el.Substring(7).Split(',');
                        float cx = float.Parse(v[0], CultureInfo.InvariantCulture), cy = float.Parse(v[1], CultureInfo.InvariantCulture),
                              r = float.Parse(v[2], CultureInfo.InvariantCulture);
                        gp.AddEllipse((cx - r) * k, (cy - r) * k, 2 * r * k, 2 * r * k);
                    }
                    else AddPath(gp, el.Substring(5), k);
                    g.DrawPath(pen, gp);
                }
            }
            bmp.Save(file, System.Drawing.Imaging.ImageFormat.Png);
        }
    }
}
'@

$icons = [ordered]@{
  # lucide: wrench
  'wrench' = @(
    'path:M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
  )
  # lucide: receipt-text
  'receipt' = @(
    'path:M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z',
    'path:M14 8H8',
    'path:M16 12H8',
    'path:M13 16H8'
  )
  # lucide: calendar (rect written as a path: x3 y4 18x18 rx2)
  'calendar' = @(
    'path:M8 2v4',
    'path:M16 2v4',
    'path:M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    'path:M3 10h18'
  )
  # lucide: dumbbell (classic)
  'dumbbell' = @(
    'path:m6.5 6.5 11 11',
    'path:m21 21-1-1',
    'path:m3 3 1 1',
    'path:m18 22 4-4',
    'path:m2 6 4-4',
    'path:m3 10 7-7',
    'path:m14 21 7-7'
  )
  # lucide: key-round
  'key' = @(
    'path:M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z',
    'circle:16.5,7.5,0.5'
  )
}

New-Item -ItemType Directory -Force $OutDir | Out-Null
$out = (Resolve-Path $OutDir).Path
foreach ($name in $icons.Keys) {
  $file = Join-Path $out "$name.png"
  [SvgLineIcon]::Render($file, [string[]]$icons[$name], $Size, $Stroke)
  Write-Output "wrote $file"
}
