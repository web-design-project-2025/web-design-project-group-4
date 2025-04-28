document.addEventListener("DOMContentLoaded", function () {
  // Click hearts
  const likedIcons = document.querySelectorAll(".liked-container");

  likedIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
      const likedId = this.getAttribute("data-recipe-id");

      if (!likedId) {
        console.error("No recipe ID found!");
        return;
      }

      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      const favorites = JSON.parse(localStorage.getItem("favorite")) || [];

      const recipe = recipes.find((r) => r.id == Number(likedId));

      if (!recipe) {
        console.error("Recipe not found!");
        return;
      }

      const index = favorites.findIndex((fav) => fav.id == recipe.id);

      if (index === -1) {
        // Not in favorites  add it
        favorites.push(recipe);
        alert("Added to favorites!");
      } else {
        // Already in favorites remove it
        favorites.splice(index, 1);
        alert("Removed from favorites!");
      }

      localStorage.setItem("favorite", JSON.stringify(favorites));

      updateFavoriteList();
    });
  });

  function updateFavoriteList() {
    const favoriteContainer = document.querySelector(
      ".favorites .liked-container"
    );

    if (favoriteContainer) {
      const favorites = JSON.parse(localStorage.getItem("favorite")) || [];

      favoriteContainer.innerHTML = "";

      favorites.forEach(function (recipe) {
        const favoriteItem = document.createElement("div");
        favoriteItem.classList.add("favorite-item");

        favoriteItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" style="width:120px;height:120px;object-fit:cover;">
          `;

        favoriteContainer.appendChild(favoriteItem);
      });

      if (favorites.length === 0) {
        favoriteContainer.innerHTML = "<p>No favorites yet.</p>";
      }
    }
  }

  updateFavoriteList();
});
