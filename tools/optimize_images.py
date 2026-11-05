#!/usr/bin/env python3
"""Prepare transparent, optimized WebP portraits for the employee slideshow."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Mar"
DATA = ROOT / "data.js"


def selected_files() -> list[str]:
    text = DATA.read_text(encoding="utf-8")
    block = text.split("employees: [", 1)[1].split("\n  ]", 1)[0]
    return list(dict.fromkeys(re.findall(r"photoFile:\\s*\\`([^\\`]+\\.png)\\`", block)))


def convert(filename: str, session: object | None, quality: int) -> tuple[bool, int, int]:
    source = SOURCE / filename
    output = source.with_suffix(".webp")
    if not source.is_file():
        print(f"WARNING: missing original: {source.relative_to(ROOT)}")
        return False, 0, 0
    try:
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGBA")
            alpha = image.getchannel("A")
            has_transparency = alpha.getextrema()[0] < 250
            if not has_transparency:
                if session is None:
                    print(f"WARNING: no removal model; retain PNG: {filename}")
                    return False, 0, 0
                from rembg import remove

                image = remove(image, session=session)
                image = image.convert("RGBA")
                # Do not publish a falsely transparent portrait.
                if image.getchannel("A").getextrema()[0] >= 250:
                    print(f"WARNING: no background removed; retain PNG: {filename}")
                    return False, 0, 0
            # Keep the full photo dimensions, avoiding unwanted crop or upscale.
            image.save(output, format="WEBP", quality=quality, method=6, exact=True)
        src_bytes, out_bytes = source.stat().st_size, output.stat().st_size
        if out_bytes >= src_bytes:
            print(f"INFO: WebP not smaller; retain PNG: {filename} ({src_bytes} -> {out_bytes})")
            output.unlink(missing_ok=True)
            return False, src_bytes, out_bytes
        print(f"OK {filename} -> {output.name}: {src_bytes:,} -> {out_bytes:,} bytes")
        return True, src_bytes, out_bytes
    except Exception as exc:
        output.unlink(missing_ok=True)
        print(f"WARNING: failed to optimize {filename}: {exc}", file=sys.stderr)
        return False, 0, 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--quality", type=int, default=85)
    parser.add_argument("--model", default="u2netp")
    args = parser.parse_args()
    if not 1 <= args.quality <= 100:
        parser.error("quality must be 1..100")
    filenames = selected_files()
    if not filenames:
        print("ERROR: no employee photos found", file=sys.stderr)
        return 1
    # Model is only initialized when some input is opaque.
    opaque = []
    for filename in filenames:
        path = SOURCE / filename
        if not path.is_file():
            continue
        with Image.open(path) as photo:
            if photo.convert("RGBA").getchannel("A").getextrema()[0] >= 250:
                opaque.append(filename)
    session = None
    if opaque:
        try:
            from rembg import new_session

            session = new_session(args.model)
        except Exception as exc:
            print(f"WARNING: background model unavailable: {exc}", file=sys.stderr)
    done = 0
    old_bytes = new_bytes = 0
    for filename in filenames:
        ok, original, optimized = convert(filename, session, args.quality)
        if ok:
            done += 1
            old_bytes += original
            new_bytes += optimized
    print(f"RESULT: {done}/{len(filenames)} converted; {old_bytes:,} -> {new_bytes:,} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
