// All the hikes' information
var hikes = [
    {
        name: "Point Dume Cove",
        location: {lat: 34.00190531306304, lng: -118.8067102432251},
        distance: "1.2 miles",
        difficulty: "Easy",
        id: 1
    },
    {
        name: "Escondido Falls",
        location: {lat: 34.02889203871035, lng: -118.77802189499091},
        distance: "3.7 miles",
        difficulty: "Easy",
        id: 2
    },
    {
        name: "Solstice Canyon",
        location: {lat: 34.03382125031014, lng: -118.74168472786972},
        distance: "3.4 miles",
        difficulty: "Moderate",
        id: 3
    },
    {
        name: "Los Leones Trail",
        location: {lat: 34.04665214684968, lng: -118.5588722646525},
        distance: "10.4 miles",
        difficulty: "Hard",
        id: 4
    },
    {
        name: "Santa Ynez Trailhead",
        location: {lat: 34.07715965358875, lng: -118.56576329871294},
        distance: "2.2 miles",
        difficulty: "Easy",
        id: 5
    },
    {
        name: "Temescal Canyon",
        location: {lat: 34.09324617541828, lng: -118.5863935947418},
        distance: "3 miles",
        difficulty: "Easy",
        id: 6
    },
    {
        name: "Eaton Canyon",
        location: {lat: 34.17771036218618, lng: -118.09823416957826},
        distance: "3.6 miles",
        difficulty: "Moderate",
        id: 7
    },
    {
        name: "Sturtevant Falls",
        location: {lat: 34.16779908705499, lng: -118.03180257528363},
        distance: "3.1 miles",
        difficulty: "Moderate",
        id: 8
    },
    {
        name: "Bridge to Nowhere",
        location: {lat: 34.283226, lng: -117.746991},
        distance: "11.3 miles",
        difficulty: "Hard",
        id: 9
    },
    {
        name: "Crystal Cove",
        location: {lat: 33.56641084249367, lng: -117.82154058827237},
        distance: "4 miles",
        difficulty: "Moderate",
        id: 10
    }
];

// Display details of each hike as observable
function trailModel(data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.distance = ko.observable(data.distance);
    this.difficulty = ko.observable(data.difficulty);
    this.id = ko.observable(data.id);
};

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
    this.difficultyLevels = ko.observableArray(["Easy", "Moderate", "Hard"])
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
    }

    // Funciton to list all hikes when "Show All Hikes" button clicked
    this.listAllHikes = function() {
        viewModel.selectedDifficulty('');
    }
};

// Custom binding handler to color code difficulty of hikes
ko.bindingHandlers.difficultyColor = {
    init: function(element, valueAccessor) {
        var difficulty = valueAccessor();
        var difficultyValue = ko.unwrap(difficulty);
        if (difficultyValue == "Easy") {
            $(element).css("background-color", "#6bbd71");
        }
        if (difficultyValue == "Moderate") {
            $(element).css("background-color", "#e5e670");
        }
        if (difficultyValue == "Hard") {
            $(element).css("background-color", "#e86e6e");
        }
    }
};

ko.applyBindings(new viewModel());
