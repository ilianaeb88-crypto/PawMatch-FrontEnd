# PawMatch-FrontEnd

## Google sign-in

The welcome page uses Google Identity Services and sends the returned ID-token credential to `POST /api/auth/google`. Configure these Vite variables in local development and Netlify:

```text
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:4000/api
```

The backend must verify the credential with Google's token verifier, create or find the user, and return the existing PawMatch JWT in `{ token, user }`. Add `https://findpawmatch.netlify.app` and local development origins to the Google OAuth web client's authorized JavaScript origins.
