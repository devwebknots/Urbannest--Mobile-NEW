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
  [double]$Stroke = 1.8,
  # Optional: only draw these icons (e.g. -Only key), leave the rest alone
  [string[]]$Only = @()
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
  # ---- Maintenance request form labels ----
  # lucide: layers
  'layers' = @(
    'path:M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z',
    'path:M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
    'path:M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17'
  )
  # lucide: triangle-alert
  'alert' = @(
    'path:m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
    'path:M12 9v4',
    'path:M12 17h.01'
  )
  # lucide: map-pin
  'pin' = @(
    'path:M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
    'circle:12,10,3'
  )
  # lucide: file-text
  'note' = @(
    'path:M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'path:M14 2v4a2 2 0 0 0 2 2h4',
    'path:M10 9H8',
    'path:M16 13H8',
    'path:M16 17H8'
  )
  # lucide: image-plus
  'image_plus' = @(
    'path:M16 5h6',
    'path:M19 2v6',
    'path:M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5',
    'path:m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
    'circle:9,9,2'
  )
  # lucide: video (camera + lens) with a small plus, like image-plus
  'video_plus' = @(
    'path:m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5',
    'path:M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
    'path:M20 0.5v5',
    'path:M17.5 3h5'
  )
  # lucide: building-2
  'building' = @(
    'path:M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z',
    'path:M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2',
    'path:M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2',
    'path:M10 6h4',
    'path:M10 10h4',
    'path:M10 14h4',
    'path:M10 18h4'
  )
  # ---- Maintenance request: category + voice (draw into icons/renter at -Stroke 2.2
  #      so they match the renter dashboard set) ----
  # lucide: air-vent (HVAC)
  'air_vent' = @(
    'path:M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2',
    'path:M6 8h12',
    'path:M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12',
    'path:M6.6 15.6A2 2 0 1 0 10 17v-5'
  )
  # lucide: ellipsis (Other)
  'ellipsis' = @(
    'circle:12,12,1',
    'circle:19,12,1',
    'circle:5,12,1'
  )
  # tools: lucide wrench (head top right) crossed with a screwdriver
  # (flat tip top left, rounded handle bottom right) - "Need a Fix?" badge
  'tools' = @(
    'path:M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    'path:M4.2 4.2l8.3 8.3',
    'path:M2.6 4.6l2-2',
    'path:M14.91 12.09L21.41 18.59A2 2 0 0 1 18.59 21.41L12.09 14.91A2 2 0 0 1 14.91 12.09Z'
  )
  # lucide: mic
  'mic' = @(
    'path:M12 19v3',
    'path:M19 10v2a7 7 0 0 1-14 0v-2',
    'path:M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'
  )
  # lucide: shield-check
  'shield_check' = @(
    'path:M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'path:m9 12 2 2 4-4'
  )
  # ---- Guest property details (draw into icons/property at -Stroke 2.2):
  #      -Only arrow_left,share,crown,house,database,receipt,shield_check,shield,sparkles,bus,calendar_days,zap,building,note,open_external
  # lucide: arrow-left
  'arrow_left' = @(
    'path:m12 19-7-7 7-7',
    'path:M19 12H5'
  )
  # lucide: share
  'share' = @(
    'path:M12 2v13',
    'path:m16 6-4-4-4 4',
    'path:M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'
  )
  # lucide: crown
  'crown' = @(
    'path:M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z',
    'path:M5 21h14'
  )
  # lucide: house
  'house' = @(
    'path:M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
    'path:M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
  )
  # lucide: database (reads as a coin stack: costs, deposits)
  'database' = @(
    'path:M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0',
    'path:M3 5V19A9 3 0 0 0 21 19V5',
    'path:M3 12A9 3 0 0 0 21 12'
  )
  # lucide: shield
  'shield' = @(
    'path:M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'
  )
  # lucide: sparkles
  'sparkles' = @(
    'path:M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    'path:M20 3v4',
    'path:M22 5h-4',
    'path:M4 17v2',
    'path:M5 18H3'
  )
  # lucide: bus-front
  'bus' = @(
    'path:M4 6 2 7',
    'path:M10 6h4',
    'path:m22 7-2-1',
    'path:M6 3h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'path:M4 11h16',
    'path:M8 15h.01',
    'path:M16 15h.01',
    'path:M6 19v2',
    'path:M18 21v-2'
  )
  # lucide: calendar-days
  'calendar_days' = @(
    'path:M8 2v4',
    'path:M16 2v4',
    'path:M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    'path:M3 10h18',
    'path:M8 14h.01',
    'path:M12 14h.01',
    'path:M16 14h.01',
    'path:M8 18h.01',
    'path:M12 18h.01',
    'path:M16 18h.01'
  )
  # lucide: zap
  'zap' = @(
    'path:M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'
  )
  # lucide: wallet (Costs & Fees: Rent & Fees; also draw 'layers' into icons/property)
  'wallet' = @(
    'path:M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    'path:M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'
  )
  # lucide: square-arrow-out-up-right ("View Floor Plan")
  'open_external' = @(
    'path:M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6',
    'path:m21 3-9 9',
    'path:M15 3h6v6'
  )
  # ---- Rental application (draw into icons/application at -Stroke 2.2):
  #      -Only user,users,mail,pencil,plus,circle_check
  # lucide: user
  'user' = @(
    'path:M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
    'circle:12,7,4'
  )
  # lucide: users
  'users' = @(
    'path:M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'circle:9,7,4',
    'path:M22 21v-2a4 4 0 0 0-3-3.87',
    'path:M16 3.13a4 4 0 0 1 0 7.75'
  )
  # lucide: mail
  'mail' = @(
    'path:m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7',
    'path:M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
  )
  # lucide: pencil
  'pencil' = @(
    'path:M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    'path:m15 5 4 4'
  )
  # lucide: plus
  'plus' = @(
    'path:M5 12h14',
    'path:M12 5v14'
  )
  # lucide: briefcase (rental application step 2, Employment & Income)
  'briefcase' = @(
    'path:M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    'path:M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'
  )
  # ---- Rental application step 3 (icons/application, -Stroke 2.2):
  #      -Only id_card,paw,car,package,upload
  # lucide: id-card
  'id_card' = @(
    'path:M16 10h2',
    'path:M16 14h2',
    'path:M6.17 15a3 3 0 0 1 5.66 0',
    'circle:9,11,2',
    'path:M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'
  )
  # lucide: paw-print
  'paw' = @(
    'circle:11,4,2',
    'circle:18,8,2',
    'circle:20,16,2',
    'path:M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'
  )
  # lucide: car
  'car' = @(
    'path:M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2',
    'circle:7,17,2',
    'path:M9 17h6',
    'circle:17,17,2'
  )
  # lucide: package
  'package' = @(
    'path:M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z',
    'path:M12 22V12',
    'path:m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7',
    'path:m7.5 4.27 9 5.15'
  )
  # lucide: upload
  'upload' = @(
    'path:M12 3v12',
    'path:m17 8-5-5-5 5',
    'path:M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
  )
  # lucide: send (application submitted pill; icons/application, -Stroke 2.2)
  'send' = @(
    'path:M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
    'path:m21.854 2.147-10.94 10.939'
  )
  # lucide: locate-fixed ("Use current location"; icons/application, -Stroke 2.2)
  'locate' = @(
    'path:M2 12h3',
    'path:M19 12h3',
    'path:M12 2v3',
    'path:M12 19v3',
    'circle:12,12,7',
    'circle:12,12,3'
  )
  # lucide: map-pin (address suggestions)
  'map_pin' = @(
    'path:M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
    'circle:12,10,3'
  )
  # ---- Application Status page (icons/application, -Stroke 2.2):
  #      -Only refresh_cw,clock,circle_x,circle_alert,funnel
  # lucide: refresh-cw
  'refresh_cw' = @(
    'path:M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'path:M21 3v5h-5',
    'path:M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'path:M8 16H3v5'
  )
  # lucide: clock
  'clock' = @(
    'circle:12,12,10',
    'path:M12 6v6l4 2'
  )
  # lucide: circle-x
  'circle_x' = @(
    'circle:12,12,10',
    'path:m15 9-6 6',
    'path:m9 9 6 6'
  )
  # lucide: circle-alert
  'circle_alert' = @(
    'circle:12,12,10',
    'path:M12 8v4',
    'path:M12 16h.01'
  )
  # lucide: funnel
  'funnel' = @(
    'path:M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z'
  )
  # lucide: circle-check
  'circle_check' = @(
    'circle:12,12,10',
    'path:m9 12 2 2 4-4'
  )
  # Application Details (application set, -Stroke 2.2)
  # lucide: eye
  'eye' = @(
    'path:M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
    'circle:12,12,3'
  )
  # lucide: handshake
  'handshake' = @(
    'path:m11 17 2 2a1 1 0 1 0 3-3',
    'path:m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4',
    'path:m21 3 1 11h-2',
    'path:M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3',
    'path:M3 4h8'
  )
  # lucide: bed-double
  'bed_double' = @(
    'path:M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8',
    'path:M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4',
    'path:M12 4v6',
    'path:M2 18h20'
  )
  # lucide: graduation-cap
  'graduation_cap' = @(
    'path:M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
    'path:M22 10v6',
    'path:M6 12.5V16a6 3 0 0 0 12 0v-3.5'
  )
  # lucide: file-search
  'file_search' = @(
    'path:M14 2v4a2 2 0 0 0 2 2h4',
    'path:M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3',
    'path:m9 18-1.5-1.5',
    'circle:5,14,3'
  )
  # lucide: file-text
  'file_text' = @(
    'path:M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'path:M14 2v4a2 2 0 0 0 2 2h4',
    'path:M10 9H8',
    'path:M16 13H8',
    'path:M16 17H8'
  )
  # lucide: signature
  'signature' = @(
    'path:m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284',
    'path:M3 21h18'
  )
  # Submitted Application (application set, -Stroke 2.2)
  # lucide: download
  'download' = @(
    'path:M12 15V3',
    'path:M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'path:m7 10 5 5 5-5'
  )
  # lucide file (page + folded corner) with a signature stroke: Lease Review
  'file_signature' = @(
    'path:M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'path:M14 2v4a2 2 0 0 0 2 2h4',
    'path:M8 17c.8-1.6 1.6-2.4 2.2-2.2.7.3-.3 2.2.4 2.4.6.2 1.2-1 1.9-1.1.5 0 .7.7 1.5.9H16'
  )
  # lucide: credit-card (rect as a path): Payment
  'credit_card' = @(
    'path:M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
    'path:M2 10h20'
  )
  # (share reuses property/share.png)
  # lucide: scan (four corners: full screen)
  'expand' = @(
    'path:M3 7V5a2 2 0 0 1 2-2h2',
    'path:M17 3h2a2 2 0 0 1 2 2v2',
    'path:M21 17v2a2 2 0 0 1-2 2h-2',
    'path:M7 21H5a2 2 0 0 1-2-2v-2'
  )
  # lucide file-text, with a check badge in the bottom-right corner
  'file_check' = @(
    'path:M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9l5 5v4',
    'path:M14 2v4a2 2 0 0 0 2 2h4',
    'path:M8 9h2',
    'path:M8 13h5',
    'path:M8 17h2',
    'circle:17.5,17.5,4.5',
    'path:m15.5 17.5 1.5 1.5 2.5-2.5'
  )
}

New-Item -ItemType Directory -Force $OutDir | Out-Null
$out = (Resolve-Path $OutDir).Path
# "-Only a,b" from the command line arrives as one string: split it
$Only = @($Only | ForEach-Object { $_ -split ',' } | Where-Object { $_ })
foreach ($name in $icons.Keys) {
  if ($Only.Count -gt 0 -and $Only -notcontains $name) { continue }
  $file = Join-Path $out "$name.png"
  [SvgLineIcon]::Render($file, [string[]]$icons[$name], $Size, $Stroke)
  Write-Output "wrote $file"
}
