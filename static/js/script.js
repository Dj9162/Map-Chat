var map = L.map('map').setView([28.6139, 77.2090], 12);
var storedLocations = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.Control.geocoder({defaultMarkGeocode: true}).addTo(map);

map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    .then(response => response.json())
    .then(data => {
        var address = data.display_name || "Not found";

        fetch('/store-location', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lat, lng, address})
        })
        .then(res => res.json())
        .then(data => {
            storedLocations.push(address);
            var marker = L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${address}</b>`)
                .openPopup();

            markers.push(marker); // store marker reference
            updateLocationList();
        });
    });
});

document.getElementById('send-btn').onclick = function() {
    sendMessage();
};

document.getElementById('chat-input').addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    var input = document.getElementById('chat-input');
    var message = input.value.trim();
    input.value = '';

    if (!message) return;

    var chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML += `<div><b>You:</b> ${message}</div>`;

    if (message.toLowerCase().includes('shortest path')) {
        if (storedLocations.length < 2) {
            chatWindow.innerHTML += `<div><b>Gemini:</b> Please select at least two locations.</div>`;
            return;
        }

        let promptMessage = 'Please clearly specify your starting location by number:<br>';
        storedLocations.forEach((loc, index) => {
            promptMessage += `<button class="start-btn" data-index="${index}">${index + 1}. ${loc}</button><br>`;
        });

        chatWindow.innerHTML += `<div><b>Gemini:</b> ${promptMessage}</div>`;

        document.querySelectorAll('.start-btn').forEach(button => {
            button.onclick = function() {
                var idx = parseInt(this.getAttribute('data-index'));
                drawShortestPath(idx);
                chatWindow.innerHTML += `<div><b>Gemini:</b> I've displayed the shortest route starting from "${storedLocations[idx]}" clearly on the map.</div>`;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            };
        });

        chatWindow.scrollTop = chatWindow.scrollHeight;
        return;
    }

    fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message})
    })
    .then(res => res.json())
    .then(data => {
        chatWindow.innerHTML += `<div><b>Gemini:</b> ${marked.parse(data.response)}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    })
    .catch(err => console.error(err));
}



var markers = []; // to track map markers

function updateLocationList() {
    var chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = `<div><b>Stored Locations:</b></div>`;

    storedLocations.forEach((loc, index) => {
        chatWindow.innerHTML += `
            <div>
                ${index + 1}. ${loc}
                <button class="remove-btn" data-index="${index}">❌ Remove</button>
            </div>
        `;
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.onclick = function() {
            var idx = parseInt(this.getAttribute('data-index'));

            fetch('/remove-location', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({index: idx})
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "removed") {
                    storedLocations.splice(idx, 1);
                    map.removeLayer(markers[idx]); // Remove marker from map
                    markers.splice(idx, 1); // Remove marker from array
                    updateLocationList();
                } else {
                    console.error(data.message);
                }
            });
        };
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.getElementById('toggle-chat').onclick = function() {
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('map').classList.add('fullscreen');
    document.getElementById('show-chat-btn').style.display = 'block';
    map.invalidateSize(); // Leaflet resize fix
};

document.getElementById('show-chat-btn').onclick = function() {
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('map').classList.remove('fullscreen');
    this.style.display = 'none';
    map.invalidateSize(); // Leaflet resize fix
};

var pathLayer;

function drawShortestPath(startIndex = 0) {
    fetch(`/shortest-path?start=${startIndex}`)
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            if (pathLayer) {
                map.removeLayer(pathLayer);
            }

            pathLayer = L.geoJSON(data.geojson, {
                style: {
                    color: '#e74c3c',
                    weight: 5,
                    opacity: 0.8
                }
            }).addTo(map);

            map.fitBounds(pathLayer.getBounds());
            alert('Shortest driving route displayed clearly on map!');
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error fetching the route. Please try again.');
    });
}
