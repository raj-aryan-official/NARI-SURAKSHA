let map;
let marker;
let directionsService;
let directionsRenderer;

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 }, // India center coordinates
        zoom: 5,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
    });

    // Initialize Places Autocomplete
    const startInput = document.querySelector('input[placeholder="Enter Start Location"]');
    const endInput = document.querySelector('input[placeholder="Enter Destination"]');
    
    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    // Track button click handler
    document.querySelector('.btn').addEventListener('click', () => {
        calculateAndDisplayRoute();
    });
}

function calculateAndDisplayRoute() {
    const start = document.querySelector('input[placeholder="Enter Start Location"]').value;
    const end = document.querySelector('input[placeholder="Enter Destination"]').value;
    const routeType = document.querySelector('select').value;

    // Route options based on selection
    let routeOptions = {
        'Safest Route': { 
            avoidHighways: true,
            avoidTolls: true
        },
        'Crowded Route': {
            avoidHighways: false,
            optimizeWaypoints: true
        },
        'Well-lit Route': {
            avoidHighways: false,
            avoidTolls: false
        }
    };

    const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        ...routeOptions[routeType]
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // Add markers for start and end points
            const startMarker = new google.maps.Marker({
                position: result.routes[0].legs[0].start_location,
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }
            });

            const endMarker = new google.maps.Marker({
                position: result.routes[0].legs[0].end_location,
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });
        }
    });
}

// Add geolocation functionality
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                map.setZoom(15);

                // Add marker for current location
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                });
            },
            () => {
                console.error("Error: The Geolocation service failed.");
            }
        );
    }
}