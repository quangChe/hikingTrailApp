var hikes = [
    {
        name: "Point Dume Cove",
        location: {lat: 34.00190531306304, lng: -118.8067102432251},
        distance: "1.2 miles",
        difficulty: "Easy"
    },
    {
        name: "Escondido Falls",
        location: {lat: 34.02889203871035, lng: -118.77802189499091},
        distance: "3.7 miles",
        difficulty: "Easy"
    },
    {
        name: "Solstice Canyon",
        location: {lat: 34.03382125031014, lng: -118.74168472786972},
        distance: "3.4 miles",
        difficulty: "Moderate"
    },
    {
        name: "Los Leones Trail",
        location: {lat: 34.04665214684968, lng: -118.5588722646525},
        distance: "10.4 miles",
        difficulty: "Hard"
    },
    {
        name: "Santa Ynez",
        location: {lat: 34.07715965358875, lng: -118.56576329871294},
        distance: "2.2 miles",
        difficulty: "Easy"
    },
    {
        name: "Temescal Canyon",
        location: {lat: 34.09324617541828, lng: -118.5863935947418},
        distance: "3 miles",
        difficulty: "Easy"
    },
    {
        name: "Eaton Canyon",
        location: {lat: 34.17771036218618, lng: -118.09823416957826},
        distance: "3.6 miles",
        difficulty: "Moderate"
    },
    {
        name: "Sturtevant Falls",
        location: {lat: 34.16779908705499, lng: -118.03180257528363},
        distance: "3.1 miles",
        difficulty: "Moderate"
    },
    {
        name: "Bridge to Nowhere",
        location: {lat: 34.283226, lng: -117.746991},
        distance: "11.3 miles",
        difficulty: "Hard"
    },
    {
        name: "Crystal Cove",
        location: {lat: 33.56641084249367, lng: -117.82154058827237},
        distance: "4 miles",
        difficulty: "Moderate"
    }
];

function trailModel(data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.distance = ko.observable(data.distance);
    this.difficulty = ko.observable(data.difficulty);
};

function viewModel() {
    var viewModel = this;

    this.hikeList = ko.observableArray([]);

    hikes.forEach(function(trail){
        viewModel.hikeList.push(new trailModel(trail));
    });
};

ko.bindingHandlers.difficultyColor = {
    init: function(element, valueAccessor) {
        var difficulty = valueAccessor();
        var difficultyValue = ko.unwrap(difficulty);
        if (difficultyValue == "Easy") {
            $(element).css("background-color", "#9AF495");
        }
        if (difficultyValue == "Moderate") {
            $(element).css("background-color", "#F3F495");
        }
        if (difficultyValue == "Hard") {
            $(element).css("background-color", "#F49595");
        }
    }
};

ko.applyBindings(new viewModel());
