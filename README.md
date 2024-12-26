# Google Maps Routes App

This is a Flask application that uses the Google Maps API to visualize routes and markers.

## Features
- Fetch and display markers from `addresses.yaml`.
- Draw routes based on calculated paths.

## Setup
1. To install the application you can create a virtual environment (optional):

python3 -m venv .venv

source .venv/bin/activate

2. Clone the repository:

git clone https://github.com/ehsan-kouchaki/UAV-VRP

cd google-maps-vrp

3. Install dependencies:

pip install -r requirements.txt

## Usage
To use the HMI, you need a Google Maps API Key (https://developers.google.com/maps/documentation/javascript/get-api-key) to load the map into the webpage.

1. Set your Google Maps API Key as an enviroment variable.
    
Linux and Mac:

export MAPS_API_KEY=<YOUR_API_KEY>

Windows:

setx MAPS_API_KEY <YOUR_API_KEY>

2. Run the app:

python3 main.py