// Get the recipeId from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("recipeId");

// Fetch recipes from expanded-recipes.json
fetch("../expanded-recipes.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load recipes.");
    }
    return response.json();
  })
  .then((recipes) => {
    // Find the recipe with the matching ID
    const recipe = recipes.find((r) => r.id === parseInt(recipeId));

    if (recipe) {
      // Display recipe details
      // Toggle visibility for instructions on mobile,
      // help from Garrit Shaaps video https://play.ju.se/media/Web+and+User+Interface+Design+-+Advanced+CSS+Example+Part+1/0_96cyudpe
      const detailContainer = document.getElementById("detail-container");
      detailContainer.innerHTML = `
        
            <div class="header-container">
  <h1 class="recipe-title">${recipe.name}</h1>
</div>

<div class="recipe-detail-container">
  <div class="left-column">
    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" />

      <div class="mobile-tabs">
  <div class="toggle-tab">
  <input id="toggle" type="checkbox"/>
  <label for="toggle">Instructions</label>
  <div class="instructions">
        <p>${recipe.instructions}</p>
</div>
  </div>
</div>

      <div class="recipe-section">
        <div class="recipe-box">
          <span><strong>Cooking Time:</strong> ${
            recipe.time_minutes
          } minutes</span>
          <span><strong>Serving Size:</strong> ${recipe.serving_size}</span>
        </div>

        <div class="button-group">
          <button class="save-button" data-recipe-id="${
            recipe.id
          }" type="button">Save Recipe</button>
          <button class="add-button" type="button">Add to Calendar</button>
        </div>
           
        <div class="ingredients">
        <h2>Ingredients</h2>
          <ul>
            ${recipe.ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
          </ul>
        </div>
      </div>

      <div class="nutrition">
        <h3>Nutrition</h3>
        <div class="nutrition-box">
          <span><strong>Calories:</strong> ${
            recipe.nutrition?.calories
          } kcal</span>
          <span><strong>Protein:</strong> ${
            recipe.nutrition?.protein_g
          } g</span>
          <span><strong>Fat:</strong> ${recipe.nutrition?.fat_g} g</span>
          <span><strong>Carbs:</strong> ${recipe.nutrition?.carbs_g} g</span>
        </div>
      </div>
    </div>

  <div class="right-column">
  <div class="instructions">
        <h2>Instructions</h2>
        <p>${recipe.instructions}</p>
      </div>
    </div>
  </div>

      `;
      //Add to Calendar
      const calendarButton = document.querySelector(".add-button");
      calendarButton?.addEventListener("click", () => {
        addToCalendar(recipe.id);
        alert("Added to calendar!");
      });

      //Add to Favourites
      const saveButton = document.querySelector(".save-button");
      saveButton?.addEventListener("click", () => {
        const savedRecipes =
          JSON.parse(localStorage.getItem("savedRecipes")) || [];
        if (!savedRecipes.includes(recipe.id)) {
          savedRecipes.push(recipe.id);
          localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
          alert("Recipe saved!");
        } else {
          alert("Recipe already saved.");
        }
      });
    } else {
      document.getElementById("detail-container").innerHTML =
        "<p>Recipe not found.</p>";
    }
  })
  .catch((error) => {
    console.error(error);
    document.getElementById("detail-container").innerHTML =
      "<p>Error loading recipes.</p>";
  });
