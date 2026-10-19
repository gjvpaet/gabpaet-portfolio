"""Trace Gabriel's name, set in Sacramento, into the centerline strokes in
lib/written-name.ts (spec 10.4).

    python3 scripts/trace-name.py [--debug out.png]

Needs Pillow and numpy (a throwaway venv is fine). The name is rendered from
assets/fonts/Sacramento-Regular.ttf (OFL), thinned to a one-pixel skeleton
(Zhang-Suen), turned into a graph of edges between junctions, spurs pruned,
then chained into pen strokes in writing order: STROKES below names each
stroke's start and one point on each edge it runs along, so the order
survives retracing. Each stroke is smoothed along its length and written as a
cubic Bezier path. --debug draws the pruned edges, numbered, over the ink, to
plan a new order.

This replaced Gabriel's real signature on 2026-10-19: a font is nothing anyone
could copy as his signature.
"""

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "assets" / "fonts" / "Sacramento-Regular.ttf"
NAME = "Gabriel Paet"
SIZE = 400  # px; Sacramento's line comes out about 13px wide
OUT = ROOT / "lib" / "written-name.ts"
STROKE_WIDTH = 13  # viewBox units, the width of the rendered ink
SPUR = 12  # px; dead ends shorter than this are dropped

# (start, [a point on each edge, in order]) in rendered pixels. Where the pen
# runs back down a line it went up (the G's stem, the a, the i), a new stroke
# starts at the turn, since one stroke takes each edge once (except where the
# vias come back to it later: an e's loop crosses itself, so the pen goes
# through the crossing, round the loop, and through the crossing again).
STROKES = [
    # G: the top hook, round the big loop and up to the top of the stem.
    ((371, 146), [(70, 196), (330, 196)]),
    # Down the stem, round the descender loop and out to the right.
    ((339, 168), [(330, 196), (330, 265), (335, 310), (265, 477, "cw"), (335, 310), (349, 302)]),
    # a: round the bowl and up its stem.
    ((467, 256), [(398, 293), (458, 297)]),
    # Back down, over to the b, up its loop, down and round its bowl.
    ((459, 289), [(458, 297), (497, 329), (541, 276), (570, 58), (541, 276), (572, 336), (606, 252)]),
    # On to the r, its little loop, and up the i.
    ((619, 306), [(673, 304), (681, 226), (730, 309), (812, 269)]),
    # Down the i, the e's loop, up the l's loop and out.
    ((815, 243), [(812, 269), (843, 335), (898, 302), (934, 251), (898, 302), (952, 331), (1001, 270), (1035, 59), (1001, 270), (1045, 333)]),
    # The i's dot.
    ((820, 182), [(820, 182)]),
    # P: the stem, then the bowl from its inside hook, over the top.
    ((1418, 106), [(1378, 276)]),
    ((1324, 215), [(1360, 49)]),
    # a: round the bowl and up its stem.
    ((1622, 256), [(1553, 293), (1613, 297)]),
    # Back down, the e's loop, up the t, over its top, down and out.
    ((1614, 289), [(1613, 297), (1651, 329), (1697, 302), (1733, 251), (1697, 302), (1748, 332), (1796, 279), (1825, 207), (1818, 109), (1790, 205), (1796, 279), (1844, 330)]),
    # The t's crossbar.
    ((1718, 140), [(1756, 139), (1816, 139), (1886, 139)]),
]

N8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def load_ink():
    font = ImageFont.truetype(str(FONT), SIZE)
    left, top, right, bottom = font.getbbox(NAME)
    pad = 40
    img = Image.new("L", (right - left + pad * 2, bottom - top + pad * 2), 0)
    ImageDraw.Draw(img).text((pad - left, pad - top), NAME, font=font, fill=255)
    return np.array(img.filter(ImageFilter.GaussianBlur(1))) > 110


def thin(img):
    """Zhang-Suen thinning."""
    im = np.pad(img.astype(np.uint8), 1)
    while True:
        changed = False
        for step in (0, 1):
            p2, p3, p4 = im[:-2, 1:-1], im[:-2, 2:], im[1:-1, 2:]
            p5, p6, p7 = im[2:, 2:], im[2:, 1:-1], im[2:, :-2]
            p8, p9 = im[1:-1, :-2], im[:-2, :-2]
            ring = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            b = sum(n.astype(int) for n in ring[:8])
            a = sum(((ring[k] == 0) & (ring[k + 1] == 1)).astype(int) for k in range(8))
            if step == 0:
                c = ((p2 * p4 * p6) == 0) & ((p4 * p6 * p8) == 0)
            else:
                c = ((p2 * p4 * p8) == 0) & ((p2 * p6 * p8) == 0)
            m = (im[1:-1, 1:-1] == 1) & (b >= 2) & (b <= 6) & (a == 1) & c
            if m.any():
                im[1:-1, 1:-1][m] = 0
                changed = True
        if not changed:
            return unstair(im[1:-1, 1:-1].astype(bool))


def unstair(sk):
    """Zhang-Suen leaves diagonal runs two pixels thick (a staircase), which
    reads as a chain of tiny junctions. Drop each corner pixel whose two
    orthogonal neighbours already touch diagonally and that holds nothing
    else on its far side."""
    sk = np.pad(sk, 1)
    h, w = sk.shape
    for y, x in zip(*np.nonzero(sk)):
        n, s, e, wst = sk[y - 1, x], sk[y + 1, x], sk[y, x + 1], sk[y, x - 1]
        for a, b, far in (
            (n, e, (s, wst, sk[y + 1, x - 1])),
            (e, s, (n, wst, sk[y - 1, x - 1])),
            (s, wst, (n, e, sk[y - 1, x + 1])),
            (wst, n, (s, e, sk[y + 1, x + 1])),
        ):
            if a and b and not any(far):
                sk[y, x] = False
                break
    return sk[1:-1, 1:-1]


def graph(skeleton):
    """Edges (pixel polylines) between junction clusters and ends."""
    pts = set(zip(*np.nonzero(skeleton)))

    def nbrs(p):
        return [(p[0] + dy, p[1] + dx) for dy, dx in N8 if (p[0] + dy, p[1] + dx) in pts]

    nodepx = sorted(p for p in pts if len(nbrs(p)) != 2)
    nodeset = set(nodepx)
    cluster = {}
    for p in nodepx:
        if p in cluster:
            continue
        cluster[p] = p
        queue = deque([p])
        while queue:
            for n in nbrs(queue.popleft()):
                if n in nodeset and n not in cluster:
                    cluster[n] = p
                    queue.append(n)
    edges, used = [], set()
    for p in nodepx:
        for n in nbrs(p):
            if n in nodeset or (p, n) in used:
                continue
            path, prev, cur = [p, n], p, n
            while cur not in nodeset:
                nxt = [m for m in nbrs(cur) if m != prev and m not in path[-3:]]
                if not nxt:
                    break
                prev, cur = cur, nxt[0]
                path.append(cur)
            if cur not in nodeset:
                continue
            used.update({(p, path[1]), (cur, path[-2])})
            edges.append({"a": cluster[p], "b": cluster[cur], "pts": [(x, y) for y, x in path]})
    # A ring with no junction on it (the i's dot) has no node to start from:
    # walk each one from its first pixel and close it on itself.
    covered = nodeset | {(y, x) for e in edges for x, y in e["pts"]}
    for p in sorted(pts - covered):
        if p in covered:
            continue
        path, prev, cur = [p], None, p
        while True:
            nxt = [m for m in nbrs(cur) if m != prev and m not in covered and m not in path[1:]]
            if not nxt or nxt[0] == p:
                break
            prev, cur = cur, nxt[0]
            path.append(cur)
        covered |= set(path)
        if len(path) > 2:
            edges.append({"a": p, "b": p, "pts": [(x, y) for y, x in path + [p]]})
    return edges


def length(pts):
    p = np.asarray(pts, float)
    return float(np.hypot(*np.diff(p, axis=0).T).sum()) if len(p) > 1 else 0.0


def prune(edges, spur=30):
    """Drop short dead ends, then merge edges through two-way nodes."""
    def degrees(es):
        deg = {}
        for e in es:
            deg[e["a"]] = deg.get(e["a"], 0) + 1
            deg[e["b"]] = deg.get(e["b"], 0) + 1
        return deg

    edges = [e for e in edges if not (e["a"] == e["b"] and length(e["pts"]) < 10)]
    while True:
        deg = degrees(edges)
        drop = [e for e in edges if length(e["pts"]) < spur and (deg[e["a"]] == 1) != (deg[e["b"]] == 1)]
        if not drop:
            return edges
        edges = [e for e in edges if e not in drop]
        while True:
            deg = degrees(edges)
            two = [n for n, d in deg.items() if d == 2 and not any(e["a"] == e["b"] == n for e in edges)]
            if not two:
                break
            n = two[0]
            e1, e2 = [e for e in edges if n in (e["a"], e["b"])][:2]
            p1 = e1["pts"] if e1["b"] == n else e1["pts"][::-1]
            p2 = e2["pts"] if e2["a"] == n else e2["pts"][::-1]
            merged = {
                "a": e1["a"] if e1["b"] == n else e1["b"],
                "b": e2["b"] if e2["a"] == n else e2["a"],
                "pts": p1 + p2[1:],
            }
            edges = [e for e in edges if e is not e1 and e is not e2] + [merged]


def nearest_edge(edges, point):
    p = np.asarray(point, float)
    return min(edges, key=lambda e: np.hypot(*(np.asarray(e["pts"], float) - p).T).min())


def chain(edges, start, vias):
    """One stroke: the edges through `vias`, each oriented to continue from
    the previous one (consecutive vias on the same edge count once). A
    closed loop starts at its point nearest the pen and runs
    counterclockwise on the page, unless its via ends in "cw"."""
    here, out, last = np.asarray(start, float), [], None
    for via in vias:
        clockwise = len(via) == 3 and via[2] == "cw"
        e = nearest_edge(edges, via[:2])
        if e is last:
            continue
        last = e
        p = list(e["pts"])
        if e["a"] == e["b"]:
            ring = p[:-1]
            i = int(np.argmin(np.hypot(*(np.asarray(ring, float) - here).T)))
            p = ring[i:] + ring[:i] + [ring[i]]
            x, y = np.asarray(p, float).T
            # Positive is clockwise on the page (y runs down).
            if (np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y) > 0) != clockwise:
                p = p[::-1]
        elif np.hypot(*(np.asarray(p[-1]) - here)) < np.hypot(*(np.asarray(p[0]) - here)):
            p = p[::-1]
        out += p if not out else p[1:]
        here = np.asarray(p[-1], float)
    return out


def resample(pts, step=4.0):
    p = np.asarray(pts, float)
    t = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])
    s = np.linspace(0, t[-1], max(int(t[-1] / step), 2))
    return np.stack([np.interp(s, t, p[:, 0]), np.interp(s, t, p[:, 1])], 1)


def smooth(p, sigma=1.5):
    """Gaussian along the stroke (sigma in samples); the ends stay put."""
    k = int(3 * sigma)
    w = np.exp(-0.5 * (np.arange(-k, k + 1) / sigma) ** 2)
    w /= w.sum()
    padded = np.vstack([np.repeat(p[:1], k, 0), p, np.repeat(p[-1:], k, 0)])
    out = np.stack([np.convolve(padded[:, j], w, mode="valid") for j in (0, 1)], 1)
    out[0], out[-1] = p[0], p[-1]
    return out


def simplify(p, eps=0.6):
    """Ramer-Douglas-Peucker."""
    if len(p) < 3:
        return p
    a, ab = p[0], p[-1] - p[0]
    if np.hypot(*ab) < 1e-6:
        # A closed ring (the i's dot): measure from its start instead.
        d = np.hypot(*(p - a).T)
    else:
        d = np.abs(ab[0] * (p[:, 1] - a[1]) - ab[1] * (p[:, 0] - a[0])) / np.hypot(*ab)
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([simplify(p[: i + 1], eps)[:-1], simplify(p[i:], eps)])
    return np.array([p[0], p[-1]])


def bezier(p):
    """Catmull-Rom through the points, as cubic Beziers."""
    d = [f"M{p[0][0]:.0f} {p[0][1]:.0f}"]
    for i in range(len(p) - 1):
        p0, p1, p2 = p[max(i - 1, 0)], p[i], p[i + 1]
        p3 = p[min(i + 2, len(p) - 1)]
        c1, c2 = p1 + (p2 - p0) / 6, p2 - (p3 - p1) / 6
        d.append(f"C{c1[0]:.0f} {c1[1]:.0f} {c2[0]:.0f} {c2[1]:.0f} {p2[0]:.0f} {p2[1]:.0f}")
    return "".join(d)


def main():
    ink = load_ink()
    edges = prune(graph(thin(ink)), SPUR)

    if "--debug" in sys.argv:
        out = Image.fromarray(np.where(ink, 215, 255).astype("uint8")).convert("RGB")
        draw = ImageDraw.Draw(out)
        for i, e in enumerate(edges):
            draw.line(e["pts"], fill=(200, 0, 0), width=3)
            x, y = e["pts"][len(e["pts"]) // 2]
            draw.text((x + 6, y - 6), str(i), fill=(0, 0, 160), font=ImageFont.load_default(28))
            print(i, "from", e["pts"][0], "to", e["pts"][-1], "via", (x, y), "length", round(length(e["pts"])))
        out.save(sys.argv[sys.argv.index("--debug") + 1])
        if not STROKES:
            return

    polys = [simplify(smooth(resample(chain(edges, start, vias)))) for start, vias in STROKES]
    pad = 12
    lo = np.vstack(polys).min(0) - pad
    hi = np.vstack(polys).max(0) + pad
    polys = [p - lo for p in polys]
    w, h = np.round(hi - lo).astype(int)

    lines = [
        "// Gabriel's name in Sacramento, traced by scripts/trace-name.py",
        "// (spec 10.4). Generated: do not edit by hand.",
        "// One entry per pen stroke, in writing order; `length` (viewBox units)",
        "// shares out the signing time so the pen keeps an even pace.",
        "export const writtenName = {",
        f'  viewBox: "0 0 {w} {h}",',
        f"  strokeWidth: {STROKE_WIDTH},",
        "  strokes: [",
    ]
    for p in polys:
        lines.append(f'    {{ length: {round(length(p))}, d: "{bezier(p)}" }},')
    lines += ["  ],", "} as const;", ""]
    OUT.write_text("\n".join(lines))
    print(f"{OUT.relative_to(ROOT)}: viewBox 0 0 {w} {h}, {len(polys)} strokes, {OUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
