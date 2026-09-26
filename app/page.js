"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

const MAX = 1024 * 1024 * 1024; // 1 GB

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024; i++;
  }
  return `${n.toFixed(i ? 2 : 0)} ${units[i]}`;
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadFiles() {
    const res = await fetch("/api/files", { cache: "no-store" });
    if (res.ok) setFiles(await res.json());
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setMessage("Pilih file terlebih dahulu.");
    if (file.size > MAX) return setMessage("Maksimal 1 GB per file.");

    setBusy(true);
    setProgress(0);
    setMessage("");

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage))
      });

      setMessage("File berhasil diupload.");
      setFile(null);
      setProgress(100);
      await loadFiles();
    } catch (err) {
      setMessage(err?.message || "Upload gagal.");
    } finally {
      setBusy(false);
    }
  }

  async function removeFile(url) {
    if (!confirm("Hapus file ini?")) return;
    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (res.ok) {
      setMessage("File dihapus.");
      loadFiles();
    } else {
      setMessage("Gagal menghapus file.");
    }
  }

  async function copyLink(url) {
    await navigator.clipboard.writeText(url);
    setMessage("Link berhasil disalin.");
  }

  return (
    <main className="wrap">
      <header>
        <div className="logo">loweilw<span>.files</span></div>
        <div className="pill">Vercel FileShare</div>
      </header>

      <section className="hero">
        <div className="tag">UPLOAD • SHARE • DOWNLOAD</div>
        <h1>Upload, simpan,<br />dan bagikan file.</h1>
        <p>File disimpan di Vercel Blob, bukan di filesystem Vercel.</p>
      </section>

      {message && <div className="alert">{message}</div>}

      <section className="card">
        <form onSubmit={handleUpload}>
          <label className="drop">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="ico">↑</div>
            <h2>{file ? file.name : "Pilih file"}</h2>
            <p>{file ? `${formatSize(file.size)} — siap diupload` : "Klik untuk memilih file"}</p>
            <small>Maksimal 1 GB per file</small>
          </label>

          {busy && (
            <div className="progressWrap">
              <div className="phead"><b>Uploading</b><span>{progress}%</span></div>
              <div className="bar"><i style={{width: `${progress}%`}} /></div>
            </div>
          )}

          <button className="btn" disabled={busy}>
            {busy ? `Uploading ${progress}%` : "Upload File"}
          </button>
        </form>
      </section>

      <section className="files">
        <div className="head">
          <div><div className="tag">YOUR FILES</div><h2>Daftar File</h2></div>
          <span className="count">{files.length} file</span>
        </div>

        {files.length === 0 ? (
          <div className="empty">Belum ada file.</div>
        ) : files.map((item) => (
          <div className="row" key={item.url}>
            <div className="ficon">📄</div>
            <div className="info">
              <b>{item.pathname.split("/").pop()}</b>
              <small>{formatSize(item.size)} · {new Date(item.uploadedAt).toLocaleString("id-ID")}</small>
            </div>
            <button className="copy" onClick={() => copyLink(item.downloadUrl)}>Copy Link</button>
            <a className="down" href={item.downloadUrl} target="_blank">Download</a>
            <button className="danger" onClick={() => removeFile(item.url)}>Hapus</button>
          </div>
        ))}
      </section>

      <footer>LOWEILW FileShare</footer>
    </main>
  );
}