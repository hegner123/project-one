
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

        basemap: "satellite"
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
        nextBasemap: "satellite"
    })
    view.ui.add(basemapToggle, "bottom-right");

    var basemapGallery = new BasemapGallery({
        container: "mapToggle",
        view: view,
        source: {
            portal: {
                url: "https://www.arcgis.com",
                useVectorBasemaps: true
            }
        }
    })
    view.ui.add(basemapGallery, "bottom-left");

    var trailheadsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    })
    map.add(trailheadsLayer);

    var trailheadsRenderer = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
            width: "18px",
            height: "18px"
        }
    }
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
