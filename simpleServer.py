from flask import Flask, request, jsonify
import whisper

app = Flask(__name__)
model = whisper.load_model("base")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return "No audio file", 400

    audio_file = request.files['audio']
    result = model.transcribe(audio_file)
    return jsonify({"transcription": result["text"]})

if __name__ == '__main__':
    app.run(debug=True)