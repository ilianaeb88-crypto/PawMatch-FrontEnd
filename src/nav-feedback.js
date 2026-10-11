import "./profile-button.js";
import { isQuestionnaireComplete } from "./questionnaire-state.js";
import { clearLiveAnswers, saveAnswersForAccount } from "./questionnaire-answers.js";

let activeNotice;
let activeNoticeTimeout;

function parseStoredValue(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function clearQuestionnaireAnswers() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("selected"))
    .forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("answerRanks");
}

function showNavigationNotice(anchor, message) {
  activeNotice?.remove();
  window.clearTimeout(activeNoticeTimeout);

  const notice = document.createElement("div");
  notice.className = "nav-feedback-bubble";
  notice.setAttribute("role", "alert");
  notice.textContent = message;
  document.body.append(notice);

  const anchorBounds = anchor.getBoundingClientRect();
  const noticeBounds = notice.getBoundingClientRect();
  const left = Math.min(
    Math.max(8, anchorBounds.left + (anchorBounds.width - noticeBounds.width) / 2),
    window.innerWidth - noticeBounds.width - 8,
  );
  const top = Math.max(
    8,
    Math.min(anchorBounds.bottom + 8, window.innerHeight - noticeBounds.height - 8),
  );

  notice.style.left = `${left}px`;
  notice.style.top = `${top}px`;
  activeNotice = notice;
  activeNoticeTimeout = window.setTimeout(() => notice.remove(), 5000);
}

document.querySelectorAll('.topbar .nav-links a[href="match-results.html"]').forEach((link) => {
  const wrapper = link.closest(".best-matches-nav-item") || document.createElement("span");
  if (!link.closest(".best-matches-nav-item")) {
    wrapper.className = "best-matches-nav-item";
    link.before(wrapper);
    wrapper.append(link);
  }

  link.addEventListener("click", (event) => {
    if (isQuestionnaireComplete()) return;
    event.preventDefault();
    showNavigationNotice(link, "You Can't Find Your Matches Without Taking the Questionnaire");
  });
  link.dataset.navGuardReady = "true";
});

document.querySelectorAll('.profile-settings-sidebar a[href="liked-pets.html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const likedPets = parseStoredValue("pawmatchLikedPets", []);
    if (Array.isArray(likedPets) && likedPets.length > 0) return;
    event.preventDefault();
    showNavigationNotice(link, "You Have No Saved Pets");
  });
  link.dataset.navGuardReady = "true";
});

const notificationPetIds = ["cleo", "bear", "luna"];
const seenNotificationsKey = "pawmatchSeenNotifications";

if (window.location.pathname.endsWith("notifications.html")) {
  localStorage.setItem(seenNotificationsKey, JSON.stringify(notificationPetIds));
}

const seenNotifications = parseStoredValue(seenNotificationsKey, []);
const unseenNotificationCount = notificationPetIds.filter((id) => !seenNotifications.includes(id)).length;
if (unseenNotificationCount > 0) {
  document.querySelectorAll('.profile-settings-sidebar a[href="notifications.html"]').forEach((link) => {
    const badge = document.createElement("span");
    badge.className = "notification-badge";
    badge.textContent = unseenNotificationCount;
    badge.setAttribute("aria-label", `${unseenNotificationCount} new pets`);
    link.append(badge);
  });
}

const logoutButton = document.querySelector("#logout-button");
if (logoutButton) {
  const logoutControl = document.createElement("div");
  logoutControl.className = "logout-control";
  logoutButton.before(logoutControl);
  logoutControl.append(logoutButton);

  logoutButton.addEventListener("click", () => {
  document.querySelector(".logout-confirmation")?.remove();

  const confirmation = document.createElement("div");
  confirmation.className = "logout-confirmation";
  confirmation.setAttribute("role", "group");
  confirmation.setAttribute("aria-label", "Confirm log out");
  confirmation.innerHTML = '<span>Are You Sure?</span><div class="logout-confirmation-actions"><button type="button" data-action="confirm">Yes</button><button type="button" data-action="cancel">No</button></div>';
  logoutControl.append(confirmation);

  const buttonBounds = logoutButton.getBoundingClientRect();
  const panelBounds = confirmation.getBoundingClientRect();
  confirmation.style.left = `${Math.min(Math.max(8, buttonBounds.left), window.innerWidth - panelBounds.width - 8)}px`;
  confirmation.style.top = `${Math.min(buttonBounds.bottom + 6, window.innerHeight - panelBounds.height - 8)}px`;

  confirmation.querySelector('[data-action="cancel"]').addEventListener("click", () => confirmation.remove());
  confirmation.querySelector('[data-action="confirm"]').addEventListener("click", () => {
    localStorage.removeItem("pawmatchToken");
    const loggedOutAccount = JSON.parse(localStorage.getItem("pawmatchAccount") || "null");
    saveAnswersForAccount(loggedOutAccount?.email);
    clearLiveAnswers();
    sessionStorage.removeItem("pawmatchJustLoggedIn");
    sessionStorage.setItem("pawmatchLogoutNotice", "true");
    window.location.href = "index.html";
  });
  });
}

document.querySelectorAll('a[href="adoption-choice.html"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (!isQuestionnaireComplete()) clearQuestionnaireAnswers();
  });
});