// ==================
// Map Configurations
// ==================

// Global map and infowindow objects
var map, infowindow

// Global array of markers
var markers = [];

// Initial map configurations
function initMap() {

    // MAP: configurations
    map = new google.maps.Map(document.getElementById('map'), {
        styles: natureMap,
        zoom: 10,
        mapTypeControl: false
    });


    // MARKERS: img sources for markers
    var defaultMarker = changeMarkerColor('images/default.png');
    var hoverMarker = changeMarkerColor('images/hover.png');

    // MARKERS: function to change marker icon
    function changeMarkerColor(img) {
       var markerIcon = new google.maps.MarkerImage(img);
       return markerIcon;
    }

    // MARKERS: configurations
    for (var i = 0; i < hikes.length; i++) {
        var location = hikes[i].location;
        var name = hikes[i].name;
        var id = hikes[i].id;
        var distance = hikes[i].distance;

        var marker = new google.maps.Marker({
            position: location,
            title: name,
            icon: defaultMarker,
            id: id,
            distance: distance,
            animation: google.maps.Animation.DROP
        });
        // Add marker to markers array
        markers.push(marker);
        // Click a marker to show infowindo
        marker.addListener('click', function(){
            infoWindowInit(this, createInfoWindow());
        });
        // Trigger marker's on-hover icon
        marker.addListener('mouseover', function(){
            this.setIcon(hoverMarker);
        });
        // Trigger marker's default icon
        marker.addListener('mouseout', function(){
            this.setIcon(defaultMarker);
        });
    }

    // MARKERS: render all on load
    startAllMarkers();
}

// If the map fails to load
function mapError() {
    window.alert("The map has failed to load because invalid parameters were" +
    "passed to Google Maps");
}
