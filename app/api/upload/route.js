import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return Response.json({
      error: "BLOB_READ_WRITE_TOKEN belum tersedia di environment Production."
    }, { status: 500 });
  }

  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["*/*"],
        maximumSizeInBytes: 1024 * 1024 * 1024
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      }
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);
    return Response.json({
      error: error instanceof Error ? error.message : "Upload gagal"
    }, { status: 500 });
  }
}