---
title: "Supplementary Materials — Modelling a Web Development System"
module: PFW
lesson: "12.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
three tiers (Front, Back, Store), the client-vs-server trust boundary, and the SQL
(Spreadsheet) vs NoSQL (Notebook) choice.

### Listing 1 — The same data as a SQL table vs. a NoSQL document

```sql
-- SQL = a "Spreadsheet of tables": fixed schema, rows & columns, relationships.
CREATE TABLE books (
    id     INTEGER PRIMARY KEY,
    title  TEXT    NOT NULL,
    author TEXT    NOT NULL,
    price  REAL    NOT NULL
);

INSERT INTO books (id, title, author, price)
VALUES (1, 'Web Standards', 'J. Smith', 39.99);
```

```json
// NoSQL = a "Notebook of documents": flexible shape, no fixed schema.
// Two records can have different fields — note the second has "tags", the first doesn't.
{ "_id": 1, "title": "Web Standards", "author": "J. Smith", "price": 39.99 }
{ "_id": 2, "title": "Async Patterns", "author": "M. Tan",  "price": 44.00,
  "tags": ["javascript", "advanced"], "formats": ["ebook", "print"] }
```

### Listing 2 — The three tiers in one request (Front calls Back; only Back touches Store)

```python
# BACK (server-side, Python/Flask): routes, business logic, the ONLY tier that queries the DB.
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route("/api/books/<int:book_id>")          # routing
def get_book(book_id):
    conn = sqlite3.connect("bookstore.db")       # STORE: only the back end opens this
    row = conn.execute(
        "SELECT title, author, price FROM books WHERE id = ?", (book_id,)
    ).fetchone()
    conn.close()
    if row is None:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"title": row[0], "author": row[1], "price": row[2]})

@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()
    # SERVER-SIDE validation — the security boundary; never rely on the browser's check.
    if not data.get("book_id") or not data.get("customer_email"):
        return jsonify({"error": "Missing required fields"}), 400
    # ... save order, call payment API, send confirmation ...
    return jsonify({"order_id": 12345}), 201
```

```javascript
// FRONT (client-side, runs in the browser): presentation + interaction only.
// It calls the back end's API — it never talks to the database directly.
async function loadBook(bookId) {
  const res = await fetch(`/api/books/${bookId}`);   // Front -> Back over HTTP
  const book = await res.json();
  document.getElementById("book-title").textContent = book.title;   // presentation
  document.getElementById("book-price").textContent = `$${book.price}`;
}
```

### Listing 3 — Why client-side validation alone fails (the SSA forward-link)

```bash
# The browser form checks the password with JavaScript — but an attacker skips the page
# entirely and posts straight to the API. No JavaScript ever runs.
curl -X POST https://shop.example.com/api/register \
     -H "Content-Type: application/json" \
     -d '{"email":"x","password":"123"}'      # weak values sail past the client-side check

# Lesson: the SERVER must re-validate. Client-side validation = convenience;
# server-side validation = security. (Taught in full in Secure Software Architecture.)
```
