import os
from hume import HumeClient
from hume.expression_measurement.batch.types import Models, Prosody

client = HumeClient(api_key=os.getenv("HUME_API_KEY"))

jobId = client.expression_measurement.batch.start_inference_job(
    urls=
)