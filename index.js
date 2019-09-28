
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
