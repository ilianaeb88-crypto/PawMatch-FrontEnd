const COMPLETION_KEY_PREFIX = "pawmatchQuestionnaireCompleted:";
const LEGACY_COMPLETION_KEY = "questionnaireCompleted";

function getCompletionKey() {
  const account = JSON.parse(localStorage.getItem("pawmatchAccount") || "null");
  const email = typeof account?.email === "string" ? account.email.trim().toLowerCase() : "";
  return `${COMPLETION_KEY_PREFIX}${encodeURIComponent(email || "guest")}`;
}

export function isQuestionnaireComplete() {
  const completionKey = getCompletionKey();
  const savedCompletion = localStorage.getItem(completionKey);
  if (savedCompletion !== null) return savedCompletion === "true";

  if (localStorage.getItem(LEGACY_COMPLETION_KEY) !== "true") return false;

  localStorage.setItem(completionKey, "true");
  localStorage.removeItem(LEGACY_COMPLETION_KEY);
  return true;
}

export function markQuestionnaireComplete() {
  localStorage.setItem(getCompletionKey(), "true");
  localStorage.removeItem(LEGACY_COMPLETION_KEY);
}
