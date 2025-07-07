from flask import Blueprint, request, jsonify
from datetime import datetime
from app.extensions import events_collection

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

@webhook.route("/receiver", methods=["POST"])
def receiver():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    event_type = request.headers.get("X-GitHub-Event", "").lower()

    record = {
        "author": None,
        "action_type": None,
        "from_branch": None,
        "to_branch": None,
        "timestamp": datetime.utcnow().isoformat(),
        # "_raw": data
    }

    if event_type == "push":
        record["author"] = data.get("pusher", {}).get("name")
        record["action_type"] = "push"
        record["to_branch"] = data.get("ref", "").replace("refs/heads/", "")
        events_collection.insert_one(record)

    elif event_type == "pull_request":
        pr = data.get("pull_request", {})
        record["author"] = pr.get("user", {}).get("login")
        record["action_type"] = "pull_request"
        record["from_branch"] = pr.get("head", {}).get("ref")
        record["to_branch"] = pr.get("base", {}).get("ref")
        if pr.get("merged"):
            record["action_type"] = "merge"
        
        events_collection.insert_one(record)
    
    return jsonify({"status": "saved"}), 200


