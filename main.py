from flask import Flask, send_file, request, jsonify
from image_generator import generate_image

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
    print(text)
    image = generate_image(text)
    return jsonify({'image': image})

if __name__ == '__main__':
    app.run()