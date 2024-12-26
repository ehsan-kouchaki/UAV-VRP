let map; // Declare the map globally to make it accessible throughout the script
let polylines = []; // Global array to store all drawn polylines
const markers = []; // Store marker references globally to manage them if needed
let polyline = null; // A placeholder for the currently drawn polyline (if needed)

// Initialize the map with default settings
function initMap() {
    // Default center location for the map
    const centerLocation = { lat: 45.81, lng: 15.98 };

    // Create a new map instance and attach it to the #map element
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12, // Initial zoom level
        center: centerLocation, // Map is centered at the default location
    });
}

// Fetch address data from the server
async function fetchAddresses() {
    // Send a GET request to the '/get_addresses' endpoint
    const response = await fetch('/get_addresses');
    // Parse the JSON response
    const data = await response.json();
    // Return the list of addresses
    return data.addresses;
}

// Fetch route data from the server
async function fetchRoutes() {
    // Send a GET request to the '/get_routes' endpoint
    const response = await fetch('/get_routes');
    // Parse the JSON response
    const data = await response.json();
    // Return the list of routes
    return data;
}

// Add markers to the map for each address
async function addMarkers() {
    // Fetch address data
    const addresses = await fetchAddresses();

    // Iterate over each address and create a marker
    addresses.forEach((address) => {
        const marker = new google.maps.Marker({
            position: { lat: address.lat, lng: address.lng }, // Marker position
            map: map, // Attach marker to the map
        });
        markers.push(marker); // Store the marker reference globally
    });
}

// Draw routes on the map by connecting address points
async function drawRoutes() {
    try {
        // Fetch address and route data
        const addresses = await fetchAddresses();
        const routes = await fetchRoutes();

        // Log fetched data for debugging purposes
        console.log("Addresses:", addresses);
        console.log("Routes:", routes);

        // Define an array of colors for different routes
        const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFA500']; // Red, Blue, Green, Orange
        let colorIndex = 0; // Index to cycle through colors

        // Iterate over each route
        Object.keys(routes).forEach((routeIndex) => {
            console.log(`Drawing route #${routeIndex} with points:`, routes[routeIndex]);

            // Map route indices to latitude and longitude pairs
            const path = routes[routeIndex].map((index) => ({
                lat: addresses[index].lat,
                lng: addresses[index].lng,
            }));

            // Create a polyline to represent the route
            const polyline = new google.maps.Polyline({
                path: path, // Define the path as an array of LatLng points
                geodesic: true, // Make the lines follow the curvature of the Earth
                strokeColor: colors[colorIndex % colors.length], // Assign a color from the array
                strokeOpacity: 1.0, // Fully opaque lines
                strokeWeight: 2, // Line thickness
            });

            // Add the polyline to the map
            polyline.setMap(map);

            // Store the polyline reference globally
            polylines.push(polyline);

            // Increment the color index for the next route
            colorIndex++;
        });
    } catch (error) {
        // Log errors to the console for debugging
        console.error("Error drawing routes:", error);
    }
}

// Attach event listeners to buttons in the UI
document.getElementById('add-markers').addEventListener('click', addMarkers); // Add markers on button click
document.getElementById('draw-lines').addEventListener('click', drawRoutes); // Draw routes on button click

// Initialize the map once the page is fully loaded
window.onload = initMap;
