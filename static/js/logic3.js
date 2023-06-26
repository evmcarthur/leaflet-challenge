// Create the map instance
var map = L.map('map').setView([0, 0], 2);

// Create the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Load the earthquake data from the provided URL
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
    .then(response => response.json())
    .then(data => {
        // Process each earthquake feature
        data.features.forEach(feature => {
            var magnitude = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            var title = feature.properties.title;
            var place = feature.properties.place;

            // Define the marker options based on magnitude and depth
            var markerOptions = {
                radius: magnitude * 3,
                fillOpacity: 1 - (depth / 70),
                color: getColor(depth), // Assign color based on depth
                fillColor: getColor(depth) // Assign color based on depth
            };

            // Create the marker
            var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions);

            // Add a popup with earthquake details
            marker.bindPopup(`
                <strong>Title:</strong> ${title}<br>
                <strong>Place:</strong> ${place}<br>
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km
            `);

            // Add the marker to the map
            marker.addTo(map);
        });
    });

// Create a legend control
var legend = L.control({ position: 'bottomright' });

// Define the legend content
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = '#fff'; // Set background color to white
    div.style.padding = '10px'; // Add padding to the legend
    var depths = [0, 10, 20, 30, 40, 50, 60, 70];
    var labels = [];

    // Generate the labels for the legend
    for (var i = 0; i < depths.length - 1; i++) {
        var depthRange = depths[i] + ' km &ndash; ' + depths[i + 1] + ' km';
        var color = getColor(depths[i + 1]);

        div.innerHTML +=
            '<i style="background:' + color + '"></i> ' +
            '<span style="margin-left: 5px">' + depthRange + '</span><br>';
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);

// Helper function to determine the color based on depth
function getColor(depth) {
    return depth >= 70 ? '#800026' :
        depth >= 60 ? '#BD0026' :
        depth >= 50 ? '#E31A1C' :
        depth >= 40 ? '#FC4E2A' :
        depth >= 30 ? '#FD8D3C' :
        depth >= 20 ? '#FEB24C' :
        depth >= 10 ? '#FED976' :
        '#FFEDA0';
}

