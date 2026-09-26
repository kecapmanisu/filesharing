# LOWEILW FileShare v3

This version explicitly uses `BLOB_READ_WRITE_TOKEN` for Vercel Blob.

## Important
Your Vercel Blob connection currently exposes `BLOB_STORE_ID` and `BLOB_WEBHOOK_PUBLIC_KEY`, but your runtime logs say:
`No read-write token found`.

Therefore this project requires a Blob **Read-Write Token** in the Vercel project Environment Variables.

Do NOT put the token in GitHub or source code.

### Add the token
Vercel Dashboard → Storage → your Blob store → create/copy a Read-Write Token (if the UI provides it), then add it under:
Project → Settings → Environment Variables

Name:
`BLOB_READ_WRITE_TOKEN`

Environment:
Production (also Preview if desired)

Then redeploy.

The application allows any file MIME type and sets an application-side limit of 1 GB/file. Actual Blob limits and billing depend on the Vercel Blob plan.


## Build fix
This version contains a clean JSX `app/page.js` without escaped `\<` / `\>` characters. Use this file/project for deployment.
