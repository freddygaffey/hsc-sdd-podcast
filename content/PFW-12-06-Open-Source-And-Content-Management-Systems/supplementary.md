---
title: "Supplementary Materials — Open-Source Software and Content Management Systems"
module: PFW
lesson: "12.6"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
open-source pillars (L-C-C), permissive vs copyleft licensing, the supply-chain risk, and
hosted vs self-hosted CMS.

### Listing 1 — Permissive vs. copyleft licence headers (the distinction that matters commercially)

```text
--- PERMISSIVE (MIT) — "Polite": use it almost anywhere, including CLOSED-source products ---
MIT License
Copyright (c) 2025 Example Author
Permission is hereby granted, free of charge, to any person obtaining a copy... to deal in
the Software without restriction, including the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies... subject to: keep this copyright notice.
=> You MAY include this in a proprietary, commercial product. Just keep attribution.

--- COPYLEFT (GPL-3.0) — "Contagious": derivatives must ALSO be open-sourced ---
This program is free software: you can redistribute it and/or modify it under the terms of
the GNU General Public License... Any derivative work that you DISTRIBUTE must also be
licensed under the GPL and its source code made available.
=> Building a distributed product on GPL code can force YOUR product to be open-sourced.
```

### Listing 2 — The contribution workflow = version control at world scale (pillar "C" of L-C-C)

```bash
# Open-source contribution is the same fork -> branch -> pull-request flow as version control.
git clone https://github.com/you/project.git     # 1. clone your fork
git checkout -b fix-typo                          # 2. feature branch
# ... make the change, add a test ...
git commit -m "Fix typo in install docs"          # 3. commit
git push origin fix-typo                          # 4. push to your fork
# 5. open a Pull Request -> 6. maintainers review -> 7. merge or iterate
```

### Listing 3 — Hosted vs. self-hosted CMS: the trade-off table

```text
                     HOSTED (e.g. WordPress.com, Squarespace)   SELF-HOSTED (e.g. WordPress.org)
Setup                Very easy, minutes                          Moderate–complex
Security updates     Handled by the provider                     YOUR responsibility  <-- key risk
Backups              Automatic                                   YOUR responsibility
Customisation        Limited                                     Full control
Data ownership       Provider's platform                         You own it
Cost                 Ongoing subscription                        Hosting + your time
Best for             Non-technical owner, fast launch            Technical team, unique needs

Decision rule (narration): drive the choice from the CLIENT'S capability + who carries the
security/maintenance responsibility — not from "which is more powerful".
```

### Listing 4 — Why patching matters: a dependency / plugin audit (the supply-chain risk)

```bash
# A CMS or app is only as safe as its dependencies AND plugins. Out-of-date = attack surface.
$ npm audit
  found 3 vulnerabilities (1 moderate, 2 high)
  high  Prototype Pollution in some-old-lib  ->  upgrade to >=4.2.1

# Lesson echoed from the xz backdoor (2024): you trust code you didn't write. Keep
# dependencies, the CMS core, and every plugin patched; remove abandoned/unmaintained ones.
# (Supply-chain security is taught in full in Secure Software Architecture.)
```
