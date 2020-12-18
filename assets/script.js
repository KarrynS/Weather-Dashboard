$(document).ready(function() {

  var APIKey = "2a058d9c1c6b248fc7317f20f31266dc";
  var savedCities = [];
  var today = moment().format('dddd, D MMMM YYYY')
  var cityInput = $("#searchFormInput").val().trim();

  //Rendering Search Function and adding previous search to list
  function renderSearch () {
    $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var citySearch = $("#searchFormInput").val().trim();

    //Retrieving from local storage and updating search result
    savedCities = localStorage.getItem("savedCities");
    savedCities = JSON.parse(savedCities);
    if ( !savedCities ){
      savedCities = [];
    }
    savedCities.push(citySearch);

    //Saving previous searches to local storage
    localStorage.setItem("savedCities", JSON.stringify(savedCities));

    //Appending previous searches to page 
    $("#savedCityDiv").empty();
    for ( i = 0; i < savedCities.length; i++) {
      var savedCity = $("<div class='savedCity'></div");
      savedCity.text(savedCities[i]).attr("data-name", savedCities[i]);
      console.log(savedCities[i])
      $("#savedCityDiv").prepend(savedCity);
      } 
    })
  }
  renderSearch();

  //Adding Event Listeners for new city search on form 
  $("#searchBtn").on("click",function () {
    cityInput = $("#searchFormInput").val().trim();
    newCitySearch();
  });
  
  //Adding Event Listeners on previous searches
  $(document).on("click", ".savedCity", function () {
    cityInput = $(this).attr("data-name");
    newCitySearch();
  });

//Handling request for new city search
  function newCitySearch () {
  
    //Empyting main content div
    $("#citySearchDiv").empty();
    $("#cityForecastDiv").empty();
  
    //Running AJAX call to retrieve OpenWeatherMap API parameters for searched city
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" +cityInput+ "&units=metric&appid=" +APIKey,
        method: "GET"
    }).then(function(response) {
       
        //Creating variables and retrieving required info from response
        var currentCity = response.name;
        var currentTemp = $("<div class='temp'>Temperature: " + response.main.temp + "ºC" + "</div>");
        var currentHumidity = $("<div class='humidity'>Humidity: " + response.main.humidity + "%" + "</div>");
        var currentWind = $("<div class='windspeed'>Wind Speed: " + response.wind.speed + "m/s" + "</div>");
        var currentIcon = $("<img id='weathericon' src='http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png'/>")
        var currentLat = response.coord.lat;
        var currentLon = response.coord.lon;
        
        //Displaying weather data to HTML
        var currentCityHeader = $("<div>");
        currentCityHeader.append($("<h1 id='currentCityHeader'>" + currentCity + "</h1>"));
        currentCityHeader.append($("<span id='date'>" + today + "</span>"));
        currentCityHeader.append(currentIcon);
        $("#citySearchDiv").append(currentTemp);
        $("#citySearchDiv").append(currentHumidity);
        $("#citySearchDiv").append(currentWind);
        $("#citySearchDiv").prepend(currentCityHeader);
    
    //Running AJAX call to retrieve UV index
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/uvi?lat=" +currentLat+ "&lon=" + currentLon + "&appid=" +APIKey,
      method: "GET"
    }).then(function(response) {
      //displaying elements to HTML
      var currentIndex = $("<span class='uv'>" + response.value + "</span>");
      var currentIndexDiv = $("<div id='index'>UV Index: </div>");
      currentIndexDiv.append(currentIndex);
      $("#citySearchDiv").append(currentIndexDiv);

      //Styling for UV Index - (favourable, moderate, severe)
      if (response.value < 3) {
        currentIndex.addClass("favourable");
      } else if (response.value <6) {
        currentIndex.addClass("moderate");
      } else if (response.value >= 6) {
        currentIndex.addClass("severe");
      }

    //Running AJAX call for 5 day forecast
    $.ajax ({
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=metric&appid=" + APIKey,
      method: "GET"
    }).then(function(response) {

      //Header for 5 Day forecast
      var forecastHeader = $("<div id='forecastHeader'><h1> 5 Day Forecast: </h></div>");
      $("#cityForecastDiv").append(forecastHeader);  

        //Targeting relevant 5 day forecast information
        for (i = 7; i < response.list.length; i+=8) {
        var forecastIcon = $("<img src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'/>");
        var forecastTemp = response.list[i].main.temp;
        var forecastHumidity = response.list[i].main.humidity;

        //Appending to HTML
        var forecastDateHeader = $("<div id='forecastDateHeader'>");
        forecastDateHeader.append($("<p class='forecastDate'></p>"));
        forecastDateHeader.text(moment().add(i+1, "days").format("dddd D MMM"));
        forecastDateHeader.append($("<br></br>"));
        forecastDateHeader.append(forecastIcon);

        var forecast = $("<div id='forecast'</div>");
        forecast.append(forecastDateHeader);
        forecast.append($("<p><span class='forecastTemp'> Temp: </span>" + forecastTemp + "ºC</p>"));
        forecast.append($("<p><span class='forecastHumidity'> Humidity: </span>" + forecastHumidity + "%</p>"));
        $("#cityForecastDiv").append($(forecast));
        }
      cityInput = $("#searchFormInput").val("");
      })
    });
  })

}
  //Adding Event Listener for clear search function
  var clearSearch = function () {
    localStorage.clear();
    $("#savedCityDiv").empty();
    $("#citySearchDiv").empty();
    $("#cityForecastDiv").empty();
  }
  $("#clearBtn").on("click", clearSearch);

  newCitySearch();
});
