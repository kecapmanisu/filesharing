import { list, del } from "@vercel/blob";

export async function GET() {
  try {
    const result = await list({ limit: 1000 });
    return Response.json(result.blobs.map(blob => ({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    })));
  } catch (error) {
    console.error("List error:", error);
    return Response.json(
      { error: error?.message || "Gagal membaca file." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    if (!url) return Response.json({error:"URL wajib diisi."},{status:400});
    await del(url);
    return Response.json({ok:true});
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { error: error?.message || "Gagal menghapus file." },
      { status: 500 }
    );
  }
}