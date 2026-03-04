from flask import jsonify, request, Blueprint

fileReader = Blueprint("fileReader", __name__)

@fileReader.route("/upload", methods=['POST'])
def upload():
    print("Files arrived:", list(request.files.keys()))
    print(request.files.get('file'))
    audioFile = request.files.get('file')

    if audioFile is None:
        print("ERROR:'file missing'")
        return jsonify({"error":"No file received."}),400
    
    print(f"File received:{audioFile.filename}")
    
    return audioFile.filename