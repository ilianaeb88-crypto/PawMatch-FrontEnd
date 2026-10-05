# Copilot instructions for PawMatch

## Build, lint, and test

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs Oxlint. To lint one JavaScript file, run `npx oxlint src/questionnaire-back.js` (replace the path as needed).
- There is no test script or test runner configured in `package.json`, so there is currently no single-test command.

## Architecture

- The product is a Vite multi-page site: its user-facing screens are separate root-level HTML files connected with ordinary `.html` links, not routes in a React single-page application.
- `vite.config.js` explicitly lists the HTML build inputs. When adding or removing a product page, update that list as well as its navigation links; otherwise the page may not be included in the production build.
- Page-specific behavior is commonly inline in its HTML. Shared browser-side behaviors are standalone ES modules in `src/`, loaded only by pages that need them. `src/questionnaire-back.js` handles shared questionnaire back/progress behavior; `src/nav-feedback.js` handles navigation guards and account logout interactions.
- `styles.css` is the shared stylesheet for the HTML pages. Static files in `public/` are served from the site root; page images also reference files under `src/assets/`.
- `src/main.jsx`, `src/App.jsx`, and the component styles are the Vite/React starter entry point and are not the router for the linked product pages. Check how a page is actually included before moving UI into React.
- The main user flow is the home/account pages into the questionnaire: `adoption-choice.html` branches into cat or dog questions, answers are persisted in `localStorage`, and `rank-answers.html` leads to results. Results and related pages use that saved state; preserve the storage keys and completion checks when changing this flow.

## Project-specific conventions

- Keep page navigation consistent with the explicit filenames in `vite.config.js`. Shared scripts are opt-in: add their `<script type="module">` include to each page that needs the behavior.
- Questionnaire answers and ranking use browser `localStorage` (keys such as `selectedPath`, `selectedPet`, `selectedCat…`, `selectedDog…`, and `answerRanks`). Completion is recorded per account email by `src/questionnaire-state.js`, with a guest key when no account email is stored. Session-only notices use `sessionStorage`. Update readers, writers, and reset/guard logic together when changing this state contract.
- Google sign-in is configured through Vite variables `VITE_GOOGLE_CLIENT_ID` and `VITE_API_BASE_URL`; `.env.example` shows the expected local values. The frontend posts the Google credential to `POST /api/auth/google` and expects `{ token, user }`; the backend is responsible for verifying the credential. Do not put credentials in source files.
