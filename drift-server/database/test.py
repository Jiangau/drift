from flask import Flask
import mysql.connector

app = Flask(__name__)

con = mysql.connector.connect(
    host = 'localhost',
    
)