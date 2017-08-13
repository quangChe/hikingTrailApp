// Effects for navbar
function openNav() {
    $('#navBtn').toggle();
    $('#options').toggle('slide');
}

function closeNav() {
    $('#navBtn').toggle('slow');
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
