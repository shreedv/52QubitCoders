import requests

# Path to the image file you want to test with
image_path = 'hospital.jpg'  # change to your actual image file name

url = 'http://127.0.0.1:5000/upload'

# Open image in binary mode and send it as a POST request
with open(image_path, 'rb') as img:
    files = {'image':('hospital.jpg', img,'image/jpeg')}
    response = requests.post(url, files=files)

# Print the response from the server
print("Status Code:", response.status_code)
print("Response:", response.json())


