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

const progressMeter = document.querySelector(".progress-meter");
const progressCount = progressMeter?.querySelector(".progress-count");

if (progressMeter && progressCount) {
  const stepCount = Math.max(1, Number.parseInt(progressMeter.dataset.questionCount, 10) || 4);
  const stepProgress = document.createElement("div");
  stepProgress.className = "questionnaire-step-progress";
  stepProgress.setAttribute("role", "progressbar");
  stepProgress.setAttribute("aria-label", "Questionnaire progress");
  stepProgress.setAttribute("aria-valuemin", "0");
  stepProgress.setAttribute("aria-valuemax", "100");

  const stepFills = [];
  const stepPaws = [];

  for (let index = 0; index < stepCount; index += 1) {
    const segment = document.createElement("span");
    segment.className = "questionnaire-progress-segment";
    segment.setAttribute("aria-hidden", "true");

    const fill = document.createElement("span");
    fill.className = "questionnaire-progress-segment-fill";
    segment.append(fill);
    stepProgress.append(segment);
    stepFills.push(fill);

    const paw = document.createElement("span");
    paw.className = "questionnaire-progress-paw-marker";
    paw.setAttribute("aria-hidden", "true");
    paw.innerHTML = `<svg viewBox="0 0 100 100" focusable="false">
      <ellipse cx="13" cy="46" rx="9" ry="13" transform="rotate(-30 13 46)" />
      <ellipse cx="35" cy="24" rx="10" ry="14" transform="rotate(-12 35 24)" />
      <ellipse cx="65" cy="24" rx="10" ry="14" transform="rotate(12 65 24)" />
      <ellipse cx="87" cy="46" rx="9" ry="13" transform="rotate(30 87 46)" />
      <path d="M50 46C66 46 82 62 82 77C82 90 68 92 50 88C32 92 18 90 18 77C18 62 34 46 50 46Z" />
    </svg>`;
    stepProgress.append(paw);
    stepPaws.push(paw);
  }

  (document.querySelector(".questionnaire-panel") ?? progressMeter).prepend(stepProgress);

  function updateStepProgress() {
    const percentage = Math.min(100, Math.max(0, Number.parseFloat(progressCount.textContent) || 0));
    stepProgress.setAttribute("aria-valuenow", percentage);

    const answered = Math.round((percentage * stepCount) / 100);

    stepFills.forEach((fill, index) => {
      const segmentProgress = answered > index ? 100 : 0;
      fill.style.width = `${segmentProgress}%`;
      stepPaws[index].classList.toggle("is-active", segmentProgress === 100);
    });
  }

  new MutationObserver(updateStepProgress).observe(progressCount, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  updateStepProgress();
}
