"""Build portable skill packages; update only with explicit --update and verified backups."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import shutil
import tempfile
import uuid

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('design-taste', 'art-design-atlas', 'design-critic', 'photoshop-designer',
         'illustrator-designer', 'after-effects-designer', 'indesign-designer', 'premiere-pro-designer')

def hashes(folder):
    return {p.relative_to(folder).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in folder.rglob('*') if p.is_file()}

def build(name, destination):
    shutil.copytree(ROOT / 'skills' / name, destination)
    for directory in ('atlas', 'knowledge', 'curriculum', 'workflows', 'search', 'adapters', 'examples'):
        shutil.copytree(ROOT / directory, destination / 'bundle' / directory,
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    # Resolve all source links into this package, including links in nested references.
    for path in destination.rglob('*.md'):
        if 'bundle' in path.relative_to(destination).parts:
            continue
        content = path.read_text(encoding='utf-8')
        def replace(match):
            label, target = match.groups()
            if target.startswith(('http:', 'https:', '#')):
                return match.group(0)
            canonical = ((ROOT / 'skills' / name / path.relative_to(destination)).parent / target).resolve()
            try:
                relative = canonical.relative_to(ROOT)
            except ValueError:
                return match.group(0)
            if relative.parts[0] in ('atlas', 'knowledge', 'curriculum', 'workflows', 'search', 'adapters', 'examples'):
                import os
                new_target = os.path.relpath(destination / 'bundle' / relative, path.parent).replace('\\', '/')
                return '[' + label + '](' + new_target + ')'
            return match.group(0)
        content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace, content)
        path.write_text(content, encoding='utf-8')
    (destination / 'bundle/receipt.json').write_text(json.dumps({'package': name,
        'generated_utc': datetime.now(timezone.utc).isoformat(), 'source': 'design-taste',
        'file_hashes': hashes(destination / 'bundle')}, indent=2), encoding='utf-8')

def install(dest, names, update=False):
    dest = Path(dest).resolve()
    # Preflight all selected packages before any active target mutation.
    for name in names:
        if name not in NAMES or not (ROOT / 'skills' / name / 'SKILL.md').is_file():
            raise ValueError('Missing/unknown skill: ' + name)
        target = dest / name
        if target.is_symlink():
            raise RuntimeError('Inspect symlink before installation: ' + str(target))
        if target.exists() and not update:
            raise RuntimeError('Target exists; use --update only for an authorized update: ' + name)
        if target.exists() and any(p.is_symlink() for p in target.rglob('*')):
            raise RuntimeError('Inspect nested symlinks before updating: ' + name)
    dest.mkdir(parents=True, exist_ok=True)
    backup = dest.parent / 'skill-backups' / ('design-taste-' + uuid.uuid4().hex)
    with tempfile.TemporaryDirectory(prefix='design-taste-', dir=dest.parent) as temporary:
        staging = Path(temporary)
        for name in names:
            build(name, staging / name)
            target = dest / name
            if target.exists():
                backup.mkdir(parents=True, exist_ok=True)
                shutil.copytree(target, backup / name)
                if hashes(target) != hashes(backup / name):
                    raise RuntimeError('Backup verification failed: ' + name)
                for private in ('style', 'memory'):
                    if (target / private).exists():
                        shutil.copytree(target / private, staging / name / private, dirs_exist_ok=True)
        for name in names:
            # Merge avoids recursive deletion of active skills; existing user files remain.
            shutil.copytree(staging / name, dest / name, dirs_exist_ok=True)
    return {'installed': list(names), 'backup': str(backup) if backup.exists() else None}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest', required=True)
    parser.add_argument('--skill', action='append', choices=NAMES)
    parser.add_argument('--update', action='store_true')
    args = parser.parse_args()
    print(json.dumps(install(args.dest, args.skill or list(NAMES), args.update), indent=2))
