from flask import Flask, send_file, request, jsonify
from image_generator import generate_image

app = Flask(__name__)

@app.route("/")
def index():
    return send_file("index.html")

@app.route('/generate_image', methods=['POST'])
def generate_image_endpoint():
    text = request.json['text']
    print(text)
    image = generate_image(text)
    return jsonify({'image': image})

if __name__ == '__main__':
    app.run()