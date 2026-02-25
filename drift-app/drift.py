from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os
import time

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))
print(os.getenv("HUME_API_KEY"))

@app.route('/analyze', methods=["POST"])
def sendAudio():
    try:
        if 'file' not in request.files:
            return jsonify({"error: No file in this part"}),400

        audioFile = request.files['file']
        
        job_id = client.expression_measurement.batch.start_inference_job(
            files =[(audioFile.filename, audioFile.read())],
            models=Models(prosody=Prosody(granularity="utterance"),),
        )
        
        while True:
            job_details = client.expression_measurement.batch.get_job_details(id=job_id)
            status = job_details.state.status

            if status == "COMPLETED":
                print("Job completed.")
                break
            elif status == "FAILED":
                print("Job failed.")
                break

            print(f"Status: {status}")
            time.sleep(3)

            
        result = client.expression_measurement.batch.get_job_predictions(job_id)
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            "status":"error",
            "message": str(e)
        }), 500

    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)