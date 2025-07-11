from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route('/')
def index():
    session['locations'] = []  # initialize empty list
    return render_template('index.html')

@app.route('/store-location', methods=['POST'])
def store_location():
    data = request.json
    if 'locations' not in session:
        session['locations'] = []
    session['locations'].append(data)
    session.modified = True
    return jsonify({"status": "Location added", "total_locations": len(session['locations'])})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    locations = session.get('locations', [])

    locations_info = "\n".join(
        [f"{i+1}. {loc['address']} (Lat: {loc['lat']}, Lng: {loc['lng']})" for i, loc in enumerate(locations)]
    )

    prompt = f"""
    These are the stored locations:
    {locations_info}

    User question:
    {user_message}

    Provide an informative response considering the above locations.
    """

    response = model.generate_content(prompt)
    return jsonify({"response": response.text.strip()})

@app.route('/remove-location', methods=['POST'])
def remove_location():
    data = request.json
    index = data.get('index')

    if 'locations' in session and 0 <= index < len(session['locations']):
        removed = session['locations'].pop(index)
        session.modified = True
        return jsonify({"status": "removed", "removed": removed})
    else:
        return jsonify({"status": "error", "message": "Invalid index"}), 400


if __name__ == '__main__':
    app.run(debug=True)
