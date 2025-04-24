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
      <h1 class="detail-header">${recipe.name}</h1>
      <div class="detail-box">
        <img class="detail-image" src="${recipe.image}" alt="${recipe.name}">
        <p class="description">${recipe.description}</p>
        <p><strong>Cooking Time:</strong> ${recipe.time}</p>
        <p><strong>Tags:</strong> ${recipe.tags}</p>
        <h2>Instructions</h2>
        <p class="instructions">${recipe.instruction}</p>
      </div>
      <button class="start-cooking-button" type="button">Start Cooking</button>
      <button class="save-recipe-button" data-recipe-id="${recipe.id}" type="button">Save Recipe</button>
    `;
  } else {
    // If no recipe is found, display an error message
    document.getElementById("detail-container").innerHTML =
      "<p>Recipe not found.</p>";
  }
}
