document.addEventListener('DOMContentLoaded', () => {
    // ... (ваш существующий код)

    const categoriesContainer = document.querySelector('.categories-container'); // Контейнер для кнопок категорий
    const categoriesInner = document.querySelector('.categories'); // Внутренний контейнер, который будет прокручиваться

    let isDragging = false;
    let startX;
    let scrollLeft;

    // Проверяем, существуют ли элементы, прежде чем добавлять слушателей
    if (categoriesContainer && categoriesInner) {
        // Событие при нажатии мыши на внешний контейнер
        categoriesContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            categoriesContainer.classList.add('active'); // Для визуальной обратной связи (если нужно)
            startX = e.pageX - categoriesContainer.offsetLeft;
            scrollLeft = categoriesInner.scrollLeft;
        });

        // Событие при выходе мыши из внешнего контейнера
        categoriesContainer.addEventListener('mouseleave', () => {
            isDragging = false;
            categoriesContainer.classList.remove('active');
        });

        // Событие при отпускании мыши
        categoriesContainer.addEventListener('mouseup', () => {
            isDragging = false;
            categoriesContainer.classList.remove('active');
        });

        // Событие при движении мыши (только если isDragging = true)
        categoriesContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Предотвращаем выделение текста
            const x = e.pageX - categoriesContainer.offsetLeft;
            const walk = (x - startX) * 1.5; // *1.5 - скорость прокрутки (можно настроить)
            categoriesInner.scrollLeft = scrollLeft - walk;
        });

        // Событие при прокрутке колесиком мыши
        categoriesContainer.addEventListener('wheel', (e) => {
            e.preventDefault(); // Отключаем стандартную прокрутку страницы
            categoriesInner.scrollLeft += e.deltaY; // Прокрутка в зависимости от направления колесика
        });
    }

    // ... (остальной ваш код)
});
