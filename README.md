Gossip Girl X — README

What I changed
- Added a simple single-page site at index.html that uses a local client-side login and a posts UI.
- Added js/auth.js: a minimal client-side authentication helper that stores user credentials (username -> SHA-256(password) hex) in localStorage. On first run, if no account exists, sign-in will create the first account (owner/admin).
- Added js/app.js: stores posts in localStorage so posts persist in the browser and across reloads on the same device. Posts are publicly readable from the site.

How to publish
1. Push these files to the repository root (done by this commit).
2. Go to repository Settings → Pages and enable GitHub Pages using the main branch (root) as the source. The site will be published at https://gossipgirltvc.github.io/gossipgirlx/ (may take a minute).

Important security notes
- This implementation is purely client-side. All data (accounts and posts) are stored in visitors' browsers (localStorage) and are not a global server-side database.
- Credentials and any hashes are stored in localStorage and are visible to anyone who opens developer tools on their browser — this is NOT secure for real accounts.
- You asked to "hide" usernames/passwords from HTML: I moved all auth logic into js/auth.js (not inline in HTML). However on a static site anyone can open the JS files; there is no way to store secret credentials on a GitHub Pages static site without a backend.

Recommended next steps (to make real persistent storage and secure auth):
- Use Firebase (Firestore + Firebase Authentication). Firebase config may be public in the client, but rules protect your data server-side.
- Or create a small server (Netlify Functions, Vercel Serverless, or GitHub Actions with a bot) and store posts and credentials securely on the server.

If you want, I can:
- Integrate Firebase (I will show the exact steps and the files to add; you'll need to create a Firebase project and provide config or service account).
- Or implement a GitHub-backed storage using a GitHub App or a GitHub Action (requires a token stored in Actions secrets).

If you're happy with the localStorage demo, enable Pages and visit https://gossipgirltvc.github.io/gossipgirlx/ after publishing.
