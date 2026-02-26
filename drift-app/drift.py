from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os
import io
import time

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))
print(os.getenv("HUME_API_KEY"))

@app.route('/analyze', methods=["POST"])
def sendAudio():
    try:
        if 'file' not in request.files:
            return jsonify({"error: No file"}),400

        audioFile = request.files['file']
        fileContent = audioFile.read()
        
        jobResponse = client.expression_measurement.batch.start_inference_job(
            [(audioFile.filename, audioFile.stream)],
            models=Models(prosody=Prosody(granularity="utterance"),),
        )
        
        job_id= jobResponse.id
        
        print(jsonify(f"Jobstarted. {job_id}"), 200)
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
        serializable_result = [r.dict() if hasattr(r, 'dict') else r for r in result]
        return jsonify(serializable_result), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status":"error",
            "message": str(e)
        }), 500

    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)