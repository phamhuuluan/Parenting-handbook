#!/usr/bin/env python3
"""Inject ja/ko/zh blocks into index.html at anchor comments."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"

# Each value is HTML inserted AFTER the anchor line (anchor kept).
BLOCKS = {}

def load_blocks():
    global BLOCKS
    blocks_path = Path(__file__).with_name("cjk-blocks.html")
    text = blocks_path.read_text(encoding="utf-8")
    for part in text.split("<!-- ANCHOR:"):
        if not part.strip():
            continue
        name, _, content = part.partition("-->")
        name = name.strip()
        BLOCKS[name] = content.strip()


def main():
    load_blocks()
    html = INDEX.read_text(encoding="utf-8")
    for name, content in BLOCKS.items():
        anchor = f"<!-- ANCHOR:{name} -->"
        if anchor not in html:
            raise SystemExit(f"missing anchor {anchor}")
        if f"<!-- INJECTED:{name} -->" in html:
            continue
        html = html.replace(
            anchor,
            anchor + "\n" + f"<!-- INJECTED:{name} -->\n" + content,
            1,
        )
    INDEX.write_text(html, encoding="utf-8")
    print("injected", len(BLOCKS), "blocks")


if __name__ == "__main__":
    main()
