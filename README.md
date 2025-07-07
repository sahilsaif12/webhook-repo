# 🔗 webhook-repo

## 🌟 Purpose

`webhook-repo` is the backend server that **receives, processes, and stores GitHub webhook events** sent by [`action-repo`](https://github.com/sahilsaif12/action-repo/).  

This repository was created as part of a developer assignment to:
- Build a **Flask-based webhook receiver**
- Persist GitHub event data in **MongoDB**
- Provide an API for a frontend app to fetch and display event logs

---

## 🚀 What does this repository do?

✅ Exposes endpoints:
- `POST /webhook/receiver` → Receives GitHub webhook events for actions like:
  - push
  - pull_request
  - merge (detected from merged PR payload or merge commit)
- `GET /events` → Returns stored events for frontend display (with optional limit)

✅ Stores the following details in MongoDB:
- `author`
- `action_type` (push, pull_request, merge)
- `from_branch`, `to_branch`
- `timestamp`

✅ Provides a clean, minimal API for polling event logs from a frontend.

---

## 🛠 Tech stack

| Technology | Purpose |
|-------------|---------|
| **Flask (Python)** | Web server and API |
| **Flask-CORS** | Allow cross-origin frontend requests |
| **MongoDB** | Event log storage |
| **Waitress / Gunicorn** | Production WSGI server (for local or cloud deployment) |
| **cloudflared** | Exposes local server to public internet for GitHub webhooks |

---

## 📌 How it works

1️⃣ **GitHub sends webhook events** (e.g., from `action-repo`) → to this server’s `/webhook/receiver`.  
2️⃣ The event data is parsed → necessary fields extracted → saved to MongoDB.  
3️⃣ Frontend polls `/events` every 15 seconds → displays formatted logs.

---

