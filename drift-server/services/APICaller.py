from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
import time
import os

client = HumeClient(api_key=os.getenv("HUME_API_KEY"))

def apiCaller(audio):
    job_id = client.expression_measurement.batch.start_inference_job_from_local_file(
            file=[(audio.filename, audio.stream)],
            json=Models(prosody=Prosody(granularity="utterance"),),
    )
        
    while True:
        job_details = client.expression_measurement.batch.get_job_details(id=job_id)
        status = job_details.state.status

        if status == "COMPLETED":
            print("Job completed.")
            break
        elif status == "FAILED":
            return {"error":"Job Failed."}

        print(f"Status: {status}")
        time.sleep(3)
    
    result = client.expression_measurement.batch.get_job_predictions(job_id)
    return result