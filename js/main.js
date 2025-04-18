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

//Adding to calendar with buttons:
let addToCalendarButtons = document.querySelectorAll(".add-calendar-button");
//Once DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  let addCalendarButtons = document.querySelectorAll(".add-calendar-button");

  addCalendarButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      alert("Added to calendar!");
      let recipeId = button.getAttribute("data-recipe-id");
      addToCalendar(recipeId);
    });
  });
});

//localStorage.clear();
//addToCalendar();

//Displaying recipes in calendar:
document.addEventListener("DOMContentLoaded", function () {
  let calendarContainer = document.getElementById("calendar-container");

  if (calendarContainer) {
    //display the recipe image
    let calendar = JSON.parse(localStorage.getItem("calendar")) || []; // Get calendar from localStorage
    if (calendar.length > 0) {
      // Loop through the cart and display each product
      calendar.forEach(function (recipe) {
        let recipeDiv = document.createElement("div");
        recipeDiv.classList.add("calendar-item");

        let recipeHTML = `
        <div class="added-recipes">
                <div class="calendar-recipe-image">
                    <img src="${recipe.image}" alt="${recipe.name}" />
                </div>
                    <h3 class="recipe-name">${recipe.name}</h3>
                    </div>
                `;

        recipeDiv.innerHTML = recipeHTML;

        // Append the recipe to the calendar container
        calendarContainer.appendChild(recipeDiv);
      });
    } else {
      // If calendar empty:
      calendarContainer.innerHTML = "<p>Add recipes you want to make!</p>";
    }
  }
});
