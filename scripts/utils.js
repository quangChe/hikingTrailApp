// =======================
// Global helper functions
// =======================

// Today's date for getting most up-to-date Foursquare API version;
var now = new Date();
var dateStr = now.toISOString().slice(0,10).replace(/-/g,"");

// Initally render all markers on the map
function startAllMarkers() {
    var boundary = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(google.maps.Animation.DROP);
        markers[i].setMap(map);
        boundary.extend(markers[i].position);
    }
    // Set boundary whenever all markers show
    map.fitBounds(boundary);
    // Set boundary whenever window resizes
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(boundary);
    });
}

// Hide visibility of all markers
function hideAllMarkers() {
    // Close any open infowindow before hiding all markers
    if (infowindow) {
        infowindow.close();
    }
    for (var i = 0; i < markers.length; i++) {
        markers[i].setIcon('images/default.png');
        markers[i].setVisible(false);
    }
}

// Show visibility of all markers
function showAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(google.maps.Animation.DROP);
        markers[i].setVisible(true);
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
            markers[i].setIcon('images/hover.png');
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
        marker.setIcon('images/hover.png');
        marker.setVisible(true);
        infowindow.setContent('');
        infowindow.marker = marker;

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

// Custom error handling for Foursquare API responses
function handleErrors(code, errorType) {
    if (code == 400) {
        return window.alert("Error " + String(code)
        + ": Request failed due to invalid/missing search parameters, or this app"
        + " may be unauthorized to make the request due to expired/missing credentials.");
    }
    if (code == 403) {
        return window.alert("Error " + String(code)
        + ": You are attempting to access information that that you are not authorized"
        + " to see, or this app has reach its rate limit. Please try again in an hour.");
    }
    if (code == 404) {
        return window.alert("Error " + String(code)
        + ": The requested url could not be found because it has been removed"
        + " or does not exist!");
    }
    if (code == 429) {
        return window.alert("Error " + String(code)
        + ": This app has exceeded the daily call quota set by Foursquare. No"
        + " further requests can be fulfilled for today. Sorry for the inconvenience!");
    }
    if (code == 500) {
        return window.alert("Error " + String(code)
        + ": The request could not be fulfilled because the Foursquare server has"
        + " timed out. Please try again later.");
    }
    // Foursquare may return 200 OK response for deprecated functionality
    if (code == 200 && errorType !== undefined) {
        return window.alert("Error: The request is accessing information/funcitonality"
        + " that have been marked deprecated by Foursquare.");
    }
    if (code == 200 && errorType == undefined) {
        return true;
    }
}

// Ajax call to get venue info from Foursquare API
function getVenueInfo(marker, url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function(data) {
            var success = handleErrors(data.meta.code, data.meta.errorType);
            if (success == true) {
                var venue = data.response.venues[0];
                var venueInfo = {
                    name: marker.title,
                    location: venue.location.city + ", " + venue.location.state + " " + venue.location.postalCode,
                    checkins: venue.stats.checkinsCount,
                    length: marker.distance,
                    id: data.response.venues[0].id
                };
                getVenuePhoto(marker, venueInfo);
            };
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
        dataType: "jsonp",
        success: function(data) {
            var success = handleErrors(data.meta.code, data.meta.errorType);
            if (success == true) {
                var photoList = data.response.photos.items;
                var imgs = '';
                for (var i = 0; i < photoList.length; i++) {
                    var photo = photoList[i];
                    var url = photo.prefix + "720x480" + photo.suffix;
                    imgs += '<a target="_blank" href="' + url + '"><img class="photos" src="' + url + '" alt="Hiking trail scenic image"></a>';
                }
                displayInfoWindow(marker, venue, imgs);
            }
        }
    });
}

// Set the content inside the infowindow using compiled venue info
function displayInfoWindow(marker, venue, imgs) {
    infowindow.setContent('<div id="venueInfo">' + '<h3>' + venue.name + '</h3><p>'
        + venue.location + '</p><p id="details"><span class="strong">Popularity:</span> ' + venue.checkins
        + ' visitors so far</p><p><span class="strong">Hike Length:</span> ' + venue.length
        + ' round trip</p></div><h4 class="albumHead">Visitor Photos:</h4><div id="venuePhotos">'
        + imgs + '</div><p class="attribution"> Source: Foursquare API </p>'
    );
    infowindow.open(map, marker);
}
