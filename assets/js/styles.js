// MAP: custom styling
var natureMap = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"25"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.fill","stylers":[{"color":"#1b682f"},{"visibility":"on"},{"weight":"2.82"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#1b682f"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e8e9db"},{"saturation":"0"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"1"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"lightness":"0"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"lightness":"-19"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bccf42"},{"saturation":"0"},{"lightness":"0"},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-30"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"-47"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9fdbe1"},{"visibility":"on"},{"saturation":"0"},{"lightness":"50"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"gamma":"1.00"},{"saturation":"-2"},{"lightness":"-45"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#0081ff"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"hue":"#9500ff"},{"saturation":"-9"}]}];

// Magnific Popup Configurations (for trail images gallery)
function galleryInit() {
    $(document).ready(function() {
        $('.venue-gallery').magnificPopup({
            delegate: 'a',
            type:'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                preload: [0,2],
                navigateByImgClick: true,
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return '<small>Source: Foursquare</small>';
                }
            }
        });
    });
}

// Effects for navbar
function openNav() {
    $('#nav-btn').toggle();
    $('#options').toggle('slide');
}

function closeNav() {
    $('#nav-btn').toggle('slow');
    $('#options').toggle('slide');
}

// Show difficulty colors
function difficultyColorRender(element, difficultyValue) {
    if (difficultyValue == "Easy") {
        $(element).css("color", "#6bbd71");
    }
    if (difficultyValue == "Moderate") {
        $(element).css("color", "#e2b265");
    }
    if (difficultyValue == "Hard") {
        $(element).css("color", "#e86e6e");
    }
}
