$(document).ready(function() {

  var APIKey = "2a058d9c1c6b248fc7317f20f31266dc";
  var savedCities = [];
  var today = moment().format('dddd, D MMMM YYYY')
 
//Rendering Search Function and adding previous search to list
  function renderSearch () {
    
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var citySearch = $("#searchFormInput").val().trim();
    savedCities.push(citySearch);
    console.log(citySearch);
    console.log(savedCities);

    $("#savedCityDiv").empty();
    for ( i = 0; i < savedCities.length; i++) {
      var savedCity = $("<div class='savedCity'></div");
      savedCity.text(savedCities[i]);
      console.log(savedCities[i])
      $("#savedCityDiv").prepend(savedCity);
      }
    })
  }
  renderSearch();
  

  //Handling request for new city search
  function newCitySearch () {
    var cityInput = "Sydney"
    console.log(location)
    //Empyting main content div
    $("#citySearchDiv").empty();
    $("#cityForecastDiv").empty();

    
    //Running AJAX call to retrieve OpenWeatherMap API parameters for searched city
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" +cityInput+ "&units=metric&appid=" +APIKey,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        //Creating variables and retriving required info from response
        var currentCity = response.name;
        
        var currentTemp = $("<div>Temperature: " + response.main.temp + "ºC" + "</div>");
        var currentHumidity = $("<div>Humidity: " + response.main.humidity + "%" + "</div>");
        var currentWind = $("<div>Wind: " + response.wind.speed + "m/s" + "</div>");
        var currentLat = response.coord.lat;
        var currentLon = response.coord.lon;
        var currentCityHeader = $("<div>");

        //Displaying weather data to HTML
        currentCityHeader.append($("<h1>" + currentCity + "</h1>"));
        currentCityHeader.append($("<span>" + today + "</span>"));
        $("#citySearchDiv").append(currentTemp);
        $("#citySearchDiv").append(currentHumidity);
        $("#citySearchDiv").append(currentWind);
        $("#citySearchDiv").prepend(currentCityHeader);
       
    //Running AJAX call to retrieve UV index
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/uvi?lat=" +currentLat+ "&lon=" + currentLon + "&appid=" +APIKey,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var currentIndex = $("<div id='index'>UV Index: " + response.value + "</div>");
      $("#citySearchDiv").append(currentIndex);
    });
  })
 
  }
  newCitySearch();
  
  //Saving to local storage
  localStorage.setItem("currentCity", cityInput);







});





/*
    

    

    searchUpdate(currentCity);


       renderPrevSearches();
    function renderPrevSearches()  {
  previousSearch.empty();
  console.log(savedCities);
  console.log(previousSearch);
  savedCities = JSON.parse(localStorage.getItem("savedCities"));
  console.log(savedCities);
  if (savedCities === null || savedCities === []) {
    savedCities = [];
    console.log(savedCities);
  } else {
    
  }
}

*/

