from hume.expression_measurement.batch.types import Models, Prosody
from flask import Blueprint, jsonify, request
from hume import HumeClient
import time
import os

callAPI = Blueprint('callAPI', __name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))


@callAPI.route('/analyze', methods=['GET','POST'])
def callAPI(audioFile):
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
    return result