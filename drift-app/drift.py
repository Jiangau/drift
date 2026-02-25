from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))

@app.route('/analyze', methods=["POST"])
def sendAudio():
    try:
        job_id = client.expression_measurement.batch.start_inference_job(
            urls=["https://hume-tutorials.s3.amazonaws.com/faces.zip"],
            models=Models(
                prosody=Prosody(granularity="utterance"),
            ),
        )
        result = client.expression_measurement.batch.get_job_predictions(job_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "status":"error",
            "message": str(e)
        }), 500

    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)