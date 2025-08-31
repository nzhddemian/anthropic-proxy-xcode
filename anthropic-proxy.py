from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/v1/models', methods=['GET'])
def models():
    return jsonify({
        "object": "list",
        "data": [
            {"id": "claude-3-5-sonnet-20240620", "object": "model", "owned_by": "anthropic"},
            {"id": "claude-3-5-haiku-20241022", "object": "model", "owned_by": "anthropic"},
            {"id": "claude-3-opus-20240229", "object": "model", "owned_by": "anthropic"}
        ]
    })

@app.route('/v1/messages', methods=['POST'])
def messages():
    headers = {
        'x-api-key': request.headers.get('x-api-key'),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
    }
    
    response = requests.post(
        'https://api.anthropic.com/v1/messages',
        headers=headers,
        json=request.json
    )
    
    return response.text, response.status_code

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
