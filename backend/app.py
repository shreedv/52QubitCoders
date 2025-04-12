from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from PIL import Image
import pytesseract
import openai
import os
import csv
import datetime
import numpy as np
import cv2
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(_name_)
CORS(app)

# Load API keys and Mongo URI from environment variables
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize PyMongo
mongo = PyMongo(app)

# Windows Tesseract Path (change or remove for other OS)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Directory for saving CSVs
CSV_FOLDER = "csv_exports"
os.makedirs(CSV_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "✅ Backend is running!"

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        # Convert uploaded image to OpenCV format
        image = Image.open(file.stream).convert("RGB")
        open_cv_image = np.array(image)
        open_cv_image = open_cv_image[:, :, ::-1].copy()

        # OCR using Tesseract
        extracted_text = pytesseract.image_to_string(open_cv_image)
        cleaned_text = extracted_text.replace('\n', ' ').strip()

        return jsonify({
            'filename': file.filename,
            'extracted_text': cleaned_text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    extracted_text = data.get("text")

    if not extracted_text:
        return jsonify({'error': 'No extracted text provided'}), 400

    try:
        prompt = f"""
        Extract the following fields from this bill text:
        - Vendor Name
        - Invoice Number
        - Date
        - Total Amount
        - Tax Amount
        - Due Date
        - Line Items (each with Description, Quantity, Price, Amount)

        Return the result in JSON format. Here is the bill text:
        {extracted_text}
        """

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        extracted_info = response['choices'][0]['message']['content']
        structured_data = json.loads(extracted_info)
        structured_data['created_at'] = datetime.datetime.utcnow()

        # Save to MongoDB
        mongo.db.bills.insert_one(structured_data)

        # Save to CSV
        csv_filename = f"bill_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        csv_path = os.path.join(CSV_FOLDER, csv_filename)

        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = structured_data.keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerow(structured_data)

        return jsonify({
            "message": "Bill processed and stored successfully.",
            "data": structured_data,
            "csv_path": csv_path
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/bills', methods=['GET'])
def get_bills():
    bills = list(mongo.db.bills.find({}, {'_id': 0}))
    return jsonify(bills)

if _name_ == '_main_':
    app.run(debug=True)
