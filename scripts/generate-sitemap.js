const fs = require('fs');
const path = require('path'); // <-- Сначала подключаем, потом используем!

console.log('--- START GENERATING SITEMAP ---');
console.log('Current working directory:', process.cwd());

// Формируем абсолютный путь к файлу news.json
// Мы берем текущую папку скрипта (__dirname) и поднимаемся на уровень вверх
const newsFilePath = path.join(__dirname, '../news.json');
console.log('Trying to read file at:', newsFilePath);

let news;

try {
  // Пытаемся прочитать файл
  const rawData = fs.readFileSync(newsFilePath, 'utf8');
  
  // Пытаемся распарсить JSON
  news = JSON.parse(rawData);
  
  console.log(`Success! Loaded ${news.length} news items.`);
} catch (err) {
  // Если что-то пошло не так (файла нет или JSON битый) — пишем громко и выходим с ошибкой
  console.error('CRITICAL ERROR reading news.json:', err.message);
  process.exit(1); // Это сделает сборку КРАСНОЙ, чтобы ты точно увидел проблему
}

const baseUrl = 'https://rakurs-news.github.io';

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

news.forEach(article => {
  if (!article.id) {
    console.warn('Warning: Skipping article without ID:', article);
    return;
  }

  const id = article.id;

  // Замена длинного тире и спецсимволов на дефис
  let slug = id
    .replace(/–/g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase(); // Добавил lowercase для чистоты URL

  const loc = `${baseUrl}/news.html?id=${slug}`;

  xml += `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

xml += `\n</urlset>`;

// Путь для сохранения sitemap.xml (в корень репозитория)
const sitemapPath = path.join(__dirname, '../sitemap.xml');

try {
  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap generated successfully at: ${sitemapPath}`);
} catch (err) {
  console.error('CRITICAL ERROR writing sitemap.xml:', err.message);
  process.exit(1);
}
