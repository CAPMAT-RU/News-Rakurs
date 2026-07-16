const fs = require('fs');
const path = require('path');
const DOMAIN = 'https://rakurs-news.github.io';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}

console.log('🚀 ЗАПУСК ГЕНЕРАТОРА SITEMAP...');
console.log(`📂 Рабочая директория: ${process.cwd()}`);
console.log(`📄 Ищем файл: ${path.join(process.cwd(), 'news.json')}`);

try {
  if (!fs.existsSync('news.json')) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Файл news.json не найден!');
    process.exit(1);
  }

  const fileContent = fs.readFileSync('news.json', 'utf8');
  let newsData = JSON.parse(fileContent);

  console.log(`✅ Загружено новостей: ${newsData.length}`);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${DOMAIN}/</loc>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
`;

  // Генерируем XML для карты сайта
  newsData.forEach((news, index) => {
    const safeId = escapeXml(news.id);
    
    // Пытаемся корректно обработать дату (если формат не задан, ставим текущую)
    let isoDate = '2026-07-16'; 
    if (news.date && typeof news.date === 'string' && news.date.includes('.')) {const [day, month, year] = news.date.split('.');
      isoDate = `${year}-${month}-${day}`;
    }

    // ИЗМЕНЕНИЕ: Теперь используем article.html
    sitemap += `<url>
<loc>${DOMAIN}/article.html?id=${safeId}</loc>
<lastmod>${isoDate}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
`;
  });

  sitemap += '</urlset>';

  // Записываем sitemap.xml
  fs.writeFileSync('sitemap.xml', sitemap.trim(), 'utf8');
  console.log(`✅ Файл sitemap.xml успешно создан с ссылками на article.html!`);
  console.log(`🎉 ГОТОВО! Всего URL в карте: ${newsData.length + 1}`);

} catch (error) {
  console.error('💥 Неожиданная ошибка:', error.message);process.exit(1);
}
