// ==================
// Map Configurations
// ==================

// Global map object
var map;

// Global array of markers
var markers = [];

// Global infowindow object
var infowindow;

// Initial map configurations
function initMap() {


    // MAP: custom styling
    var natureMap = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"25"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.fill","stylers":[{"color":"#1b682f"},{"visibility":"on"},{"weight":"2.82"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#1b682f"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e8e9db"},{"saturation":"0"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"1"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"lightness":"0"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"lightness":"-19"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bccf42"},{"saturation":"0"},{"lightness":"0"},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-30"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"-47"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9fdbe1"},{"visibility":"on"},{"saturation":"0"},{"lightness":"50"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"gamma":"1.00"},{"saturation":"-2"},{"lightness":"-45"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#0081ff"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"hue":"#9500ff"},{"saturation":"-9"}]}]

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
    showAllMarkers();

}
