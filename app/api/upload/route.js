import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ["*/*"],
          maximumSizeInBytes: 1024 * 1024 * 1024,
          tokenPayload: JSON.stringify({
            pathname,
          }),
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload gagal",
      },
      { status: 500 }
    );
  }
}
