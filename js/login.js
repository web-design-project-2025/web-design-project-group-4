//I GOT HELP FROM AI AND GOOGLE HOW TO SET UP THE API
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);

  const user = {
    name: data.name,
    email: data.email,
    profilePic: data.picture,
  };

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "account.html"; // redirect after login
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Fill in the profile info
    document.querySelector(".profile-pic").src = user.profilePic;
    document.querySelector(".username").textContent = user.name;

    // If preference already exists, pre-select it
    if (user.foodPreference) {
      const radio = document.querySelector(
        `input[value="${user.foodPreference}"]`
      );
      if (radio) {
        radio.checked = true;
        document.getElementById(
          "savedPreference"
        ).textContent = `You chose: ${user.foodPreference}`;
      }
    }

    // Save preference when form is submitted
    document
      .getElementById("preferenceForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const selected = document.querySelector(
          'input[name="foodPreference"]:checked'
        );
        if (selected) {
          user.foodPreference = selected.value;
          localStorage.setItem("user", JSON.stringify(user));
          document.getElementById(
            "savedPreference"
          ).textContent = `You chose: ${selected.value}`;
        }
      });
  } else {
    //  redirect back to login page
    redirectToLogin();
  }
});
function redirectToLogin() {
  if (window.location.pathname !== "/login.html") {
    window.location.href = "login.html";
  }
}
function redirectToLogin() {
  if (!window.location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
}

// Sign out function with confirm pop up from https://www.w3schools.com/jsref/met_win_confirm.asp
document.addEventListener("DOMContentLoaded", function () {
  const signOutButton = document.getElementById("signOut");
  signOutButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  });
});
