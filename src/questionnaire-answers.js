const SNAPSHOT_PREFIX = "pawmatchAnswers:";

function snapshotKey(email) {
  return `${SNAPSHOT_PREFIX}${encodeURIComponent(String(email || "").trim().toLowerCase())}`;
}

function liveAnswerKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith("selected") || key === "answerRanks");
}

export function clearLiveAnswers() {
  liveAnswerKeys().forEach((key) => localStorage.removeItem(key));
}

export function saveAnswersForAccount(email) {
  if (!email) return;
  const snapshot = {};
  liveAnswerKeys().forEach((key) => { snapshot[key] = localStorage.getItem(key); });
  localStorage.setItem(snapshotKey(email), JSON.stringify(snapshot));
}

export function restoreAnswersForAccount(email) {
  clearLiveAnswers();
  try {
    const snapshot = JSON.parse(localStorage.getItem(snapshotKey(email)) || "{}");
    Object.entries(snapshot).forEach(([key, value]) => localStorage.setItem(key, value));
  } catch {
    // An unreadable snapshot is treated as no saved answers.
  }
}
