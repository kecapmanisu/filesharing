import { list, del } from "@vercel/blob";

function checkToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN belum tersedia di environment Production.");
  }
}

export async function GET() {
  try {
    checkToken();
    const result = await list({ token: process.env.BLOB_READ_WRITE_TOKEN, limit: 1000 });
    return Response.json(result.blobs.map(b => ({
      url:b.url, downloadUrl:b.downloadUrl, pathname:b.pathname,
      size:b.size, uploadedAt:b.uploadedAt
    })));
  } catch (e) {
    console.error("Blob list error:",e);
    return Response.json({error:e instanceof Error?e.message:"Gagal mengambil file"}, {status:500});
  }
}

export async function DELETE(request) {
  try {
    checkToken();
    const {url}=await request.json();
    if(!url) return Response.json({error:"URL wajib diisi"},{status:400});
    await del(url,{token:process.env.BLOB_READ_WRITE_TOKEN});
    return Response.json({ok:true});
  } catch(e) {
    console.error("Blob delete error:",e);
    return Response.json({error:e instanceof Error?e.message:"Gagal menghapus file"},{status:500});
  }
}