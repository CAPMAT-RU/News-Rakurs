console.log('Скрипт новостей запущен');

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loader = document.getElementById('loader');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const featuredNewsContainer = document.getElementById('main-news');
    const progressBar = document.getElementById('progress-bar');
    const scrollToTopButton = document.getElementById('scrollToTop');

    // --- НАСТРОЙКА НОВОСТЕЙ (Только ссылки, без контента) ---
    // Здесь мы просто перечисляем, какой файл открывать для каждой новости.
    // Контент (заголовки, картинки) уже лежит ВНУТРИ файлов news-1.html, news-2.html и т.д.
    const allNewsData = [
        { id: 1, title: 'Топливный Шок: Все Пойдет по Набиуллиной', category: 'Экономика', link: 'news-1.html', image: 'images/5411529171307010672_120.jpg', description: 'Краткое описание для карточки' },
        { id: 2, title: 'Скандал в правительстве: кто виноват?', category: 'Политика', link: 'news-2.html', image: 'images/news2.jpg', description: 'Краткое описание для карточки' },
        { id: 3, title: 'Новый прорыв в науке', category: 'Наука', link: 'news-3.html', image: 'images/news3.jpg', description: 'Краткое описание для карточки' }
        // Сюда добавляй только ID, Title, Category, Link и Image для превью.
        // Весь текст статьи остается в news-X.html
    ];

    let currentCategory = 'all';

    function normalizeCategory(cat) {
        if (!cat) return 'other';
        let key = cat.toLowerCase().trim();
        if (['государство', 'гос'].includes(key)) return 'государство';
        if (['сво'].includes(key)) return 'сво';
        if (['общество'].includes(key)) return 'общество';
        if (['регионы'].includes(key)) return 'регионы';
        if (['происшествия', 'чп'].includes(key)) return 'происшествия';
        if (['криминал'].includes(key)) return 'криминал';
        if (['политика'].includes(key)) return 'политика';
        if (['геополитика'].includes(key)) return 'геополитика';
        if (['коррупция'].includes(key)) return 'коррупция';
        if (['шоу-бизнес', 'шоу бизнес'].includes(key)) return 'шоу-бизнес';
        if (['спорт'].includes(key)) return 'спорт';
        if (['наука'].includes(key)) return 'наука';
        if (['стиль', 'мода'].includes(key)) return 'стиль';
        if (['культура'].includes(key)) return 'культура';
        if (['экономика'].includes(key)) return 'экономика';
        if (['технологии', 'it', 'tech'].includes(key)) return 'технологии';
        if (['мир', 'международное'].includes(key)) return 'мир';
        return 'other';
    }

    function displayFeaturedNews(newsItem) {
        if (!featuredNewsContainer) return;
        const imgSrc = newsItem.image || 'https://via.placeholder.com/600x400?text=Нет+фото';
        featuredNewsContainer.innerHTML = `
            <div class="featured-news-card">
                <img src="${imgSrc}" alt="${newsItem.title}" class="featured-news-image">
                <div class="featured-news-content">
                    <h2 class="featured-news-title">${newsItem.title}</h2>
                    <p class="featured-news-description">${newsItem.description || ''}</p>
                    <a href="${newsItem.link}" class="read-more-featured">Читать полностью</a>
                </div>
            </div>
        `;
    }

    function displayNews(newsArray) {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';

        if (!newsArray || newsArray.length === 0) {
            newsContainer.innerHTML = '<p style="padding: 20px; color: var(--meta); text-align: center;">Новостей не найдено</p>';
            return;
        }

        newsArray.forEach(newsItem => {
            const key = normalizeCategory(newsItem.category);
            const displayText = newsItem.category || 'Разное';
            const finalClass = `category-${key}`;
            const categoryBadge = `<span class="news-category-badge ${finalClass}">${displayText}</span>`;

            const imgSrc = newsItem.image || 'https://via.placeholder.com/300x220?text=Нет+фото';

            newsContainer.innerHTML += `
                <div class="news-item">
                    <img src="${imgSrc}" alt="${newsItem.title}" class="news-image">
                    <div class="news-content">
                        ${categoryBadge}
                        <h3 class="news-title">${newsItem.title}</h3>
                        <p class="news-description">${newsItem.description || ''}</p>
                        <!-- Ссылка ведет прямо на твой готовый файл news-X.html -->
                        <a href="${newsItem.link}" class="read-more">Читать далее</a>
                    </div>
                </div>
            `;
        });
    }

    // Инициализация
    displayNews(allNewsData);
    if (loader) loader.style.display = 'none';

    if (featuredNewsContainer && allNewsData.length > 0) {
        displayFeaturedNews(allNewsData[0]);
    }

    // Фильтры
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.getAttribute('data-category') || 'all';
                filterNews();
            });
        });
    }

    function filterNews() {
        const filtered = currentCategory === 'all' 
            ? allNewsData 
            : allNewsData.filter(item => normalizeCategory(item.category) === normalizeCategory(currentCategory));
        displayNews(filtered);
    }

    // Поиск
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length > 1) {
                const filtered = allNewsData.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    (item.description || '').toLowerCase().includes(query)
                );
                displayNews(filtered);
            } else if (query.length === 0) {
                filterNews(); 
            }
        });
    }

    // Скролл бар и кнопка вверх
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) progressBar.style.width = ((winScroll / height) * 100) + '%';
        }
        if (scrollToTopButton) scrollToTopButton.classList.toggle('hidden', window.scrollY <= 300);
    });

    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Тема
    const themeToggleBtn = document.querySelector('.theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
});
