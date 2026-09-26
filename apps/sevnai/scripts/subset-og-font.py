#!/usr/bin/env python3
"""
Regenerate the vendored OG-card font subset in assets/og/.

Only needed when the build warns "OG FONT: some characters will render as
boxes" — i.e. a new post uses a character outside the current subset. The
build already falls back to Google Fonts for missing glyphs; this makes the
fix permanent and offline.

Requirements:
  pip install fonttools
  Noto Sans CJK (.ttc) from https://github.com/notofonts/noto-cjk
  (Debian/Ubuntu: apt install fonts-noto-cjk)

Usage:
  python3 scripts/subset-og-font.py [path/to/NotoSansCJK-Bold.ttc] [path/to/NotoSansCJK-Regular.ttc]

Charset = GB2312 level-1 (3,755 common hanzi) + ASCII + CJK punctuation +
every CJK character currently used in content/ and src/.
"""
import glob
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "og")
DEFAULT_DIR = "/usr/share/fonts/opentype/noto"
SC_INDEX = "2"  # face index of "Noto Sans CJK SC" inside the .ttc

bold = sys.argv[1] if len(sys.argv) > 1 else os.path.join(DEFAULT_DIR, "NotoSansCJK-Bold.ttc")
regular = sys.argv[2] if len(sys.argv) > 2 else os.path.join(DEFAULT_DIR, "NotoSansCJK-Regular.ttc")

chars = set()
for hi in range(0xB0, 0xD8):
    for lo in range(0xA1, 0xFF):
        try:
            chars.add(bytes([hi, lo]).decode("gb2312"))
        except UnicodeDecodeError:
            pass
chars |= {chr(c) for c in range(0x20, 0x7F)}
chars |= set("·—–…‘’“”、，。：；！？（）《》「」『』【】〈〉～￥％＋－×÷＝•→←↑↓↗✓")

pattern = re.compile(r"[\u3000-\u303f\u3400-\u9fff\uff00-\uffef]")
for f in glob.glob(os.path.join(ROOT, "content", "**", "*.md*"), recursive=True) + glob.glob(
    os.path.join(ROOT, "src", "**", "*.ts*"), recursive=True
):
    with open(f, encoding="utf8") as fh:
        chars |= set(pattern.findall(fh.read()))

charset = "".join(sorted(chars))
os.makedirs(OUT, exist_ok=True)
charset_path = os.path.join(OUT, "charset.txt")
with open(charset_path, "w", encoding="utf8") as fh:
    fh.write(charset)

for src, name in [(bold, "Bold"), (regular, "Regular")]:
    subprocess.run(
        [
            sys.executable, "-m", "fontTools.subset", src,
            f"--font-number={SC_INDEX}",
            f"--text-file={charset_path}",
            f"--output-file={os.path.join(OUT, f'NotoSansSC-{name}.subset.otf')}",
            "--layout-features=kern,palt",
            "--no-hinting",
            "--name-IDs=*",
        ],
        check=True,
    )

print(f"{len(chars)} characters → {OUT}")
