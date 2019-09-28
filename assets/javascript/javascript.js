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
      
      
      $.ajax(settings)
      .then(function (response) {
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
      "x-rapidapi-key": "fe9110a17emshef9973a41fd039bp17d9e1jsn166b23aaa528"
    }
  }
  
 
    
    $.ajax(nutritionix).done(function (response) {
      var place = response.hits;
      console.log(place);
      var health = $('<div>');
      health.text(place[0].fields.item_name + " Calories: " + place[0].fields.nf_calories+ " Fat: " + place[0].fields.nf_total_fat);
      health.appendTo('#facts');
  
    });
    
    

  });

  
  


})

 
  



