/**
 * =============================================================================
 * SOMELIA — Скрипт ініціалізації зовнішніх динамічних JS-бібліотек
 * Лабораторна робота №10: Інтеграція динамічних медіакомпонентів та JS-бібліотек
 * Архітектура: Vanilla JS (без jQuery), запуск після настання події DOMContentLoaded
 * Бібліотеки: Swiper.js v11, Fancybox v5, Typed.js
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('🍷 [SOMELIA Plugins]: Ініціалізація зовнішніх медіакомпонентів...');

  // ===========================================================================
  // 1. ІНІЦІАЛІЗАЦІЯ TYPED.JS (Динамічний ефект друку слоганів у Hero)
  // ===========================================================================
  const typedTarget = document.getElementById('typed-somelia');
  if (typedTarget && typeof Typed !== 'undefined') {
    new Typed('#typed-somelia', {
      strings: [
        'крафтових сирів та шляхетного вина.',
        'ідеальних дегустаційних пар.',
        'українських локальних теруарів.',
        'вишуканого гастрономічного задоволення.'
      ],
      typeSpeed: 55,       // Швидкість друку символу (мс)
      backSpeed: 30,       // Швидкість стирання символу (мс)
      backDelay: 2000,     // Затримка перед стиранням (мс)
      startDelay: 400,     // Затримка перед стартом першого циклу
      loop: true,          // Нескінченне зациклення ефекту
      showCursor: true,    // Відображення мерехтливого курсора
      cursorChar: '🍷'     // Тематичний символ курсора замість стандартної палички
    });
    console.log('✅ [SOMELIA]: Typed.js успішно ініціалізовано');
  }

  // ===========================================================================
  // 2. ІНІЦІАЛІЗАЦІЯ FANCYBOX V5 (Преміальна модальна галерея)
  // ===========================================================================
  if (typeof Fancybox !== 'undefined') {
    // Зв'язування з дата-атрибутом data-fancybox="somelia-gallery"
    Fancybox.bind('[data-fancybox="somelia-gallery"]', {
      // Ефект переходу між фотографіями
      Carousel: {
        transition: 'fade',
        friction: 0.8
      },
      // Налаштування масштабування зображень (Panzoom)
      Images: {
        zoom: true,
        Panzoom: {
          maxScale: 3 // Максимальний 3-кратний зум для деталізації винних етикеток та сирів
        }
      },
      // Верхня панель інструментів модального вікна
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW'],
          right: ['slideshow', 'thumbs', 'close']
        }
      },
      // Анімація відкриття та закриття
      showClass: 'fancybox-fadeIn',
      hideClass: 'fancybox-fadeOut'
    });
    console.log('✅ [SOMELIA]: Fancybox v5 успішно зв\'язано з галереєю');
  }

  // ===========================================================================
  // 3. ІНІЦІАЛІЗАЦІЯ SWIPER.JS V11 (Сенсорний слайдер відгуків сомельє)
  // ===========================================================================
  const swiperTarget = document.querySelector('.reviews-swiper');
  if (swiperTarget && typeof Swiper !== 'undefined') {
    const reviewsSwiper = new Swiper('.reviews-swiper', {
      // Базові інженерні параметри
      loop: true,                 // Нескінченна кругова карусель
      speed: 700,                 // Швидкість переходу між слайдами (мс)
      spaceBetween: 25,           // Відступ між картками відгуків (px)
      grabCursor: true,           // Вигляд курсору у вигляді «долоньки» для свайпу
      
      // Автоматичне прогортання з інженерним стандартом зупинки
      autoplay: {
        delay: 3500,              // Час демонстрації одного слайда (3.5 секунди)
        disableOnInteraction: false, // Не вимикати автоплей після ручного свайпу
        pauseOnMouseEnter: true   // Зупинка автоплею при наведенні курсору (UX Best Practice)
      },

      // Пагінація (крапки внизу)
      pagination: {
        el: '.swiper-pagination',
        clickable: true,          // Можливість переходу по кліку на крапку
        dynamicBullets: true      // Динамічне зменшення крапок для красивого відображення
      },

      // Навігаційні кнопки-стрілки
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },

      // Адаптивні брейкпоінти (Mobile First підхід)
      breakpoints: {
        // Смартфони (від 320px) — 1 слайд
        320: {
          slidesPerView: 1,
          spaceBetween: 16
        },
        // Планшети (від 768px) — 2 слайди одночасно
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        // Десктопи та ноутбуки (від 1024px) — 3 слайди одночасно
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
    console.log('✅ [SOMELIA]: Swiper v11 успішно ініціалізовано');
  }
});
