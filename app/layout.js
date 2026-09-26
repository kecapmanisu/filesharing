import "./globals.css";

export const metadata = {
  title: "LOWEILW FileShare",
  description: "Upload, simpan, dan bagikan file."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}