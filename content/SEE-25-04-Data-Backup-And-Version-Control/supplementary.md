---
title: "Supplementary Materials — Data Backup and Version Control"
module: SEE
lesson: "25.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches version control
(concepts R-C-B-M-T, branch-per-feature workflow, semantic versioning, tagged releases, rollback)
and data backup (the 3-2-1 rule; full/incremental/differential), anchored by the Knight Capital
deployment disaster.

### Listing 1 — A feature-branch + tagged-release + rollback workflow (bash)

```bash
# Commit small, branch per feature, never commit straight to main.
git switch main
git switch -c feature/grade-tracking        # branch per feature
# ...edit + commit small, descriptive snapshots...
git add models/grade.py
git commit -m "Add Grade model with range validation (0-100)"
git push -u origin feature/grade-tracking    # open a Pull Request -> review gate (= QA 24-06)

# After review approves the PR, merge to main and tag a release (SemVer):
git switch main
git merge --no-ff feature/grade-tracking
git tag -a v1.4.0 -m "Add grade tracking"    # Major.Minor.Patch -> Minor add
git push origin main --tags

# ROLLBACK when a deploy goes wrong — redeploy the last known-good tag:
git checkout v1.3.7                           # the previous good release
# (re-deploy v1.3.7)  <- the safety net Knight Capital lacked
```

### Listing 2 — A programmed (scheduled) data backup script (Python)

```python
import shutil, subprocess, datetime, pathlib

BACKUP_ROOT = pathlib.Path("/backups")   # local copy (media 1)
OFFSITE = "s3://school-records-offsite"   # off-site copy (media 2, the "1" of 3-2-1)

def backup_database(db_path: str) -> pathlib.Path:
    """Full DB dump + push off-site. Run on a schedule (cron); part of 3-2-1."""
    stamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M")
    dump = BACKUP_ROOT / f"records_{stamp}.sql.gz"
    subprocess.run(f"pg_dump {db_path} | gzip > {dump}", shell=True, check=True)
    # encrypt + replicate off-site (the off-site copy of 3-2-1):
    subprocess.run(["aws", "s3", "cp", str(dump), OFFSITE], check=True)
    verify_restore(dump)   # a backup you've never restored is a HOPE, not a plan
    return dump

def verify_restore(dump: pathlib.Path) -> None:
    """Restore into a throwaway DB and assert row counts — proves the backup works."""
    ...  # restore to scratch DB; compare counts; alert on mismatch
```

### Listing 3 — Backup strategy + SemVer reference table (text)

```text
DATA BACKUP — the "3-2-1" rule (dump this in any backup question)
  3 copies of the data   (original + 2 backups)
  2 different media       (don't let one tech failure wipe all copies)
  1 copy off-site         (survive fire/flood/theft) -> kills "backup = it's on my laptop"

BACKUP TYPES (choose + justify)
  Full          complete copy        safe + simple restore | slow + storage-heavy
  Incremental   changes since LAST backup   fast/small make | slow restore (replay chain)
  Differential  changes since last FULL     middle ground
  Common combo: weekly FULL + daily INCREMENTAL + continuous transaction log; TEST restores.
  Backup = AVAILABILITY (A of CIA-AAA) = disaster recovery / business continuity (vs ransomware).

VERSION CONTROL CONCEPTS — "R-C-B-M-T"
  Repository  full project + history     Commit  snapshot + message
  Branch      isolated parallel work     Merge   combine a branch back
  Tag         marker on a release version
  Discipline: commit small, branch per feature, NEVER commit to main, PR = review gate.

SEMANTIC VERSIONING — Major.Minor.Patch  ("Major breaks, Minor adds, Patch fixes")
  Major (X.0.0)  breaking change      Minor (x.Y.0)  new feature, compatible
  Patch (x.y.Z)  bug fix, compatible
```

### Listing 4 — Knight Capital mapped to today's content (text)

```text
KNIGHT CAPITAL (1 Aug 2012) — ~$440M lost in 45 min; firm destroyed in days

What happened: deploy of new trading code missed 1 of 8 servers (old DEAD code left on it);
a REUSED config flag re-activated the dead code -> millions of erroneous orders; no kill switch,
no rehearsed rollback.

Failure                                 The practice that prevents it
--------------------------------------  --------------------------------------------------------
Inconsistent deploy (1 server missed)   release hygiene + automated, VERIFIED deployment
Leftover dead code in the codebase      version-control + code-review hygiene (remove dead code)
NO rollback plan (the fatal one)        TAGGED last-good release + tested ROLLBACK = revert in sec
Direct big-bang deploy, critical sys.   match implementation method to risk (DiP-PP, 23-03)

LESSON: VCS + tagged releases + tested rollback + disciplined deploy = the difference between a
recoverable mistake and a company-ending one. (Cashes in next episode 25-05 + testing 26-01.)
```
