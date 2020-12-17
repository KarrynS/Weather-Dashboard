$(document).ready(function() {

  var APIKey = "2a058d9c1c6b248fc7317f20f31266dc";
  var savedCities = [];
  var today = moment().format('dddd, D MMMM YYYY')
  var cityInput; 
 
//Rendering Search Function and adding previous search to list
  function renderSearch () {
    $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var citySearch = $("#searchFormInput").val().trim();
    savedCities = localStorage.getItem("savedCitiesObj");
    savedCities = JSON.parse(savedCities);
    if ( !savedCities ){
      savedCities = [];
    }
    savedCities.push(citySearch);
    console.log(citySearch);
    console.log(savedCities);
    
    //Saving previous searches to local storage
    //localStorage.setItem("currentCity", citySearch);
    localStorage.setItem("savedCitiesObj", JSON.stringify(savedCities));

    $("#savedCityDiv").empty();
    //storedCities = localStorage.getItem(savedCities);
    for ( i = 0; i < savedCities.length; i++) {
      var savedCity = $("<div class='savedCity'></div");
      savedCity.text(savedCities[i]).attr("data-name", savedCities[i]);
      console.log(savedCities[i])
      $("#savedCityDiv").prepend(savedCity);
      } 
    })
  }
  renderSearch();

  //Adding Event Listeners for new city search
  $("#searchBtn").on("click",function () {
    cityInput = $("#searchFormInput").val().trim();
    console.log("search button" + cityInput)
    newCitySearch();
  });
  
  $(document).on("click", ".savedCity", function () {
    cityInput = $(this).attr("data-name");
    console.log("saved list" +cityInput)
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
        console.log(response);
        console.log(response.weather[0].icon);

        //Creating variables and retrieving required info from response
        var currentCity = response.name;
        var currentTemp = $("<div>Temperature: " + response.main.temp + "ºC" + "</div>");
        var currentHumidity = $("<div>Humidity: " + response.main.humidity + "%" + "</div>");
        var currentWind = $("<div>Wind Speed: " + response.wind.speed + "m/s" + "</div>");
        var currentIcon = $("<img src='http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png'/>")
        var currentLat = response.coord.lat;
        var currentLon = response.coord.lon;
        

        //Displaying weather data to HTML
        var currentCityHeader = $("<div>");
        currentCityHeader.append($("<h1>" + currentCity + "</h1>"));
        currentCityHeader.append($("<span>" + today + "</span>"));
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
      console.log(response);
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
      console.log(response)

    var forecastHeader = $("<div id='forecastHeader'><h1> 5 Day Forecast: </h></div>");
    $("#cityForecastDiv").append(forecastHeader);  

    for (var i = 0; i < response.list.length; i+8) {
      var forecastIcon = $("<img src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'/>");
        console.log(forecastIcon)
      var forecastTemp = response.list[i].main.temp;
        console.log(forecastTemp)
      var forecastHumidity = response.list[i].main.humidity;
        console.log(forecastHumidity)

      var forecastDateHeader = $("<div id='forecastDateHeader'>");
      forecastDay = moment.utc(response.daily[i].dt * 1000).format("D MMMM");
      forecastDateHeader.append($("<p class='forecastDate'>" + forecastDay + "</p>"));
      console.log(forecastDay)
      forecastDateHeader.append(forecastIcon);

      var forecast = $("<div id='forecast'</div>");
      forecast.append(forecastDateHeader);
      forecast.append($("<p><span class='forecastTemp'> Temp: </span>" + forecastTemp + "ºC</p>"));
      forecast.append($("<p><span class='forecastHumidity'> Humidity: </span>" + forecastHumidity + "m/s</p>"));
      
      $("#cityForecastDiv").append($(forecast));
    }

    })
    });
  })
}

  

 



});


 /* $("#searchFormInput").on("submit", function () {
    cityInput = $("#searchFormInput").val().trim();
    console.log(" submit " + cityInput)
    newCitySearch();
  });*/
