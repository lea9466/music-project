// generate-sitemap.js
const fs = require("fs");

const baseUrl = "https://music-project-snowy-five.vercel.app";
const apiUrl = "http://localhost:8080/api/Song/GetFlatSongs"; // 👈 עדכני אם שם ה-controller שונה

function createSlug(song) {
  return `${song.name}-${song.artist}-${song.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0590-\u05FF-]/g, "");
}

async function generateSitemap() {
  const res = await fetch(apiUrl);
  const songs = await res.json();

  const pages = [
    "/",
    ...songs.map((song) => `/chords/${createSlug(song)}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>\n    <loc>${baseUrl}${encodeURI(page)}</loc>\n  </url>`).join("\n")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log(`✅ Sitemap נוצר עם ${songs.length} שירים!`);
}

generateSitemap().catch(console.error);