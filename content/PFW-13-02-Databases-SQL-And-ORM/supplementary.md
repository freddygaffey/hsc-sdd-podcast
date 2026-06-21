---
title: "Supplementary Materials — Databases: SQL, Common Queries and the ORM"
module: PFW
lesson: "13.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches SQL
clause order (So Few Workers Go Home On-time), WHERE vs HAVING, INNER vs LEFT JOIN,
parameterised queries vs SQL injection, and the ORM comparison.

### Listing 1 — A SELECT that joins and groups (clause order: So Few Workers Go Home On-time)

```sql
-- Schema (relevant tables)
-- users(id PK, username, is_active)
-- posts(id PK, title, published, author_id FK -> users.id, category_id FK -> categories.id)

-- "Each user and their number of published posts, most prolific first."
SELECT   u.username,                       -- So  = SELECT (only the fields needed)
         COUNT(p.id) AS post_count         --       COUNT = the aggregate
FROM     users u                           -- Few = FROM
LEFT JOIN posts p ON p.author_id = u.id    -- LEFT JOIN keeps users with ZERO posts
         AND p.published = 1
GROUP BY u.id, u.username                   -- Go  = GROUP BY (every non-aggregated field)
HAVING   COUNT(p.id) > 0                     -- Home = HAVING (filters GROUPS, on an aggregate)
ORDER BY post_count DESC;                    -- On-time = ORDER BY
```

### Listing 2 — SQL injection: vulnerable string-building vs. safe parameterised query

```python
import sqlite3
conn = sqlite3.connect("shop.db")
user_input = request.args.get("name", "")

# !! VULNERABLE — input is glued into the command string.
query = "SELECT * FROM users WHERE name = '" + user_input + "'"
conn.execute(query)
#   If user_input =   x' OR '1'='1
#   the command becomes:  SELECT * FROM users WHERE name = 'x' OR '1'='1'
#   '1'='1' is always true  ->  returns EVERY row. That is SQL injection.

# OK — PARAMETERISED: placeholder + value passed SEPARATELY.
conn.execute("SELECT * FROM users WHERE name = ?", (user_input,))
#   The DB treats user_input strictly as DATA, never as SQL, so the quote can't
#   break out of the string. This separates the command from the data.
#   (Full treatment: Secure Software Architecture 16-01.)
```

### Listing 3 — The same query in raw SQL vs. an ORM (SQLAlchemy)

```python
# RAW SQL — maximum control; you write and read the SQL directly.
rows = conn.execute("""
    SELECT u.username, COUNT(p.id) AS post_count
    FROM users u
    LEFT JOIN posts p ON p.author_id = u.id
    GROUP BY u.id, u.username
    ORDER BY post_count DESC
""").fetchall()

# ORM (SQLAlchemy) — classes map to tables, objects to rows; the ORM generates the SQL.
from sqlalchemy import func
rows = (db.session.query(User.username, func.count(Post.id).label("post_count"))
        .outerjoin(Post)                       # LEFT JOIN, handled for you
        .group_by(User.id, User.username)
        .order_by(func.count(Post.id).desc())
        .all())
# Trade-off: ORM = productivity/portability/readability + auto-parameterised;
#            raw SQL = control/performance for complex queries. ORM still needs SQL knowledge.
```

### Listing 4 — A parameterised search loop in NESA pseudocode

```text
BEGIN SearchProducts
    GET searchTerm FROM request
    VALIDATE searchTerm                       // never trust input

    // Parameterised: the term is bound as DATA, not concatenated into the command.
    statement ← PREPARE "SELECT name, price FROM products WHERE name LIKE ?"
    BIND statement, "%" + searchTerm + "%"
    results ← EXECUTE statement

    FOR each row IN results
        DISPLAY row.name, row.price
    NEXT row
END SearchProducts
```
