#!/usr/bin/env python3
"""Installe les PNG MDR/IVDR extraits de la planche validée.

Usage: python scripts/install-mdr-png-icons.py orbivia_mdr_ivdr_96_png.zip
Cette commande copie seulement les images; elle ne change pas les règles de classification.
"""
from __future__ import annotations
import argparse
import json
import pathlib
import struct
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET = ROOT / "outils" / "classification" / "icones-raster"

def install(zip_path: pathlib.Path) -> int:
    with zipfile.ZipFile(zip_path) as archive:
        mapping = json.loads(archive.read("mapping.json"))
        if len(mapping) != 96:
            raise ValueError("Le pack doit contenir exactement 96 associations MDR/IVDR")
        TARGET.mkdir(parents=True, exist_ok=True)
        for question_id in mapping:
            if not question_id.replace("_", "").isalnum():
                raise ValueError(f"Identifiant non conforme : {question_id}")
            source_path = f"site/{question_id}.png"
            png = archive.read(source_path)
            if not png.startswith(b"\x89PNG\r\n\x1a\n"):
                raise ValueError(f"Ce fichier n'est pas un PNG : {source_path}")
            width, height = struct.unpack(">II", png[16:24])
            if (width, height) != (96, 96):
                raise ValueError(f"Dimensions invalides : {source_path} ({width}×{height})")
            (TARGET / f"{question_id}.png").write_bytes(png)
    print(f"96 PNG installés dans {TARGET.relative_to(ROOT)}")
    print("Vérifier le site, puis versionner les PNG avec Git.")
    return 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("zip", type=pathlib.Path, help="Archive fournie avec les 96 images PNG")
    args = parser.parse_args()
    raise SystemExit(install(args.zip))
