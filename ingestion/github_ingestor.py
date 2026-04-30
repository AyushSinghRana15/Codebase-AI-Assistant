import os
import tempfile
import shutil
import subprocess
from pathlib import Path
from typing import List, Optional

def clone_github_repo(repo_url: str, branch: Optional[str] = None) -> str:
    """
    Clone a GitHub repository to a temporary directory.
    Returns the path to the cloned repository.
    """
    temp_dir = tempfile.mkdtemp(prefix="codebase_github_")
    
    cmd = ["git", "clone", "--depth", "1"]
    if branch:
        cmd.extend(["--branch", branch])
    cmd.extend([repo_url, temp_dir])
    
    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=60)
        return temp_dir
    except subprocess.CalledProcessError as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise Exception(f"Failed to clone repository: {e.stderr.decode()}")
    except subprocess.TimeoutExpired:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise Exception("Git clone timed out after 60 seconds")

def ingest_github_repo(repo_url: str, branch: Optional[str] = None) -> List[str]:
    """
    Clone a GitHub repo and return list of supported file paths.
    """
    repo_path = clone_github_repo(repo_url, branch)
    
    supported_extensions = {
        '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c',
        '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.md', '.txt'
    }
    
    files = []
    for file_path in Path(repo_path).rglob("*"):
        if file_path.is_file() and file_path.suffix in supported_extensions:
            # Skip common non-essential directories
            parts = file_path.relative_to(repo_path).parts
            if any(p in {'.git', 'node_modules', '__pycache__', 'venv', '.venv'} for p in parts):
                continue
            files.append(str(file_path))
    
    return files

def cleanup_repo(repo_path: str):
    """Clean up cloned repository."""
    shutil.rmtree(repo_path, ignore_errors=True)
