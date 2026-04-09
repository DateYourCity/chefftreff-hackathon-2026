#!/usr/bin/env python3
"""Convert one or more CSV files to JSON arrays.

Defaults:
- input directory: data/csv
- output directory: data/json

Each CSV is converted into a JSON file with the same base name.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


def csv_file_to_json(input_file: Path, output_file: Path, indent: int) -> int:
    """Convert a single CSV file to a JSON array and return row count."""
    with input_file.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with output_file.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=indent)
        f.write("\n")

    return len(rows)


def convert_directory(
    input_dir: Path, output_dir: Path, indent: int
) -> list[tuple[Path, int]]:
    """Convert all CSV files in input_dir to JSON files in output_dir."""
    if not input_dir.exists() or not input_dir.is_dir():
        raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

    csv_files = sorted(input_dir.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in: {input_dir}")

    results: list[tuple[Path, int]] = []
    for csv_file in csv_files:
        output_file = output_dir / f"{csv_file.stem}.json"
        row_count = csv_file_to_json(csv_file, output_file, indent=indent)
        results.append((output_file, row_count))

    return results


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert CSV files to JSON.")
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("data/csv"),
        help="Directory containing CSV files (default: data/csv)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("data/json"),
        help="Directory to write JSON files (default: data/json)",
    )
    parser.add_argument(
        "--indent",
        type=int,
        default=2,
        help="JSON indentation (default: 2)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    results = convert_directory(args.input_dir, args.output_dir, indent=args.indent)

    print(f"Converted {len(results)} file(s):")
    for output_file, row_count in results:
        print(f"- {output_file} ({row_count} rows)")


if __name__ == "__main__":
    main()
