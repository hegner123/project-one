// stored api keys in firebase
var firebaseConfig = {
  apiKey: "AIzaSyDNiASGDyPT5wj1zAz5Gc55g-wYHcjsG10",
  authDomain: "hegner123-38bad.firebaseapp.com",
  databaseURL: "https://hegner123-38bad.firebaseio.com",
  projectId: "hegner123-38bad",
  storageBucket: "",
  messagingSenderId: "385773929972",
  appId: "1:385773929972:web:04d34742f6c0d0a17f25a1"
};
var usMenuKey;
var googleKey;
var nutritionixKey;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var accessData = firebase.database().ref("keys");
accessData.once("value").then(function(snapshot){
usMenuKey = snapshot.child("us-menu").val();
googleKey = snapshot.child("googleMapKey").val();
nutritionixKey = snapshot.child("nutriKey").val();
    });






// Arcgis Code Section----------------------------------------------------------------------
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/widgets/Track"
], function (Map, MapView, Search, BasemapToggle, FeatureLayer, Graphic, Locate, Track) {
  
  var map = new Map({

      basemap: "streets-navigation-vector"
  });
  var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-77.434769, 37.541290], // longitude, latitude
      zoom: 11
  });
  
  // Add a search bar
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

  var basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "satellite"
  })
  view.ui.add(basemapToggle, "bottom-right");

var locate = new Locate({
  view: view,
  useHeadingEnabled: false,
  goToOverride: function(view, options) {
    options.target.scale = 1500;  // Override the default map scale
    return view.goTo(options.target);
  }
});

view.ui.add(locate, "top-left");
var track = new Track({
  view: view,
  graphic: new Graphic({
    symbol: {
      type: "simple-marker",
      size: "12px",
      color: "green",
      outline: {
        color: "#efefef",
        width: "1.5px"
      }
    }
  }),
  useHeadingEnabled: false  // Don't change orientation of the map
});

view.ui.add(track, "top-left");

});



// ArcGis Section End-----------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
  $(".screen-toggle").hide();;
  $(".error-screen").hide();
  $(".screen-one").show();
  $(".screen-three").hide();
  $(".options-card").hide();
  $(".facts-card").hide();
  // zip search
  var userArray = [];

  $("#options-add").on('keyup', function(event){
   if (event.keyCode === 13) {
     event.preventDefault();
    $("#add-options").click();
   };
  });

  $(".screen-toggle").on('click',function(){
    $(".screen-one").toggle();
    $(".screen-three").toggle();
  })

  $("#add-options").on('click', function () {
    var userInput = $("#options-add").val().trim();
    var output = $('<div class="user-item">');
    output.text(userInput);
    output.appendTo(".options-display");
    userArray.push(userInput);
    $("#options-add").val("");
    $(".options-card").show();
  })

  $("#reset").on("click", function () {
    userArray = [];
    $("#options-add").val("");
    $(".options-display").empty()
    $(".options-card").hide();
  })

  $("#food").on('keyup', function(event){
    if (event.keyCode === 13) {
      event.preventDefault();
     $("#nutrients").click();
    };
   });

  $(".api-reset").on("click", function () {
    $("#display").empty()
    $("#zip-search").val("");
    $(".error-screen").hide();
    $(".screen-three").hide();
    $(".screen-one").show();
  })

  $("#zip-search").on('keyup', function(event){
   if (event.keyCode === 13) {
     event.preventDefault();
    $("#api-request").click();
   };
  });

  $("#api-request").on("click", function () {
    $(".screen-three").hide();
    var input1 = $("#zip-search").val();
    var inputCheck = input1.toString();
    var idValue;
    if (inputCheck.length === 5) {
      $("#display").empty();
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://us-restaurant-menus.p.rapidapi.com/restaurants/zip_code/" + input1 + "?page=1",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
          "x-rapidapi-key": usMenuKey
        }
      }
      $.ajax(settings)
        .then(function (response) {
          var results = response.result.data;
          for (i = 0; i < 3; i++) {
            var items = userArray;
            var cuisine = results[i].cuisines;
            var display = true;
            // Filter loops, for each item in cuisine, check each item in user array and determine if there is a match
            // Used a boolean display to control whether or not the results are displayed
            for (j = 0; j < cuisine.length; j++) {
              for (k = 0; k <items.length; k++){
                if (cuisine[j] === items[k]){
                  display = false;
                };
              };
            };
            if (display === true) {
              idValue = results[i].restaurant_id;
              var idName = results[i].restaurant_name;
              
              
              apiCall2(idValue, idName);
              $(".options").on('click',function(){
                console.log("this");
                $(this).children().toggle();
              });
              
            };
            input1 = "";
            $("#zip-search").val("");
            $(".screen-toggle").show();
            $(".screen-one").hide();
            $(".screen-three").show();
          };
          
        });
    } else {
      $("#zip-search").val("");
      $(".error-screen").show();
      console.log("this");
      $(".error").text("");
    };
    
  });

  // AJAX CALL for menu items based on first ajax call
function apiCall2(idValue, restaurant_name) {
  // settings for second AJAX CALL
  var settings2 = {
    "async": true,
    "crossDomain": true,
    "url": "https://us-restaurant-menus.p.rapidapi.com/restaurant/" + idValue + "/menuitems?page=1",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
      "x-rapidapi-key": usMenuKey
    }
  }
  $.ajax(settings2).then(function (response2) {
    // creates variable to quickly access data in the JSON data response
    var menuResults = response2.result.data;
    // creates string to be displayed as Result;
    var resultText = "Restaurant:" + restaurant_name + "|| Menu Item: " + menuResults[0].menu_item_name;
    // variables to send to google maps static map API;
    var streetAdr = menuResults[0].address.street;
    var cityAdr = menuResults[0].address.city;
    var stateAdr = menuResults[0].address.state;
    var restaurantAdr = menuResults[0].address.formatted;
    console.log(menuResults)
    // var resultGeoLat = menuResults[0].geo.lat;
    // var resultGeoLon = menuResults[0].geo.lon;
    // var zipAdr = menuResults[0].address.zip;
    // console.log(resultGeoLon);
    // console.log(resultGeoLat);
    // var staticUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=' + resultGeoLat + ','+ resultGeoLon + '&zoom=18&size=400x400&key=AIzaSyAoEZ5plSSL8WtrfHP-1-MHmQgcNtSr0wQ'
    var staticUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=' + streetAdr + '+' + cityAdr + '+' + stateAdr + '+' + '&zoom=17&size=400x400&key=' + googleKey;
    var staticMap = $('<img class=" col col-12 static-map" data="'+ restaurant_name +'"src="'+ staticUrl +'">')
    var option = $('<div class="col col-12 p-2 options">');
    option.text(resultText);
    option.attr('data', restaurantAdr)
    option.appendTo("#display");
    staticMap.appendTo(option);
    $(".static-map").hide();
    $(".options").on('click', function(){
      $(".esri-search__input").val("");
      var addressData = $(this).attr('data');
      $(".esri-search__input").val(addressData);
      $(".esri-search__submit-button").click();
    });
  });
};


  








$("#nutrients").on('click', function (){
  console.log('click');
  var input2 = $('#food').val();
  var nutritionix = {
    "async": true,
    "crossDomain": true,
    "url": "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + input2 + "?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
      "x-rapidapi-key": nutritionixKey 
    }
  };
 $.ajax(nutritionix).done(function (response) {
      $('#food').val("");
      $("#facts").empty();
      var place = response.hits;
      var health = $('<div>');
      health.text(place[0].fields.item_name + " Calories: " + place[0].fields.nf_calories + "J" + " Fat: " + place[0].fields.nf_total_fat) + "G";
      health.appendTo('#facts');
      $(".facts-card").show();
      // $('#restaurant').val();
      // return facts
    });
    
  });



  });