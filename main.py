"""
A Flask web application that serves a Google Maps-based interface with addresses and routes.

This application provides endpoints to:
1. Load and display addresses from a YAML file as markers on a map.
2. Generate and display routes between addresses using the OR-Tools routing solver.

Modules:
- flask: Used for creating the web application and handling requests.
- yaml: For loading and parsing YAML files.
- subprocess: For executing external Python scripts.

Author:
- Ehsan Kouchaki
"""

import os
from flask import Flask, jsonify, render_template
import yaml
import subprocess

app = Flask(__name__)

# Read the API key from the environment variable
MAPS_API_KEY = os.getenv('MAPS_API_KEY')

@app.route('/')
def index():
    """
    Render the main web page.

    This function serves the index page of the application, which includes a Google Map and buttons for interacting
    with addresses and routes.

    Returns:
        A rendered HTML template (index_main.html) as the response.
    """
    return render_template('index.html', api_key=MAPS_API_KEY)

@app.route('/get_addresses', methods=['GET'])
def get_addresses():
    """
    Load addresses from a YAML file and serve them as a JSON response.

    This endpoint reads the 'addresses.yaml' file, which contains a list of geographical points (latitude and longitude),
    and sends the data to the client.

    Returns:
        JSON response containing the list of addresses from the 'addresses.yaml' file.
    """
    with open('addresses.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
    return jsonify(addresses)

@app.route('/get_routes', methods=['GET'])
def get_routes():
    """
    Generate routes using OR-Tools and serve them as a JSON response.

    This endpoint executes the 'ortools_routes.py' script to compute optimal routes based on the addresses in the
    'addresses.yaml' file. The generated routes are saved in 'routes.yaml' and then served to the client.

    Workflow:
    1. Run 'ortools_routes.py' using the subprocess module.
    2. Load the generated 'routes.yaml' file.
    3. Send the routes data as a JSON response.

    Returns:
        JSON response containing the routes from the 'routes.yaml' file.
    """
    # Run the Python script to generate routes.yaml
    subprocess.run(['python3', 'ortools_routes.py'], check=True)

    # Load the generated routes.yaml
    with open('routes.yaml', 'r') as file:
        routes = yaml.safe_load(file)
    return jsonify(routes)

if __name__ == '__main__':
    """
    Run the Flask application in debug mode.

    The application listens on the default localhost address (127.0.0.1) and port (5000).
    """
    app.run(debug=True)
