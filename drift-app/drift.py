from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os
import time

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))


@app.route('/analyze', methods=['GET','POST'])
def sendAudio():
    try:
        print("Files arrived:", list(request.files.keys()))
        print(request.files.get('file'))
        audioFile = request.files.get('file')
        
        if audioFile is None:
            print("ERROR:'file missing'")
            return jsonify({"error":"No file received."}),400

        print(f"File received:{audioFile.filename}")
        
        job_id = client.expression_measurement.batch.start_inference_job_from_local_file(
            file=[(audioFile.filename, audioFile.stream)],
            json=Models(prosody=Prosody(granularity="utterance"),),
            
        )
        
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
        serializableResult = [r.dict() if hasattr(r, 'dict') else r for r in result]
        
        fileResult = result[0].results.predictions[0].models
        modelData = None
        
        if fileResult.prosody:
            modelData = fileResult.prosody.grouped_predictions[0].predictions[0]
        else:
            modelData = fileResult.burst.grouped_predictions[0].predictions[0]

        return jsonify(list(serializableResult)), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status":"error",
            "message": str(e)
        }), 500

    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)