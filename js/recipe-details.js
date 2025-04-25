// Get the recipeId from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("recipeId");

// Fetch recipes from localStorage
const storedRecipes = localStorage.getItem("recipes");

if (storedRecipes) {
  const recipes = JSON.parse(storedRecipes);

  // Find the recipe with the matching ID
  const recipe = recipes.find((r) => r.id === parseInt(recipeId));

  if (recipe) {
    // Display recipe details
    const detailContainer = document.getElementById("detail-container");
    detailContainer.innerHTML = `
      <div class="recipe-detail-container">
        <div class="left-column">
          <img src="${recipe.image}" alt="${
      recipe.name
    }" class="recipe-image" />

          <div class="recipe-section">
            <div class="recipe-box">
              <span><strong>Cooking Time:</strong> ${
                recipe.time_minutes
              } minutes</span>
              <span><strong>Serving Size:</strong> ${recipe.serving_size}</span>
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

            <div class="button-group">
              <button class="save-button" data-recipe-id="${
                recipe.id
              }" type="button">Save Recipe</button>
              <button class="add-button" type="button">Add to Calendar</button>
            </div>
          </div>

          <div class="description">
            <h3>Description</h3>
            <p>${recipe.description || "No description available."}</p>
          </div>
        </div>

        <div class="right-column">
          <h1 class="recipe-title">${recipe.name}</h1>

          <h2>Ingredients</h2>
          <ul>
            ${recipe.ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
          </ul>

          <h2>Instructions</h2>
          <p class="instructions">${recipe.instructions}</p>
        </div>
      </div>
    `;
  } else {
    document.getElementById("detail-container").innerHTML =
      "<p>Recipe not found.</p>";
  }
}
