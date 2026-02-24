from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))

@app.route("/analyze", methods=["POST"])
def audioSend():

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)