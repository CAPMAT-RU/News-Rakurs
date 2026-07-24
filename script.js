console.log('Скрипт запустился');

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loader = document.getElementById('loader');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const featuredNewsContainer = document.getElementById('main-news');
    const progressBar = document.getElementById('progress-bar');
    const scrollToTopButton = document.getElementById('scrollToTop');

    let allNewsData = [];
    let currentCategory = 'all';

    // --- 1. ЗАГРУЗКА НОВОСТЕЙ ---
    fetch('news.json')
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            allNewsData = data.items || []; 

            // Показываем главную новость
            if (data.featuredNewsId && allNewsData.length > 0) {
                const featuredNews = allNewsData.find(item => item.id === data.featuredNewsId);
                if (featuredNews) {
                    displayFeaturedNews(featuredNews);
                }
            }

            // Показываем список новостей
            displayNews(allNewsData);

            // Скрываем лоадер
            if (loader) {
                loader.style.display = 'none'; 
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки новостей:', error);
            if (loader) {
                loader.textContent = 'Не удалось загрузить новости. Проверьте консоль.';
                loader.style.display = 'block'; 
            }
        });

    // --- ФУНКЦИИ ОТРИСОВКИ ---

    function displayFeaturedNews(newsItem) {
        if (!featuredNewsContainer) return;
    
        const imgSrc = newsItem.image ? newsItem.image : 'https://via.placeholder.com/600x400?text=Нет+фото';
        // Получаем автора
        const authorText = newsItem.author ? `Автор: ${newsItem.author}` : '';
        const dateText = newsItem.date ? formatDate(newsItem.date) : '';
    
        featuredNewsContainer.style.display = 'block';
        featuredNewsContainer.innerHTML = `
            <div class="featured-news-card">
                <img src="${imgSrc}" alt="${newsItem.title}" class="featured-news-image">
                <div class="featured-news-content">
                    <h2 class="featured-news-title">${newsItem.title}</h2>
                    
                    <!-- БЛОК META: дата слева, автор справа -->
                    ${dateText || authorText ? `
                        <div class="news-meta">
                            ${dateText ? `<span class="meta-date">${dateText}</span>` : ''}
                            ${authorText ? `<span class="meta-author">${authorText}</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <p class="featured-news-description">${newsItem.description}</p>
                    <a href="#" class="read-more-featured" data-id="${newsItem.id}">Читать полностью</a>
                </div>
            </div>
        `;
    
        const readMoreFeatured = featuredNewsContainer.querySelector('.read-more-featured');
        if (readMoreFeatured) {
            readMoreFeatured.addEventListener('click', (e) => {
                e.preventDefault();
                handleReadMoreClick(e.target.getAttribute('data-id'));
            });
        }
    }
    
    function formatDate(dateString) {
        try {
            return new Date(dateString).toLocaleDateString('ru-RU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return dateString; 
        }
    }

    function displayNews(newsArray) {
        if (!newsContainer) return;

        newsContainer.innerHTML = ''; 
        
        if (!newsArray || newsArray.length === 0) {
            newsContainer.innerHTML = '<p style="padding: 20px; color: var(--meta);">Новостей не найдено.</p>';
            return;
        }

        // Словарь для перевода русских категорий в английские (для цветов)
        const categoryMap = {
            'спорт': 'sport',
            'политика': 'politics',
            'экономика': 'economy',
            'технологии': 'tech',
            'культура': 'culture',
            'наука': 'science',
            'мир': 'world',
            'сво': 'svo', 
            'общество': 'society',
            'регионы': 'regions',
            'гос': 'state',
            'геополитика': 'geopolitics',
            'криминал': 'crime',
            'коррупция': 'corruption',
            'стиль': 'style',
            'происшествия': 'incidents',
            'шоу-бизнес': 'showbiz'
        };

        newsArray.forEach(newsItem => {
            // --- ТВОЯ СТАРАЯ ЛОГИКА (ОСТАВЛЯЕМ КАК ЕСТЬ) ---
            const formattedDate = newsItem.date ? formatDate(newsItem.date) : '';
            const authorText = newsItem.author ? `Автор: ${newsItem.author}` : '';
        
            let rawCategory = newsItem.category || '';
            let displayText = rawCategory; 
            
            if (!rawCategory || rawCategory.trim() === '') {
                displayText = 'Разное';
            }
        
            const key = rawCategory.toLowerCase().trim();
            const colorClass = categoryMap[key] || 'other';
            const finalClass = `category-${colorClass}`;
            // -----------------------------------------------
        
            // --- НОВЫЙ HTML ШАБЛОН (ВСТАВЛЯЕМ ВМЕСТО СТАРОГО) ---
            
            // Формируем бейдж категории (используем твой finalClass)
            const categoryBadge = displayText 
                ? `<span class="news-category-badge ${finalClass}">${displayText}</span>` 
                : '';
        
            // Формируем блок мета-данных (дата и автор)
            const metaHtml = (formattedDate || authorText) 
                ? `<div class="news-meta">
                      ${formattedDate ? `<span class="meta-date">${formattedDate}</span>` : ''}
                      ${authorText ? `<span class="meta-author">${authorText}</span>` : ''}
                   </div>` 
                : '';
        
            // Рисуем карточку с новыми классами
            newsContainer.innerHTML += `
                <div class="news-item">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image">
                    <div class="news-content">
                        ${categoryBadge}
                        <h3 class="news-title">${newsItem.title}</h3>
                        ${metaHtml}
                        <p class="news-description">${newsItem.description}</p>
                        <a href="#" class="read-more">Читать далее</a>
                    </div>
                </div>
            `;
        });
        

    // --- ФИЛЬТРАЦИЯ И ПОИСК ---
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.getAttribute('data-category');
                filterNews();
            });
        });
    }

    function filterNews() {
        const filtered = currentCategory === 'all' 
            ? allNewsData 
            : allNewsData.filter(item => (item.category || '').toLowerCase() === currentCategory.toLowerCase());
        displayNews(filtered);
    }

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

    // --- ОБРАБОТКА КЛИКА НА "ЧИТАТЬ ДАЛЕЕ" ---
    function handleReadMoreClick(newsId) {
        const item = allNewsData.find(i => i.id === newsId);
        if (item) {
            window.location.href = `${newsId}.html`;
        } else {
            alert('Новость не найдена в текущем списке данных.');
        }
    }

    if (newsContainer) { 
        newsContainer.addEventListener('click', (event) => {
            const target = event.target.closest('.read-more');
            if (target) {
                event.preventDefault(); 
                handleReadMoreClick(target.getAttribute('data-id'));
            }
        });
    }

    // --- ПРОКРУТКА И ПРОГРЕСС-БАР ---
    window.addEventListener('scroll', () => {
        progressBarScroll();
        
        if (scrollToTopButton) {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        }
    });

    function progressBarScroll() {
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0) {
            progressBar.style.width = ((winScroll / height) * 100) + '%';
        }
    }

    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ---
    const themeToggleBtn = document.querySelector('.theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme'); 
    }
});

// --- СКРОЛЛ КАТЕГОРИЙ КОЛЕСИКОМ МЫШКИ ---
const categoriesPanel = document.querySelector('.categories-panel');

if (categoriesPanel) {
    categoriesPanel.addEventListener('wheel', (event) => {
        if (event.target.closest('.categories-panel')) {
            event.preventDefault();
            
            const scrollAmount = event.deltaY;
            const currentScroll = categoriesPanel.scrollLeft;
            const maxScroll = categoriesPanel.scrollWidth - categoriesPanel.clientWidth;

            let newScroll = currentScroll + scrollAmount;

            if (newScroll >= maxScroll - 10) { 
                newScroll = maxScroll;
            } else if (newScroll <= 10) {
                newScroll = 0;
            }

            categoriesPanel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    });
}

/* --- СЕТКА ДЛЯ ЛЕНТЫ НОВОСТЕЙ --- */
.news-grid {
    display: grid;
    /* Автоматическая сетка: колонки минимум 300px, максимум - делят место поровну */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px; /* Расстояние между карточками */
    padding: 20px 0;
}

/* Сама карточка новости */
.news-item {
    background: var(--bg-secondary, #fff);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
}

.news-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* Картинка внутри карточки */
.news-image {
    width: 100%;
    height: 220px; /* Стандартная высота (для узких карточек) */
    object-fit: cover; /* Чтобы картинка не сплющивалась */
    display: block;
}

/* --- ЧЕРЕДОВАНИЕ: 2-я КАРТОЧКА ШИРОКАЯ --- */
/* Если у тебя есть возможность добавить класс wide ко второй карточке через JS - используй .news-item.wide */
/* Но если нет, используем nth-child для автоматического чередования */

.news-item:nth-child(2n) {
    grid-column: span 2; /* Занимает 2 колонки */
}

/* Для широких карточек увеличиваем высоту картинки */
.news-item:nth-child(2n) .news-image {
    height: 300px;
}

/* Адаптив: на мобильных всегда 1 колонка */
@media (max-width: 768px) {
    .news-grid {
        grid-template-columns: 1fr;
    }
    
    .news-item:nth-child(2n) {
        grid-column: 1; /* На мобильном отменяем "широкость" */
    }
    
    .news-item:nth-child(2n) .news-image {
        height: 220px; /* Возвращаем стандартную высоту */
    }
}
