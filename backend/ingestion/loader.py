import os
from ingestion.utils import detect_language, is_excluded, relative_path, MAX_FILE_SIZE


def walk_repo(root_path):
    root_path = os.path.abspath(root_path)
    for dirpath, dirnames, filenames in os.walk(root_path):
        dirnames[:] = [d for d in dirnames if not is_excluded(os.path.join(dirpath, d))]
        for fname in filenames:
            full_path = os.path.join(dirpath, fname)
            if is_excluded(full_path):
                continue
            language = detect_language(full_path)
            if language is None:
                continue
            try:
                size = os.path.getsize(full_path)
            except OSError:
                continue
            if size > MAX_FILE_SIZE:
                continue
            rel_path = relative_path(full_path, root_path)
            yield (full_path, rel_path, language)


def read_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        return None
    except OSError:
        return None
