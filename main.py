import argparse
import json
import os
from collections import Counter

from ingestion.loader import walk_repo, read_file
from ingestion.chunker import parse_chunks


def main():
    parser = argparse.ArgumentParser(description="Codebase ingestion pipeline")
    parser.add_argument("--repo", required=True, help="Path to the repo to ingest")
    parser.add_argument("--output", default="./output/chunks.json", help="Output JSON file path")
    args = parser.parse_args()

    repo_path = os.path.abspath(args.repo)
    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    all_chunks = []
    files_processed = 0

    for full_path, rel_path, language in walk_repo(repo_path):
        content = read_file(full_path)
        if content is None:
            continue
        chunks = parse_chunks(content, rel_path, language)
        all_chunks.extend(chunks)
        files_processed += 1

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    type_counts = Counter(c["metadata"]["chunk_type"] for c in all_chunks)
    lang_counts = Counter(c["metadata"]["language"] for c in all_chunks)

    print("Ingestion complete")
    print(f"  Files processed : {files_processed}")
    print(f"  Total chunks    : {len(all_chunks)}")
    print(f"  By type         : {', '.join(f'{k}={v}' for k, v in type_counts.items())}")
    print(f"  Languages       : {', '.join(f'{k}={v}' for k, v in lang_counts.items())}")
    print(f"  Output          : {args.output}")


if __name__ == "__main__":
    main()
