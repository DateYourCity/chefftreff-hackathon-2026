#!/usr/bin/env python3
"""Extract all records for a single patient from all CSV sources.

Defaults:
- input directory: data/csv
- files: ehr_records.csv, lifestyle_survey.csv, wearable_telemetry.csv

Outputs a single JSON object shaped as:
{
  "patient_id": "PT0001",
  "ehr_record": {...} | null,
  "lifestyle_survey": {...} | null,
  "wearable_telemetry": [{...}, ...]
}
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any

CSV_FILES = {
	"ehr_record": "ehr_records.csv",
	"lifestyle_survey": "lifestyle_survey.csv",
	"wearable_telemetry": "wearable_telemetry.csv",
}


def _read_matching_rows(csv_path: Path, patient_id: str) -> list[dict[str, str]]:
	with csv_path.open("r", encoding="utf-8", newline="") as f:
		reader = csv.DictReader(f)
		return [row for row in reader if row.get("patient_id") == patient_id]


def extract_patient_data(patient_id: str, input_dir: Path | str = "data/csv") -> dict[str, Any]:
	"""Return all records for patient_id from the three CSV sources as one object."""
	input_dir = Path(input_dir)

	if not input_dir.exists() or not input_dir.is_dir():
		raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

	ehr_path = input_dir / CSV_FILES["ehr_record"]
	lifestyle_path = input_dir / CSV_FILES["lifestyle_survey"]
	wearable_path = input_dir / CSV_FILES["wearable_telemetry"]

	for required in (ehr_path, lifestyle_path, wearable_path):
		if not required.exists():
			raise FileNotFoundError(f"Required CSV file not found: {required}")

	ehr_rows = _read_matching_rows(ehr_path, patient_id)
	lifestyle_rows = _read_matching_rows(lifestyle_path, patient_id)
	wearable_rows = _read_matching_rows(wearable_path, patient_id)

	return {
		"patient_id": patient_id,
		"ehr_record": ehr_rows[0] if ehr_rows else None,
		"lifestyle_survey": lifestyle_rows[0] if lifestyle_rows else None,
		"wearable_telemetry": wearable_rows,
	}


def _rows_to_columnar(rows: list[dict[str, str]]) -> dict[str, list[Any]] | None:
	"""Encode rows as columns + value matrix to reduce repeated key tokens."""
	if not rows:
		return None

	columns = list(rows[0].keys())
	values = [[row.get(column) for column in columns] for row in rows]
	return {"c": columns, "v": values}


def build_token_efficient_payload(payload: dict[str, Any]) -> dict[str, Any]:
	"""Create a compact payload optimized for LLM token usage."""
	ehr_rows = [payload["ehr_record"]] if payload.get("ehr_record") else []
	lifestyle_rows = [payload["lifestyle_survey"]] if payload.get("lifestyle_survey") else []
	wearable_rows = payload.get("wearable_telemetry", [])

	return {
		"pid": payload["patient_id"],
		"ehr": _rows_to_columnar(ehr_rows),
		"life": _rows_to_columnar(lifestyle_rows),
		"wear": _rows_to_columnar(wearable_rows),
	}


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(
		description="Extract one patient's data from all CSV files and emit JSON."
	)
	parser.add_argument("patient_id", help="Patient identifier, e.g. PT0001")
	parser.add_argument(
		"--input-dir",
		type=Path,
		default=Path("data/csv"),
		help="Directory containing CSV files (default: data/csv)",
	)
	parser.add_argument(
		"--output-file",
		type=Path,
		default=None,
		help="Optional output JSON file path. If omitted, prints to stdout.",
	)
	parser.add_argument(
		"--output-format",
		choices=["json", "token-efficient"],
		default="json",
		help="Output format: full json or compact token-efficient (default: json)",
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
	payload = extract_patient_data(args.patient_id, input_dir=args.input_dir)

	if args.output_format == "token-efficient":
		payload = build_token_efficient_payload(payload)
		indent = None
		separators = (",", ":")
	else:
		indent = args.indent
		separators = None

	if args.output_file:
		args.output_file.parent.mkdir(parents=True, exist_ok=True)
		with args.output_file.open("w", encoding="utf-8") as f:
			json.dump(payload, f, ensure_ascii=False, indent=indent, separators=separators)
			f.write("\n")
		print(f"Wrote patient data to: {args.output_file} (format={args.output_format})")
		return

	print(json.dumps(payload, ensure_ascii=False, indent=indent, separators=separators))


if __name__ == "__main__":
	main()
