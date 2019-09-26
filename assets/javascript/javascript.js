var thing;
var thing2;
var displayData = [];

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/layers/FeatureLayer",
  "esri/Graphic"
], function (Map, MapView, Search, BasemapToggle, BasemapGallery, FeatureLayer, Graphic) {

  var map = new Map({

      basemap: "streets"
  });
  var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-77.434769, 37.541290], // longitude, latitude
      zoom: 11
  });
  

  // ***************************************************************
  var search = new Search({
      view: view
    });
    view.ui.add(search, "top-right"); // Add to the map
          
    // Find address
    
    view.on("click", function(evt){
      search.clear(); 
      view.popup.clear();
      if (search.activeSource) {
        var geocoder = search.activeSource.locator; // World geocode service
        var params = {
          location: evt.mapPoint 
        };
        geocoder.locationToAddress(params)
          .then(function(response) { // Show the address found
            var address = response.address;
            showPopup(address, evt.mapPoint);
          }, function(err) { // Show no address found
            showPopup("No address found.", evt.mapPoint);
          });
      }
    });
    
    function showPopup(address, pt) {
      view.popup.open({
        title:  + Math.round(pt.longitude * 100000)/100000 + ", " + Math.round(pt.latitude * 100000)/100000,
        content: address,
        location: pt
      });
    }
  // ***************************************************************

  var basemapToggle = new BasemapToggle({


      view: view,
      nextBasemap: "streets-navigation-vector"
  })
  view.ui.add(basemapToggle, "bottom-right");

  

  var trailheadsLayer = new FeatureLayer({
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
  })
  map.add(trailheadsLayer);

  
  var point = {
      type: "point",
      longitude: -77.5387,
      latitude: 37.5752,
  };

  var simpleMarkerSymbol = {
      type: "simple-marker",
      color: (0, 0, 255),
      outline: {
          color: [0, 0, 255],
          width: .5
      }
  };
  var pointGraphic = new Graphic ({
      geometry: point,
      symbol: simpleMarkerSymbol
  });
  view.graphics.add(pointGraphic);


});


// -----------------------------------------------------------------------------------------------------------------------------------



$(document).ready(function(){
  // zip search
  $("#api-request").on("click", function(){
    var input1 = $("#zip-search").val();
    var inputCheck = input1.toString();
    var idValue;
    if (inputCheck.length === 5){
      $("#display").empty();
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://us-restaurant-menus.p.rapidapi.com/restaurants/zip_code/" + input1 + "?page=1",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
          "x-rapidapi-key": "9b86b8e8a6mshdc12005b60b2e9bp17f3b5jsn2a7b1e24c609"
        }
      }
      $.ajax(settings)
      .then(function (response) {
        var results = response.result.data
        console.log(results);
        for (i=0;i<5;i++) {
          idValue = results[i].restaurant_id;
          console.log(idValue)
          var idName = results[i].restaurant_name;
          console.log( apiCall2 ( idValue, idName ) )
          
        };
        input1 ="";
        $("#zip-search").val("");
      });
    } else {
      $("#display").text("Please enter a zip code");
    };
  })
})



function apiCall2(idValue, restaurant_name){
var settings2 = {
  "async": true,
  "crossDomain": true,
  "url": "https://us-restaurant-menus.p.rapidapi.com/restaurant/" + idValue + "/menuitems?page=1",
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
    "x-rapidapi-key": "9b86b8e8a6mshdc12005b60b2e9bp17f3b5jsn2a7b1e24c609"
  }
}
var apiCallData = $.ajax(settings2).then( function (response2) {
  thing = response2.result.data;
  thing2 = "Restaurant:" + restaurant_name + " Menu: " + thing[0].menu_item_name;
  console.log(thing2);
  var option = $('<div>');
  option.text(thing2);
  option.appendTo("#display");
})
return apiCallData;
};



function menuFields(){

var fields = {
  name:"cheeseburger"
};

var paramaters = $.param( fields );


  console.log("menuFields Launch")
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://us-restaurant-menus.p.rapidapi.com/menuitems/search/fields?page=1&fields=" + paramaters,
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
      "x-rapidapi-key": "9b86b8e8a6mshdc12005b60b2e9bp17f3b5jsn2a7b1e24c609"
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log("-----------------------------------------------------------------------")
  });
}



