const map = L.map('map', {
    center: [41.4803219, -71.311013],
    zoom: 15,
    zoomControl: false
});

map.scrollWheelZoom.disable();

L.tileLayer.grayscale('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const locationIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [66, 88],
    iconAnchor: [33, 88]
});

L.marker(
    [41.4803219, -71.311013],
    {icon: locationIcon},
    {alt: 'The Modern Art Gallery'}
).addTo(map);
