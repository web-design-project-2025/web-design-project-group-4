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
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" />

      <div class="recipe-section">
        <div class="recipe-box">
          <span><strong>Cooking Time:</strong> ${recipe.time}</span>
          <span><strong>Tags:</strong> ${recipe.tags}</span>
        </div>

        <div class="button-group">
          <button class="save-recipe-button" data-recipe-id="${recipe.id}" type="button">Save Recipe</button>
          <button class="add-calendar-button" type="button">Add to Calendar</button>
        </div>
      </div>

      <div class="description">
        <h3>Description</h3>
        <p>${recipe.description}</p>
      </div>
    </div>

    <div class="right-column">
      <h1 class="recipe-title">${recipe.name}</h1>
      <h2>Instructions</h2>
      <p class="instructions">${recipe.instruction}</p>
    </div>
  </div>
`;

    // detailContainer.innerHTML = `
    //   <h1 class="detail-header">${recipe.name}</h1>
    //   <div class="detail-box">
    //     <img class="detail-image" src="${recipe.image}" alt="${recipe.name}">
    //     <p class="description">${recipe.description}</p>
    //     <p><strong>Cooking Time:</strong> ${recipe.time}</p>
    //     <p><strong>Tags:</strong> ${recipe.tags}</p>
    //     <h2>Instructions</h2>
    //     <p class="instructions">${recipe.instruction}</p>
    //   </div>
    //   <button class="add-calendar-button" type="button">Add to Calendar</button>
    //   <button class="save-recipe-button" data-recipe-id="${recipe.id}" type="button">Save Recipe</button>
    // `;
  } else {
    // If no recipe is found, display an error message
    document.getElementById("detail-container").innerHTML =
      "<p>Recipe not found.</p>";
  }
}
