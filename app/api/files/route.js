import { list, del } from "@vercel/blob";

export async function GET() {
  const result = await list({ limit: 1000 });
  const files = result.blobs.map((blob) => ({
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
    size: blob.size,
    uploadedAt: blob.uploadedAt
  }));
  return Response.json(files);
}

export async function DELETE(request) {
  const { url } = await request.json();
  if (!url) return Response.json({ error: "URL wajib diisi." }, { status: 400 });
  await del(url);
  return Response.json({ ok: true });
}