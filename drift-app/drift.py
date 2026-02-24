from hume.expression_measurement.batch.types import Models, Prosody
from hume import HumeClient
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import os

load_dotenv()

app = Flask(__name__)
client = HumeClient(api_key=os.getenv("HUME_API_KEY"))