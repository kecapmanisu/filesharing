import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
  const body = await request.json();

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      return {
        allowedContentTypes: [
          "application/pdf",
          "text/plain",
          "text/csv",
          "application/zip",
          "application/x-rar-compressed",
          "application/vnd.rar",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.ms-powerpoint",
          "image/*",
          "audio/*",
          "video/*"
        ],
        maximumSizeInBytes: 1024 * 1024 * 1024
      };
    },
    onUploadCompleted: async ({ blob }) => {
      console.log("Upload completed:", blob.url);
    }
  });

  return Response.json(jsonResponse);
}