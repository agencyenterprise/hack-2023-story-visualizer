from flask import Flask, request, jsonify
from image_generator import generate_image, generate_image2

app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route('/logo.svg')
def logo():
    return app.send_static_file("logo.svg")

@app.route('/generate_image', methods=['POST'])
def generate_image_endpoint():
    text = request.json['text']
    # print("main.py -> 17: " + text)
    image = generate_image(text)
    return jsonify({'image': image})

@app.route('/generate_image2', methods=['POST'])
def generate_image_endpoint2():
    text = request.json['text']
    # print("main.py -> 24: " + text)
    image = generate_image2(text)
    return jsonify({'image': image})

if __name__ == '__main__':
    app.run()