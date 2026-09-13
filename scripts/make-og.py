"""Render the Open Graph card to public/og.png.

A link shared into Slack, LinkedIn or a text message without an OG image looks
broken, which is a poor first impression for a product whose whole argument is
carefulness. This draws the card from the same brand tokens the site uses, so
the two cannot drift.

    python scripts/make-og.py

Uses the closest stock faces to Instrument Sans and IBM Plex Mono on whichever
machine runs it: Segoe UI and Consolas on Windows, Helvetica and Menlo on macOS.
The card is a static image, so the substitution is invisible to the reader.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# --- brand, mirrored from src/styles/tokens.css ----------------------------
BG = (253, 252, 248)       # --bg
SURFACE = (255, 255, 255)  # --surface
LINE = (216, 214, 205)     # --line-hi
TEXT = (11, 15, 13)        # --text
TEXT_MID = (71, 79, 74)    # --text-mid
TEXT_DIM = (95, 103, 95)   # --text-dim
BRAND = (21, 56, 44)       # --brand, the forest ink
SIGNAL = (52, 218, 146)    # --signal, the mint dot

W, H = 1200, 630
PAD = 76

# Role -> candidate files, first one found wins. (file, face index in a .ttc)
FONTS: dict[str, list[tuple[str, int]]] = {
    "display": [("C:/Windows/Fonts/georgia.ttf", 0), ("/System/Library/Fonts/NewYork.ttf", 0)],
    "semibold": [("C:/Windows/Fonts/seguisb.ttf", 0), ("/System/Library/Fonts/Helvetica.ttc", 1)],
    "body": [("C:/Windows/Fonts/segoeui.ttf", 0), ("/System/Library/Fonts/Helvetica.ttc", 0)],
    "mono": [("C:/Windows/Fonts/consola.ttf", 0), ("/System/Library/Fonts/Menlo.ttc", 0)],
    "mono-bold": [("C:/Windows/Fonts/consolab.ttf", 0), ("/System/Library/Fonts/Menlo.ttc", 1)],
}


def font(role: str, size: int) -> ImageFont.FreeTypeFont:
    for path, index in FONTS[role]:
        if Path(path).exists():
            return ImageFont.truetype(path, size, index=index)
    print(f"no font found for role {role!r}", file=sys.stderr)
    raise SystemExit(1)


PAGES = {
    "home": {
        "kicker": "FOR RESIDENTIAL PROPERTY MANAGERS  ·  200–800 DOORS",
        "line1": "Month-end owner statements",
        "line2a": "in ",
        "line2b": "under an hour.",
        "sub": "Every figure carries the cell it came from.",
        "out": "og.png",
    },
    "method": {
        "kicker": "THE PLAINSTATE METHOD",
        "line1": "Rules for a number",
        "line2a": "that has to be ",
        "line2b": "right.",
        "sub": "Reconcile first. Cite, or stay silent. A person approves.",
        "out": "og-method.png",
    },
}


def main() -> None:
    page = PAGES[sys.argv[1] if len(sys.argv) > 1 else "home"]
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # A soft mint wash in the top-left, echoing the hero aura. Drawn as
    # widening translucent ellipses rather than a real gradient, which PIL has
    # no primitive for.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i in range(26, 0, -1):
        r = i * 36
        alpha = int(2.4 * (26 - i) / 26 * 10)
        gd.ellipse([-260 - r // 3, -420 - r // 3, -260 + r, -420 + r],
                   fill=(*SIGNAL, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    d = ImageDraw.Draw(img)

    # --- wordmark: the same file the nav uses ------------------------------
    public = Path(__file__).resolve().parents[1] / "public"
    mark = Image.open(public / "wordmark.png").convert("RGBA")
    mh = 34
    mark = mark.resize((round(mark.width * mh / mark.height), mh), Image.LANCZOS)
    img.paste(mark, (PAD, PAD - 4), mark)

    # --- kicker -----------------------------------------------------------
    d.text((PAD, 188), page["kicker"], font=font("mono", 19), fill=BRAND)

    # --- headline ---------------------------------------------------------
    # Display type is heavy and tightly set, matching the page.
    head = font("display", 72)
    y = 228
    d.text((PAD, y), page["line1"], font=head, fill=TEXT)
    y += 80
    d.text((PAD, y), page["line2a"], font=head, fill=TEXT)
    off = d.textlength(page["line2a"], font=head)
    d.text((PAD + off, y), page["line2b"], font=head, fill=BRAND)

    # --- supporting line --------------------------------------------------
    d.text((PAD, 400), page["sub"], font=font("body", 29), fill=TEXT_MID)

    # --- a citation, rendered as the product renders one -------------------
    cy, ch = 456, 78
    d.rounded_rectangle([PAD, cy, W - PAD, cy + ch], radius=16, fill=SURFACE, outline=LINE)
    d.rectangle([PAD, cy + 2, PAD + 3, cy + ch - 2], fill=SIGNAL)

    mono = font("mono", 22)
    mono_b = font("mono-bold", 26)
    d.text((PAD + 26, cy + 25), "12,480.00", font=mono_b, fill=TEXT)
    label = "OwnerStatement_Aug.csv"
    lx = PAD + 26 + d.textlength("12,480.00", font=mono_b) + 34
    d.text((lx, cy + 28), label, font=mono, fill=TEXT_DIM)
    d.text((lx + d.textlength(label, font=mono) + 18, cy + 28), "B6", font=mono_b, fill=BRAND)

    # No rule under the card: the card already has an edge there, and a second
    # line at the same y just gets occluded.
    d.text(
        (PAD, H - 58),
        "Reads Buildium and AppFolio  ·  Never touches your ledger",
        font=font("mono", 19),
        fill=TEXT_DIM,
    )

    out = public / page["out"]
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out.relative_to(out.parents[1])}  {W}x{H}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
