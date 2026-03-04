from flask import Blueprint

callAPI = Blueprint('callAPI', __name__)

@callAPI.route('/analyze', methods=['GET','POST'])
