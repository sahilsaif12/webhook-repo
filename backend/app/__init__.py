from flask import Flask, request, jsonify
from flask_cors import CORS
from app.webhook.routes import webhook
from app.extensions import events_collection


# Creating our flask app
def create_app():

    app = Flask(__name__)
    
    CORS(app)
    @app.route('/')
    def home():
        return "Welcome to the GitHub Webhook Receiver backend!"

   
    @app.route("/events", methods=["GET"])
    def get_events():
        limit = request.args.get("limit", type=int)

        query = events_collection.find().sort("_id", -1)

        if limit:
            query = query.limit(limit)

        events = list(query)

        # Convert ObjectId to string for JSON
        for e in events:
            e["_id"] = str(e["_id"])

        return jsonify(events), 200

    # registering all the blueprints
    app.register_blueprint(webhook)
    
    return app
