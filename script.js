console.log('Скрипт новостей запущен');

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loader = document.getElementById('loader');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const featuredNewsContainer = document.getElementById('main-news');
    const progressBar = document.getElementById('progress-bar');
    const scrollToTopButton = document.getElementById('scrollToTop');

    // ✅ Массив новостей (статический, без fetch)
    const allNewsData = [
        { 
            id: 1, 
            title: 'Топливный Шок: Все Пойдет по Набиуллиной', 
            category: 'Экономика', 
            image: 'images/5411529171307010672_120.jpg', 
            link: 'news-1.html',
            description: 'Ну что, дорогие мои, держитесь! Наша любимая Эльвира Сахипзадовна...'
        },
        { 
            id: 2, 
            title: 'Скандал в правительстве: кто виноват?', 
            category: 'Политика', 
            image: 'images/news2.jpg', 
            link: 'news-2.html',
            description: 'Крупный скандал разгорелся вокруг министерства...'
        },
        { 
            id: 3, 
            title: 'Новый прорыв в науке', 
            category: 'Наука', 
            image: 'images/news3.jpg',
            link: 'news-3.html',
            description: 'Ученые совершили открытие, которое изменит мир...'
        }
        // Сюда добавляй остальные новости
    ];

    let currentCategory = 'all';

    function formatDate(dateString) {
        try {
            return new Date(dateString).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }

    function displayFeaturedNews(newsItem) {
        if (!featuredNewsContainer) return;

        const imgSrc = newsItem.image || 'https://via.placeholder.com/600x400?text=Нет+фото';
        const authorText = newsItem.author ? `Автор: ${newsItem.author}` : '';
        const dateText = newsItem.date ? formatDate(newsItem.date) : '';

        featuredNewsContainer.innerHTML = `
            <div class="featured-news-card">
                <img src="${imgSrc}" alt="${newsItem.title}" class="featured-news-image">
                <div class="featured-news-content">
                    <h2 class="featured-news-title">${newsItem.title}</h2>
                    ${dateText || authorText ? `
                        <div class="news-meta featured-meta">
                            ${dateText ? `<span class="meta-date">${dateText}</span>` : ''}
                            ${authorText ? `<span class="meta-author">${authorText}</span>` : ''}
                        </div>
                    ` : ''}
                    <p class="featured-news-description">${newsItem.description || ''}</p>
                    <!-- Ссылка ведет сразу на файл -->
                    <a href="${newsItem.link}" class="read-more-featured">Читать полностью</a>
                </div>
            </div>
        `;
    }

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

            const formattedDate = newsItem.date ? formatDate(newsItem.date) : '';
            const authorText = newsItem.author ? `Автор: ${newsItem.author}` : '';
            
            const metaHtml = (formattedDate || authorText) 
                ? `<div class="news-meta">
                      ${formattedDate ? `<span class="meta-date">${formattedDate}</span>` : ''}
                      ${authorText ? `<span class="meta-author">${authorText}</span>` : ''}
                   </div>` 
                : '';

            const imgSrc = newsItem.image || 'https://via.placeholder.com/300x220?text=Нет+фото';

            // ВАЖНО: ссылка теперь берется из поля link (news-X.html)
            newsContainer.innerHTML += `
                <div class="news-item">
                    <img src="${imgSrc}" alt="${newsItem.title}" class="news-image">
                    <div class="news-content">
                        ${categoryBadge}
                        <h3 class="news-title">${newsItem.title}</h3>
                        ${metaHtml}
                        <p class="news-description">${newsItem.description || ''}</p>
                        <a href="${newsItem.link}" class="read-more">Читать далее</a>
                    </div>
                </div>
            `;
        });
    }

    // --- Инициализация ---
    
    // Если есть featuredNewsId в данных (опционально), можно показать главную новость
    // Сейчас просто показываем все новости
    displayNews(allNewsData);

    if (loader) loader.style.display = 'none';

    // --- ФИЛЬТРАЦИЯ ---

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
            : allNewsData.filter(item => {
                const itemCat = normalizeCategory(item.category);
                const filterCat = normalizeCategory(currentCategory);
                return itemCat === filterCat;
            });
        displayNews(filtered);
    }

    // --- ПОИСК ---

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

    // --- ПРОГРЕСС-БАР И КНОПКА "НАВЕРХ" ---

    window.addEventListener('scroll', () => {
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                progressBar.style.width = ((winScroll / height) * 100) + '%';
            }
        }

        if (scrollToTopButton) {
            scrollToTopButton.classList.toggle('hidden', window.scrollY <= 300);
        }
    });

    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- ТЕМА (СВЕТЛАЯ/ТЕМНАЯ) ---
    const themeToggleBtn = document.querySelector('.theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});
