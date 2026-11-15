// Shared helpers for pages that list pets coming from the backend.
import imageCopy2 from "./assets/image copy 2.png";
import imageCopy3 from "./assets/image copy 3.png";
import imageCopy4 from "./assets/image copy 4.png";
import imageCopy5 from "./assets/image copy 5.png";
import imageCopy22 from "./assets/image copy 22.png";

// The original demo pets keep their bundled photos. Every other pet uses
// the image URLs saved with it (for form pets, Google Drive links).
const demoImages = { milo: imageCopy4, luna: imageCopy3, bear: imageCopy5, cleo: imageCopy2, genesis: imageCopy22 };

export const fallbackImage = (pet) => `${import.meta.env.BASE_URL}${pet.animal === "Cat" ? "cat.png" : "dog-transparent.png"}`;

// Form pets can have several photos (pet.images); older pets only have pet.image.
export function imagesFor(pet) {
  if (demoImages[pet.id]) return [demoImages[pet.id]];
  const images = (Array.isArray(pet.images) ? pet.images : []).filter(Boolean);
  if (images.length) return images;
  return [pet.image || fallbackImage(pet)];
}

// Pet details come from a public form, so always escape before putting them in HTML.
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const ageText = (age) => (Number(age) > 0 ? `${age} Year${Number(age) === 1 ? "" : "s"} Old` : "Age unknown");

export function readLikedPets() {
  try {
    const liked = JSON.parse(localStorage.getItem("pawmatchLikedPets") || "[]");
    return Array.isArray(liked) ? liked : [];
  } catch {
    return [];
  }
}

// Swap a broken photo (private Drive file, old path) for the generic cat/dog picture.
export function useFallbackImages(container) {
  container.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    const fallback = image.dataset.fallback;
    if (fallback && image.getAttribute("src") !== fallback) image.src = fallback;
  }, true);
}

// The free hosting plan sleeps when idle, so tell people why the first load is slow.
export async function withSlowNotice(statusElement, promise) {
  const slowNotice = setTimeout(() => {
    statusElement.textContent = "Still loading… the server may be waking up, which can take up to a minute.";
  }, 6000);
  try {
    return await promise;
  } finally {
    clearTimeout(slowNotice);
  }
}
