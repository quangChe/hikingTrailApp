// Display details of each hike as observable
function trailModel(data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.distance = ko.observable(data.distance);
    this.difficulty = ko.observable(data.difficulty);
    this.photo = ko.observable(data.photo);
    this.id = ko.observable(data.id);
}

// Controller to handle which hikes are displayed in options box
function viewModel() {
    var viewModel = this;

    // Observable array containing all the hikes
    this.hikeList = ko.observableArray([]);

    // Pass each hike into above array
    hikes.forEach(function(trail){
        viewModel.hikeList.push(new trailModel(trail));
    });


    // =========
    // FILTERING
    // =========

    // Display difficulty options in dropdown
    this.difficultyOptions = ko.observableArray(["Easy", "Moderate", "Hard"]);
    // Grab value of difficulty that user selects
    this.selectedDifficulty = ko.observable('');

    // Provide the right trails that match selected difficulty
    // (displays all by default)
    this.displayedHikes = ko.computed(function(){
        var filter = viewModel.selectedDifficulty();
        // Display all by default
        if (!filter) {
            return viewModel.hikeList();
        }
        // Easy
        if (filter == "Easy") {
            return filterDifficulty("Easy");
        }
        // Moderate
        if (filter == "Moderate") {
            return filterDifficulty("Moderate");
        }
        // Hard
        if (filter == "Hard") {
            return filterDifficulty("Hard");
        }
    });

    // Filter function to pass the correct hikes into displayedHikes
    function filterDifficulty(level) {
        var filteredHikes = ko.observableArray([]);
        for (var i = 0; i < viewModel.hikeList().length; i++) {
            var hike = viewModel.hikeList()[i];
            if (hike.difficulty() == level) {
                filteredHikes.push(hike);
            }
        }
        showSpecificMarkers(filteredHikes());
        return filteredHikes();
    }

    // Function to find marker and display infowindow
    // when a listed hike in the options box is clicked
    this.getInfoWindow = function(trail) {
        findMarker(trail.name());
    };

    // Funciton to list all hikes when "Show All Hikes" button clicked
    this.listAllHikes = function() {
        viewModel.selectedDifficulty('');
        showAllMarkers();
    };

    // Opened nav view
    this.navOpen = function() {
        openNav();
    };
    // Closed nav view
    this.navClose = function() {
        closeNav();
    };
}

// Custom color render based on difficulty of hikes
ko.bindingHandlers.difficultyColor = {
    init: function(element, valueAccessor) {
        var difficulty = valueAccessor();
        var difficultyValue = ko.unwrap(difficulty);
        difficultyColorRender(element, difficultyValue);
    }
};

ko.applyBindings(new viewModel());
