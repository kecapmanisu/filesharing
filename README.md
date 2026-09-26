# LOWEILW FileShare — Vercel

This project uses Vercel Blob client uploads and server-side Blob APIs.

IMPORTANT:
The Vercel Blob SDK requires Blob credentials. In a Vercel Blob project connection, make sure the project has a `BLOB_READ_WRITE_TOKEN` available to the deployment. If the dashboard only exposes OIDC connection metadata and the runtime logs say "No read-write token found", create/connect a Blob read-write token for this project and redeploy.

Do not paste the token into source code or GitHub.
