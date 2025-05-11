//menu toggle help from https://www.w3schools.com/howto/howto_js_mobile_navbar.asp and chatgpt
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("mobile-menu");
  const collapse = document.getElementById("nav-collapse");

  if (!toggle || !collapse) {
    console.log("Could not find mobile-menu or nav-collapse");
    return;
  }

  toggle.addEventListener("click", () => {
    console.log("Toggling menu");
    collapse.classList.toggle("active");
  });
});
// Fetching json + Inspiration for function addtocalendar and removefromcalendar: https://www.youtube.com/watch?v=pRkHOD_nkH4&t=408s
//Fetching json objects, storing in localstorage:
console.log("✅ main.js is loaded");

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

// calendar storage
let recipes = JSON.parse(localStorage.getItem("recipes"));
const calendarByDate = JSON.parse(localStorage.getItem("calendarByDate")) || {};
let calendar = JSON.parse(localStorage.getItem("calendar")) || [];
//getting the recipe id
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

//Adding to calendar with icons:

document.addEventListener("DOMContentLoaded", function () {
  let calendarIcons = document.querySelectorAll(".calendar-container");

  calendarIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
      let recipeId = icon.getAttribute("data-recipe-id");
      addToCalendar(recipeId);
      alert("Added to calendar!");
    });
  });
});

//localStorage.clear();
//addToCalendar(11);

function removeFromCalendar(recipeId) {
  let calendar = JSON.parse(localStorage.getItem("calendar")) || [];
  //Making sure localstorage clears when calendar has been emptied:
  let updatedCalendar = calendar.filter((item) => item.id != recipeId);
  if (updatedCalendar.length === 0) {
    localStorage.removeItem("calendar"); // clear calendar from localStorage
  } else {
    localStorage.setItem("calendar", JSON.stringify(updatedCalendar)); // update localstorage with the new calendar
  }
}
//drag and drop to "trash", help from Chatgpt
document.addEventListener("DOMContentLoaded", function () {
  const removeButton = document.getElementById("remove-recipe-button");

  removeButton.addEventListener("dragover", function (e) {
    e.preventDefault();
    removeButton.classList.add("drag-hover");
  });

  removeButton.addEventListener("dragleave", function (e) {
    removeButton.classList.remove("drag-hover");
  });

  removeButton.addEventListener("drop", function (e) {
    e.preventDefault();
    removeButton.classList.remove("drag-hover");

    const recipeId = e.dataTransfer.getData("recipeId");
    if (!recipeId) {
      console.warn("No recipe ID found during drop!");
      return;
    }

    removeFromCalendar(recipeId);
    localStorage.setItem("calendarByDate", JSON.stringify(calendarByDate)); //update the change in localstorage
    renderDraggableRecipes();
    generateCalendarGrid();
    alert("Recipe removed from calendar!");
  });
});

// Generate the calendar grid
function generateCalendarGrid() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const calendarByDate =
    JSON.parse(localStorage.getItem("calendarByDate")) || {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  grid.innerHTML = dayNames
    .map((day) => `<div class="day-name">${day}</div>`)
    .join("");

  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    let cellContent = `<div class="date-number">${d}</div>`;

    if (calendarByDate[dateStr]) {
      calendarByDate[dateStr].forEach((recipe) => {
        cellContent += `<img src="${recipe.image}" alt="${recipe.name}" title="${recipe.name}" />`;
      });
    }

    grid.innerHTML += `<div class="calendar-day" data-date="${dateStr}">${cellContent}</div>`;
  }
}
// Create the draggable recipe
let selectedRecipeId = null;
function renderDraggableRecipes() {
  const container = document.getElementById("added-recipes-panel");
  const calendar = JSON.parse(localStorage.getItem("calendar")) || [];

  container.innerHTML = "";

  calendar.forEach((recipe) => {
    const div = document.createElement("div");
    div.className = "recipe-draggable";
    div.setAttribute("draggable", "true");
    div.setAttribute("data-recipe-id", recipe.id);
    div.innerHTML = `<img src="${recipe.image}" alt="${recipe.name}" title="${recipe.name}" />`;
    container.appendChild(div);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".calendar-day") && selectedRecipeId) {
    const dayDiv = e.target.closest(".calendar-day");
    const date = dayDiv.getAttribute("data-date");
    addToCalendar(selectedRecipeId, date);
    generateCalendarGrid();
    selectedRecipeId = null;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  renderDraggableRecipes();
  generateCalendarGrid();
});
// When the user starts dragging a recipe card it save its ID
document.addEventListener("dragstart", function (e) {
  const wrapper = e.target.closest(".recipe-draggable");
  if (wrapper) {
    const id = wrapper.getAttribute("data-recipe-id");
    console.log(" Dragging recipeId:", id);
    e.dataTransfer.setData("recipeId", id);
  } else {
    console.warn("⚠️ Dragged element is not inside .recipe-draggable");
  }
});
//hover when dragging
document.addEventListener("dragover", function (e) {
  if (e.target.classList.contains("calendar-day")) {
    e.preventDefault();
    e.target.classList.add("drag-hover");
  }
});

document.addEventListener("dragleave", function (e) {
  if (e.target.classList.contains("calendar-day")) {
    e.target.classList.remove("drag-hover");
  }
});

// drop on calendar cell assigning recipe to that date
document.addEventListener("drop", function (e) {
  const day = e.target.closest(".calendar-day");

  if (day) {
    e.preventDefault();
    day.classList.remove("drag-hover");

    const recipeId = e.dataTransfer.getData("recipeId");
    const date = day.getAttribute("data-date");

    console.log("📦 DROP on", date, "with recipeId:", recipeId);

    if (!recipeId) {
      console.warn("⚠️ No recipeId found in dataTransfer!");
      return;
    }

    addRecipeToDate(recipeId, date);
    generateCalendarGrid();
  } else {
    console.warn("⚠️ Drop target is NOT a calendar-day");
  }
});
// Assign a specific recipe to a specific calendar date
function addRecipeToDate(recipeId, date) {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  let calendarByDate = JSON.parse(localStorage.getItem("calendarByDate")) || {};

  let recipe = recipes.find((r) => r.id == recipeId);
  if (!recipe) return;

  if (!calendarByDate[date]) calendarByDate[date] = [];

  const exists = calendarByDate[date].some((r) => r.id == recipeId);
  if (!exists) {
    calendarByDate[date].push(recipe);
    localStorage.setItem("calendarByDate", JSON.stringify(calendarByDate));
    console.log(`Saved ${recipe.name} to ${date}`);
  }
}
const emaiInput = document.getElementById("email");
const subscribeBtn = document.getElementById("subscribe-btn");
function subscribe() {
  const email = emaiInput.value.trim();
  if (email.length > 0) {
    alert("Thanks for subscribing to our newsletter!");
  } else {
    alert("please enter your e-mail address");
  }
}
subscribeBtn.addEventListener("click", subscribe);

emaiInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    subscribe();
  }
});
