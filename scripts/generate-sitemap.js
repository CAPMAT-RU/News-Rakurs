const fs = require('fs');
const path = require('path');

const news = require('../news.json'); // путь к твоему файлу с новостями
const baseUrl = 'https://rakurs-news.github.io';

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

news.forEach(article => {
  // 1. Берём ID из JSON
  const id = article.id;

  // 2. Автоматически заменяем длинное тире и другие спецсимволы на дефис
  // Это решает проблему с ошибкой валидации
  let slug = id.replace(/–/g, '-').replace(/[^a-z0-9-]/gi, '-');

  // 3. Формируем URL. Если хочешь оставить ?id=..., оставь эту строку:
  const loc = `${baseUrl}/news.html?id=${slug}`;

  // (Опционально) Если хочешь ЧПУ-ссылки, используй эту строку вместо предыдущей:
  // const loc = `${baseUrl}/news/${slug}/`;

  xml += `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

xml += `\n</urlset>`;

// 4. Пишем готовый файл в корень сайта (для GitHub Pages)
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), xml);
console.log('Sitemap generated successfully!');
