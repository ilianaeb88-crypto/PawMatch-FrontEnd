document.querySelectorAll(".back-button:not(.done-button)").forEach((backButton) => {
  backButton.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    let previousPage;
    try {
      previousPage = new URL(document.referrer);
    } catch {
      return;
    }

    if (previousPage.origin !== window.location.origin) return;

    event.preventDefault();
    window.history.back();
  });
});
