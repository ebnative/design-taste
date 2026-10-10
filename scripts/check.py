"""Run syntax, content and behavioral checks without extra dependencies."""
import ast
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

def main():
    files = [p for p in ROOT.rglob('*.py') if not any(part in ('.git', '.work', 'dist') for part in p.relative_to(ROOT).parts)]
    for file in files:
        ast.parse(file.read_text(encoding='utf-8-sig'), filename=str(file))
    print('Python syntax checked: ' + str(len(files)), flush=True)
    subprocess.run([sys.executable, str(ROOT / 'scripts/validate.py')], cwd=ROOT, check=True)
    subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests', '-v'], cwd=ROOT, check=True)

if __name__ == '__main__':
    main()
