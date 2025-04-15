//Fetching json objects:
fetch("../recipes.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    localStorage.setItem("recipes", JSON.stringify(data));
    if (!localStorage.getItem("calendar")) {
      localStorage.setItem("calendar", "[]");
    }
  });

let recipes = JSON.parse(localStorage.getItem("recipes"));
let calendar = JSON.parse(localStorage.getItem("calendar"));
