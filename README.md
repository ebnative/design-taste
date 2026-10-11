# Design Taste

A local art and design knowledge base connecting learning, reasoned visual directions and editable Adobe production.

## Project identity

Project ID: `design-taste` · Version: `0.1.0` · Maintainer: `ebnative`\
Profile: Python scripts + skill packages + knowledge base · Project standard: `1.0.0`\
[Scope and acceptance criteria](docs/project.md) · [Architecture](docs/architecture.md) · [Operations](docs/operations.md)

## Requirements and setup

Python 3.10+ and Git. No third-party Python dependencies or pip installation required.
Run the scripts directly with Python; this repository is not a pip package.

## Local development status

30 atlas records (27 imported seeds and three practical records), 62 sources and 12 competency-based learning modules.
Seven pilot claim reviews are attached to exact passages; imported review statuses remain unchanged. Other claims and reuse rights are not thereby verified.
This release does not cover all art movements. No third-party artwork images, font files or books are bundled.
The [original learning-guide cover](examples/learning-guide-cover/README.md) includes three SVG concepts, a selected editable SVG, eight flat PNG previews and a weaker educational comparison. AI pixel review is not expert review or human acceptance; Adobe-native delivery remains unverified.
Identity operations and curriculum are authored guidance, not an executed logo pilot or assessed learner outcomes.

## Skills

- Design Taste: personal expression and visual direction.
- Art & Design Atlas: learning and sourced research.
- Design Critic: critique grounded in the brief and visible evidence.
- Photoshop Designer: layered production using the preserved desktop-control method.
- Illustrator Designer: vector production using the preserved COM/ExtendScript runner.
- After Effects Designer, InDesign Designer and Premiere Pro Designer: production guides; connections have not been verified live.

## Usage

```powershell
python search/query.py 'surrealism' --type movement --asset cover --json
python search/query.py 'photomontage' --type technique
python search/query.py 'readable cover title' --type foundation --asset cover --json
python scripts/check.py
python scripts/install.py --dest '<skill-directory>' --skill design-taste --skill art-design-atlas --skill design-critic
```

Search is lexical: unmatched terms are disclosed and constraints are explicitly not evaluated. Partial matches are not solved briefs.
The installer derives shared data, workflows, curriculum and original examples into each selected skill's `bundle/` directory. The repository is the source of truth.
It refuses existing targets by default; `--update` creates a verified backup and preserves private memory.
It does not automatically retire the legacy Photoshop skill identifier; existing Adobe installations are preserved separately.

## Original expression brief

“Develop a visual direction for a portfolio cover that expresses who I am.”
Meaning → metaphor → composition/color/typography → user choice → actual production.
Keep private user and client data outside the repository. Record approval only from explicit feedback.

## Configuration and verification

Optional `DESIGN_TASTE_PRIVATE_ROOT` specifies private user memory outside the repository.
[.env.example](.env.example) is not loaded automatically. Search requires no API key.
`python scripts/check.py` checks syntax, content, links and functional behavior.
[GitHub Actions](.github/workflows/ci.yml) defines checks for Windows/Linux and Python 3.10/3.12.
Live Adobe production tests are separate.

## Project links

[GitHub](https://github.com/ebnative/design-taste) · [Issues](https://github.com/ebnative/design-taste/issues)\
[Project standard](docs/project-standard.json) · [Architecture decision](docs/decisions/0001-project-standard.md)

## Status

The upstream initial release is public; this development candidate is submitted separately from `main` for review.
Six authorized developments are delivered and independently checked, not seven proven design competencies. Local verification passed 17 tests; independent QA reproduced repository and relocated-package CLI behavior. Live Photoshop verification is blocked by explicit user decision after desktop-control failure; installed software is not connection proof. No application or script workaround is authorized for this wave. Native production and human acceptance remain unresolved gates.
An open-source license for code and content has not been selected. See [sources and rights](docs/sources-and-rights.md).
Repository documentation, instructions, catalog text, examples and search output are in English.
Original personal names and source URLs retain their spelling; external sources may use other languages.
