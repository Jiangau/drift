from flask import Flask, request, jsonify
from services.apiCaller import apiCaller
from services.topEmotion import topResult

app = Flask(__name__)

@app.route('/analyze', methods=['GET','POST'])
def sendAudio():
    print("Files arrived:", list(request.files.keys()))
    print(request.files.get('file'))
    audioFile = request.files.get('file')
    
    if audioFile is None:
        print("ERROR:'file missing'")
        return jsonify({"error":"No file received."}),400

    print(f"File received:{audioFile.filename}")

    result = apiCaller(audioFile)
    finalOutput = topResult(result)
    
    return jsonify(finalOutput), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)