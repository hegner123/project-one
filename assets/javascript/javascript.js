// zip-search


$(document).ready(function(){

  $("#api-request").on("click", function(){
    
    var input1 = $("#zip-search").val();
    var inputCheck = input1.toString();
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
      
      $.ajax(settings).done(function (response) {
        var results = response.result.data
        for (i=0;i<5;i++) {
          var option = $('<div>');
          option.text(results[i].restaurant_name);
          option.appendTo("#display");
        };
        input1 ="";
        $("#zip-search").val("");
      });

    } else {
      $("#display").text("Please enter a zip code");
    };

    
    
   

  })
  
  
})


