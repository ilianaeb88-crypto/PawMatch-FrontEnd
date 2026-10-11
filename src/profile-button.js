import { clearLiveAnswers, saveAnswersForAccount } from "./questionnaire-answers.js";

function getAccount() {
  try {
    return JSON.parse(localStorage.getItem("pawmatchAccount") || "null");
  } catch {
    return null;
  }
}

const headAndShoulders =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"></circle><path d="M3.5 22c0-5 3.8-8 8.5-8s8.5 3 8.5 8z"></path></svg>';

document.querySelectorAll(".topbar .nav-links").forEach((nav) => {
  nav.querySelectorAll("a.nav-item").forEach((link) => {
    if (link.textContent.trim() === "Profile") link.remove();
  });

  const button = document.createElement("a");
  button.className = "profile-avatar-button";
  button.href = "profile.html";
  button.setAttribute("aria-label", "Profile");

  const photo = getAccount()?.photo;
  if (photo) {
    const image = document.createElement("img");
    image.src = photo;
    image.alt = "";
    button.append(image);
  } else {
    button.innerHTML = headAndShoulders;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "profile-menu";
  wrapper.append(button);

  if (!/\/(profile|password|notifications|liked-pets)\.html$/.test(window.location.pathname)) {
    const menu = document.createElement("div");
    menu.className = "profile-menu-panel";
    menu.innerHTML = '<a href="profile.html">View Your Profile</a><button type="button">Log Out</button>';
    menu.querySelector("button").addEventListener("click", () => {
      saveAnswersForAccount(getAccount()?.email);
      clearLiveAnswers();
      localStorage.removeItem("pawmatchToken");
      sessionStorage.removeItem("pawmatchJustLoggedIn");
      sessionStorage.setItem("pawmatchLogoutNotice", "true");
      window.location.href = "index.html";
    });
    wrapper.append(menu);
  }

  nav.append(wrapper);
});