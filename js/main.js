// Inspiration for function logic https://www.youtube.com/watch?v=pRkHOD_nkH4&t=408s
//Fetching json objects, storing in localstorage:
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

function addToCalendar(recipeId) {
  let recipe = recipes.find(function (recipe) {
    return recipe.id == recipeId;
  });

  if (recipe) {
    let alreadyInCalendar = calendar.some((item) => item.id == recipeId); //is there one with same id? "some" keyword suggestion chatgpt

    if (!alreadyInCalendar) {
      calendar.push(recipe);
      localStorage.setItem("calendar", JSON.stringify(calendar));
    }
  }
}

//localStorage.clear();
//addToCalendar();
