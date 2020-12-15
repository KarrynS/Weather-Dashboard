$(document).ready(function() {

  var APIKey = "2a058d9c1c6b248fc7317f20f31266dc";
  var savedCities = [];
  var currentDay = moment().format('dddd, D MMMM YYYY')
 
//Rendering Search Function and adding previous search to list
  function renderSearch () {
    
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var citySearch = $("#searchFormInput").val().trim();
    console.log(citySearch);
    savedCities.push(citySearch);
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

//Handling Event for loading new city search
function citySearch (event) {


}
citySearch();

});





/*
//Function to update saved locations
var searchUpdate = function(currentCity) {
  if (currentCity !== "") {
          savedCities.push(currentCity);
          console.log(savedCities);

  if (savedCities.length > 10) {
          savedCities.shift();
  }
  
  //Registering seraching for new city on submit, click or reload
  $("#savedCitiesDiv").empty();
  savedCities.forEach(function(city) {
      $("#savedCitiesDiv").prepend($(`<div class="savedCity">${city}</div>`))
    })
  }
}
//searchUpdate(currentCity);
   
// Handle the event for loading data for a new city
var startNewSearch = function(event) {
  // If this was triggered by an event rather than page load,
  if( event ) {
    event.preventDefault();
    // Grab input for current city search depending on whether it was a submit event or click event
    if( event.type === "submit" ){
      var citySearch = event.target.children[0].value;
    } else if ( event.type === "click" ){
      var citySearch = event.target.innerHTML;
    }
    
  // Else if this is triggered by page load,
  } else {
    // Load last searched city if it exists, otherwise load Tokyo
    if( localStorage.getItem("currentCity") ){
      var citySearch = localStorage.getItem("currentCity");
    } else {
      var citySearch = "Melbourne";
    }
  }}

  //Running AJAX call to retrieve OpenWeatherMap API parameters for searched city
  //$.ajax({
  //    url: "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" +APIKey,
  //    method: "GET"
  //}).then(function(response) {
  //    console.log(response);
  //})

*/

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

