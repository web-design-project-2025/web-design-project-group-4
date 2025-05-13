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
    const recipe = recipes.find((r) => r.id === parseInt(recipeId));

    if (recipe) {
      const detailContainer = document.getElementById("detail-container");
      detailContainer.innerHTML = `
        <div class="header-container">
          <h1 class="recipe-title">${recipe.name}</h1>
        </div>

        <div class="recipe-detail-container">
          <div class="left-column">
            <img src="${recipe.image}" alt="${
        recipe.name
      }" class="recipe-image" />

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
                <span><strong>Serving Size:</strong>
                  <input type="number" id="serving-input" value="${
                    recipe.serving_size
                  }" min="1" step="1" />
                </span>
              </div>

              <div class="button-group">
                <button class="save-button" data-recipe-id="${
                  recipe.id
                }" type="button">Save Recipe</button>
                <button class="add-button" type="button">Add to Calendar</button>
              </div>

              <div class="ingredients">
                <h2>Ingredients</h2>
                <ul class="ingredients-list">
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
                <span><strong>Carbs:</strong> ${
                  recipe.nutrition?.carbs_g
                } g</span>
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

      // Add to Calendar
      const calendarButton = document.querySelector(".add-button");
      calendarButton?.addEventListener("click", () => {
        addToCalendar(recipe.id);
        alert("Added to calendar!");
      });

      // Add to Favourites
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

      // Serving size logic provided with help from chatgpt https://chatgpt.com/share/68232e74-03ec-8007-ad78-fe83396d4b0e
      function scaleIngredient(ingredient, ratio) {
        const regex = /^([\d/.]+)\s*([a-zA-Z]+)?\s*(.*)/;
        const match = ingredient.match(regex);
        if (match) {
          let [, amount, unit = "", name] = match;
          if (amount.includes("/")) {
            const [num, denom] = amount.split("/").map(Number);
            amount = num / denom;
          } else {
            amount = parseFloat(amount);
          }

          if (!isNaN(amount)) {
            const scaledAmount = (amount * ratio)
              .toFixed(2)
              .replace(/\.00$/, "");
            return `${scaledAmount} ${unit} ${name}`.trim();
          }
        }
        return ingredient; // fallback
      }

      function updateIngredientsAndNutrition(recipe, newServings) {
        const ratio = newServings / recipe.serving_size;

        // Update ingredients
        const ingredientsList = document.querySelector(".ingredients-list");
        ingredientsList.innerHTML = recipe.ingredients
          .map((ingredient) => `<li>${scaleIngredient(ingredient, ratio)}</li>`)
          .join("");

        // Update nutrition
        const nutritionBox = document.querySelector(".nutrition-box");
        nutritionBox.innerHTML = `
          <span><strong>Calories:</strong> ${(
            recipe.nutrition?.calories * ratio
          ).toFixed(0)} kcal</span>
          <span><strong>Protein:</strong> ${(
            recipe.nutrition?.protein_g * ratio
          ).toFixed(1)} g</span>
          <span><strong>Fat:</strong> ${(
            recipe.nutrition?.fat_g * ratio
          ).toFixed(1)} g</span>
          <span><strong>Carbs:</strong> ${(
            recipe.nutrition?.carbs_g * ratio
          ).toFixed(1)} g</span>
        `;
      }

      const servingInput = document.getElementById("serving-input");
      servingInput.addEventListener("input", (e) => {
        const newServings = parseInt(e.target.value);
        if (!isNaN(newServings) && newServings > 0) {
          updateIngredientsAndNutrition(recipe, newServings);
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
