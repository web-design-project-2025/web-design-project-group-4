//get favorites depends on account
function getFavoritesKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.email ? `favorites_${user.email}` : "favorites_guest";
}

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
    const favoritesKey = getFavoritesKey();
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    const recipe = recipes.find((r) => r.id == Number(likedId));

    if (!recipe) {
      console.error("Recipe not found!");
      return;
    }

    const index = favorites.findIndex((fav) => fav.id == recipe.id);

    if (index === -1) {
      favorites.push(recipe);
      alert("Added to favorites!");
    } else {
      favorites.splice(index, 1);
      alert("Removed from favorites!");
    }

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));

    updateFavoriteList();
  });
});

function updateFavoriteList() {
  const favoriteContainer = document.querySelector(
    ".favorites .liked-container"
  );

  if (favoriteContainer) {
    const favoritesKey = getFavoritesKey();
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

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
