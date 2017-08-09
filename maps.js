// ==================
// Map Configurations
// ==================

// Global map object
var map;

// Global array of markers
var markers = [];

// Initialize map configurations
function initMap() {

    // MAP: custom styling
    var natureMap = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"25"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.fill","stylers":[{"color":"#1b682f"},{"visibility":"on"},{"weight":"2.82"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#1b682f"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e8e9db"},{"saturation":"0"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"1"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"lightness":"0"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"lightness":"-19"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bccf42"},{"saturation":"0"},{"lightness":"0"},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-30"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"-47"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9fdbe1"},{"visibility":"on"},{"saturation":"0"},{"lightness":"50"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"gamma":"1.00"},{"saturation":"-2"},{"lightness":"-45"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#0081ff"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"hue":"#9500ff"},{"saturation":"-9"}]}]

    // MAP: configurations
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.053869, lng: -118.242721},
        styles: natureMap,
        zoom: 10,
        mapTypeControl: false
    });


    // MARKERS: pass parameters for marker change
    var defaultMarker = changeMarkerColor('default.png');
    var hoverMarker = changeMarkerColor('hover.png');

    // MARKERS: function to change markers
    function changeMarkerColor(img) {
       var markerIcon = new google.maps.MarkerImage(img);
       return markerIcon;
    }

    // MARKERS: configurations
    for (var i = 0; i < hikes.length; i++) {
        var location = hikes[i].location;
        var name = hikes[i].name;

        var marker = new google.maps.Marker({
            position: location,
            title: name,
            icon: defaultMarker,
            animation: google.maps.Animation.DROP
        });
        // Add to markers array
        markers.push(marker);
        // Click listener to show infowindo
        marker.addListener('click', function(){
            showInfoWindow(this, infoWindow);
        });
        // Trigger marker's hover icon
        marker.addListener('mouseover', function(){
            this.setIcon(hoverMarker);
        });
        // Trigger marker's default icon
        marker.addListener('mouseout', function(){
            this.setIcon(defaultMarker);
        });
    }

    // MARKERS: render options
    // 1. Automatically render all markers on load
    showMarkers();
    // 2. Button to render all markers at any given time
    document.getElementById('showHikes').addEventListener('click', showMarkers);


    // INFOWINDOW: initialization
    var infoWindow = new google.maps.InfoWindow();
}

// =======================
// Global helper functions
// =======================

// Show markers and extend map's boundaries
function showMarkers() {
    var boundary = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        boundary.extend(markers[i].position);
    }
    map.fitBounds(boundary);
}

// Configure and display infowindow for selected marker
function showInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;

        infowindow.addListener('closeclick', function(){
            infowindow.marker = null;
        });

        // Get a hike's location to pass as search parameters for Yelp API
        var lat;
        var lng;

        for (var i = 0; i < hikes.length; i++) {
            var hike = hikes[i]
            if (hike.name == marker.title) {
                lat = String(hike.location.lat);
                lng = String(hike.location.lng);
            }
        }

        // Foursquare venue info API
        var now = new Date();
        var dateStr = now.toISOString().slice(0,10).replace(/-/g,"");
        var infoUrl = "https://api.foursquare.com/v2/venues/search?client_id=X3JOZJUYLFFFB22HKOYSX0FSX30LZFP0DRPUE2E2WP04MMFU&client_secret=I0L2CGALFX1S5DC0NWEUGKNMUUUTKHGGJXKPB2YSQJWBBDTB&section=trails&ll="
            + lat + "," + lng + "&v=" + dateStr + "&query=" + marker.title;

        $.ajax({
            type: "GET",
            url: infoUrl,
            dataType: "jsonp",
            success: function(data) {
                if (data.meta.code == 400) {
                    window.alert(data.meta.errorDetail);
                }
                if (data.meta.code == 500) {
                    window.alert(data.meta.errorDetail);
                }
                else {
                    var venue = data.response.venues[0];
                    var venueInfo = {
                        location: venue.location.city + ", " + venue.location.state + " " + venue.location.postalCode,
                        checkins: venue.stats.checkinsCount,
                        id: data.response.venues[0].id
                    }
                    getVenuePhoto(venueInfo);
                }
            }
        });

        // Foursquare photo API;
        var photoUrl = "https://api.foursquare.com/v2/venues/" + marker.id + "/photos?&client_id=X3JOZJUYLFFFB22HKOYSX0FSX30LZFP0DRPUE2E2WP04MMFU&client_secret=I0L2CGALFX1S5DC0NWEUGKNMUUUTKHGGJXKPB2YSQJWBBDTB"
            + "&v=" + dateStr;
            
        function(venue) {
            $.ajax({
                type: "GET",
                url: photoUrl,
                dataType: "jsonp",
                success: function(data) {
                    if (data.meta.code == 400) {
                        window.alert(data.meta.errorDetail);
                    }
                    if (data.meta.code == 500) {
                        window.alert(data.meta.errorDetail);
                    }
                    else {

                    }
                }
            });
        }


        infowindow.setContent("This works!");
        infowindow.open(map, marker);
    }
}
