"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

const MAX = 1024 * 1024 * 1024;

function size(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i ? 2 : 0)} ${units[i]}`;
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch("/api/files", { cache: "no-store" });
    const d = await r.json();
    if (r.ok) setFiles(d);
    else setMsg(d.error || "Gagal mengambil daftar file");
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      setMsg("Pilih file terlebih dahulu.");
      return;
    }

    if (file.size > MAX) {
      setMsg("Maksimal 1 GB per file.");
      return;
    }

    setBusy(true);
    setProgress(0);
    setMsg("");

    try {
      await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: true,
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });

      setMsg("File berhasil diupload.");
      setFile(null);
      await load();
    } catch (e) {
      setMsg(e?.message || "Upload gagal.");
    } finally {
      setBusy(false);
    }
  }

  async function del(url) {
    if (!confirm("Hapus file ini?")) return;

    const r = await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const d = await r.json();
    setMsg(r.ok ? "File dihapus." : d.error || "Gagal menghapus");

    if (r.ok) load();
  }

  async function copy(url) {
    await navigator.clipboard.writeText(url);
    setMsg("Link berhasil disalin.");
  }

  return (
    <main className="wrap">
      <header>
        <b className="logo">
          loweilw<span>.files</span>
        </b>
        <span className="pill">Vercel FileShare</span>
      </header>

      <section className="hero">
        <div className="tag">UPLOAD • SHARE • DOWNLOAD</div>
        <h1>
          Upload, simpan,
          <br />
          dan bagikan file.
        </h1>
        <p>File disimpan di Vercel Blob.</p>
      </section>

      {msg && <div className="alert">{msg}</div>}

      <section className="card">
        <form onSubmit={submit}>
          <label className="drop">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="ico">↑</div>
            <h2>{file ? file.name : "Pilih file"}</h2>
            <p>
              {file
                ? `${size(file.size)} — siap diupload`
                : "Klik atau tarik file ke sini"}
            </p>
            <small>Maksimal 1 GB per file</small>
          </label>

          {busy && (
            <div className="progressWrap">
              <div className="phead">
                <b>Uploading</b>
                <span>{progress}%</span>
              </div>
              <div className="bar">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button className="btn" disabled={busy}>
            {busy ? `Uploading ${progress}%` : "Upload File"}
          </button>
        </form>
      </section>

      <section className="files">
        <div className="head">
          <div>
            <div className="tag">YOUR FILES</div>
            <h2>Daftar File</h2>
          </div>
          <span className="count">{files.length} file</span>
        </div>

        {files.length ? (
          files.map((x) => (
            <div className="row" key={x.url}>
              <div className="ficon">📄</div>
              <div className="info">
                <b>{x.pathname.split("/").pop()}</b>
                <small>
                  {size(x.size)} ·{" "}
                  {new Date(x.uploadedAt).toLocaleString("id-ID")}
                </small>
              </div>
              <button className="copy" onClick={() => copy(x.downloadUrl)}>
                Copy Link
              </button>
              <a
                className="down"
                href={x.downloadUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
              <button className="danger" onClick={() => del(x.url)}>
                Hapus
              </button>
            </div>
          ))
        ) : (
          <div className="empty">Belum ada file.</div>
        )}
      </section>

      <footer>LOWEILW FileShare</footer>
    </main>
  );
}
