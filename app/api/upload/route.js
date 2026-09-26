import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["*/*"],
        maximumSizeInBytes: 1024 * 1024 * 1024
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      }
    });
    return Response.json(response);
  } catch (error) {
    console.error("Upload token error:", error);
    return Response.json(
      { error: error?.message || "Gagal membuat token upload." },
      { status: 500 }
    );
  }
}