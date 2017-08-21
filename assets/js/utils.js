// =======================
// Global helper functions
// =======================

// Today's date for getting most up-to-date Foursquare API version;
var now = new Date();
var dateStr = now.toISOString().slice(0,10).replace(/-/g,"");

// Icon setting
function setTreeIcon(marker) {
    return marker.setIcon('assets/imgs/default.png');
}
function setBootIcon(marker) {
    return marker.setIcon('assets/imgs/hover.png');
}

// Initally render all markers on the map
function startAllMarkers() {
    bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(google.maps.Animation.DROP);
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    // Set boundary whenever all markers show
    map.fitBounds(bounds);
    // Set boundary whenever window resizes
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });
}

// Hide visibility of all markers
function hideAllMarkers() {
    // Close any open infowindow before hiding all markers
    if (infowindow) {
        infowindow.close();
    }
    for (var i = 0; i < markers.length; i++) {
        setTreeIcon(markers[i]);
        markers[i].setVisible(false);
    }
    map.fitBounds(bounds);
}

// Show visibility of all markers
function showAllMarkers() {
    if (infowindow) {
        infowindow.close();
    }
    if (map) {
        map.fitBounds(bounds);
        for (var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(google.maps.Animation.DROP);
            setTreeIcon(markers[i]);
            markers[i].setVisible(true);
        }
    }
}

// Show specified markers for filtered trails
function showSpecificMarkers(trailsToShow) {
    hideAllMarkers();
    for (var t = 0; t < trailsToShow.length; t++) {
        for (var m = 0; m < markers.length; m++) {
            if (markers[m].id == trailsToShow[t].id) {
                markers[m].setAnimation(google.maps.Animation.DROP);
                markers[m].setVisible(true);
            }
        }
    }
}

// Render infowindow when user clicks list item from options box
function findMarker(trail) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].title == trail) {
            setBootIcon(markers[i]);
            infoWindowInit(markers[i], createInfoWindow());
        }
    }
}

// INFOWINDOW: create new instance
function createInfoWindow() {
    if (infowindow) {
        infowindow.close();
        infowindow = new google.maps.InfoWindow();
        return infowindow;
    } else {
        infowindow = new google.maps.InfoWindow();
        return infowindow;
    }
}

// Configure and display infowindow for selected marker
// and make API call to gather info
function infoWindowInit(marker, infowindow) {
    hideAllMarkers();
    if (infowindow.marker != marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setBootIcon(marker);
        marker.setVisible(true);
        map.setZoom(13);
        map.setCenter(marker.getPosition());
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.setContent('<i class="load-icon fa fa-spinner fa-pulse fa-3x fa-fw"></i><p class="load-msg">Getting More Info...</p>');
        infowindow.open(map, marker);

        // Grab a hike's location to pass as search parameters for Yelp API
        var location, distance;

        for (var i = 0; i < hikes.length; i++) {
            var hike = hikes[i]
            if (hike.name == marker.title) {
                location = {
                    lat: hike.location.lat,
                    lng: hike.location.lng
                };
            }
        }

        // API url for Foursquare
        var infoUrl = "https://api.foursquare.com/v2/venues/search?client_id=X3JOZJUYLFFFB22HKOYSX0FSX30LZFP0DRPUE2E2WP04MMFU&client_secret=I0L2CGALFX1S5DC0NWEUGKNMUUUTKHGGJXKPB2YSQJWBBDTB&section=trails&ll="
            + String(location.lat) + "," + String(location.lng) + "&v=" + dateStr + "&query=" + marker.title;

        // Run AJAX call on url
        getVenueInfo(marker, infoUrl);

        infowindow.addListener('closeclick', function(){
            infowindow.marker = null;
            marker.setAnimation(null);
            showAllMarkers();
        });
    }
}

// Ajax call to get venue info from Foursquare API
function getVenueInfo(marker, url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var venue = data.response.venues[0];
            var venueInfo = {
                name: marker.title,
                location: venue.location.city + ", " + venue.location.state,
                checkins: venue.stats.checkinsCount,
                length: marker.distance,
                id: data.response.venues[0].id
            };
            getVenuePhoto(marker, venueInfo);
        },
        error: function() {
            window.alert("Uh oh! An error occurred while trying to retrieve the trail's information from Foursquare!");
        }
    });
}

// Get venue's photos from venue info from Foursquare API
function getVenuePhoto(marker, venue) {
    var photoUrl = "https://api.foursquare.com/v2/venues/" + venue.id +
    "/photos?&client_id=X3JOZJUYLFFFB22HKOYSX0FSX30LZFP0DRPUE2E2WP04MMFU&client_secret=I0L2CGALFX1S5DC0NWEUGKNMUUUTKHGGJXKPB2YSQJWBBDTB"
        + "&v=" + dateStr;

    // Grab photos url
    $.ajax({
        type: "GET",
        url: photoUrl,
        dataType: "json",
        success: function(data) {
            var photoList = data.response.photos.items;
            var imgs = '';
            for (var i = 0; i < photoList.length; i++) {
                var photo = photoList[i];
                var url = photo.prefix + "1080x720" + photo.suffix;
                imgs += '<a href="' + url + '"><img class="photos" src="' + url + '" width="80" height="50" alt="Hiking trail scenic image"></a>';
            }
            displayInfoWindow(marker, venue, imgs);
        },
        error: function() {
            window.alert("Uh oh! An error occurred while trying to retrieve the trail's photos from Foursquare!");
        }
    });
}

// Set the content inside the infowindow using compiled venue info
function displayInfoWindow(marker, venue, imgs) {
    infowindow.setContent('<div id="venue-info">' + '<h3>' + venue.name + '</h3><p>'
        + venue.location + '</p><p id="details"><span class="strong">Popularity:</span> ' + venue.checkins
        + ' visitors checked in</p><p><span class="strong">Hike Length:</span> ' + venue.length
        + ' round trip</p></div><h4 class="album-head">Visitor Photos:</h4><div class="venue-gallery">'
        + imgs + '</div><p class="attribution"> Source: Foursquare </p>'
    );
}
