/**
 * =============================================================================
 * SOMELIA — Інтерактивний калькулятор-конфігуратор дегустаційного сету
 * Лабораторна робота №11: Розробка інтерактивних віджетів та обробка Edge Cases
 * Архітектура: Vanilla JavaScript (ES6+), Defensive Programming, Fail-Safe
 * =============================================================================
 */

(function initTastingCalculatorWidget() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('🧀🍷 [SOMELIA QA Widget]: Ініціалізація калькулятора дегустації...');

    // 1. Безпечне отримання посилань на DOM-елементи (Safe Querying)
    const guestsInput = document.getElementById('guests-count');
    const formatSelect = document.getElementById('tasting-format');
    const optSommelier = document.getElementById('opt-sommelier');
    const optOakBox = document.getElementById('opt-oak-box');
    const optDelivery = document.getElementById('opt-delivery');

    const totalPriceEl = document.getElementById('total-price');
    const perGuestPriceEl = document.getElementById('per-guest-price');
    const cheeseWeightEl = document.getElementById('calc-cheese-weight');
    const wineBottlesEl = document.getElementById('calc-wine-bottles');
    const guestsErrorEl = document.getElementById('guests-error');
    const orderBtn = document.getElementById('order-tasting-btn');

    // Перевірка наявності критичних елементів (Fail-Safe: запобігання TypeError)
    if (!guestsInput || !formatSelect || !totalPriceEl || !guestsErrorEl) {
      console.warn('⚠️ [SOMELIA QA]: Елементи віджета не знайдено на сторінці. Вихід.');
      return;
    }

    // Константи бізнес-правил
    const MIN_GUESTS = 1;
    const MAX_GUESTS = 50;
    const CHEESE_PER_GUEST_GRAMS = 150;
    const WINE_PER_GUEST_BOTTLES = 0.5;

    const EXTRA_PRICES = {
      sommelier: 1500,
      oakBox: 600,
      delivery: 250
    };

    /**
     * Відображення помилки валідації (Error UI State)
     */
    function showInputError(message) {
      guestsErrorEl.textContent = message;
      guestsErrorEl.classList.remove('hidden');
      guestsInput.classList.remove('border-stone-300', 'focus:ring-amber-600', 'focus:border-amber-600');
      guestsInput.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500', 'bg-red-50/40');
      guestsInput.setAttribute('aria-invalid', 'true');

      // Блокування підсумку та кнопки замовлення (Fail-Safe)
      totalPriceEl.textContent = '—';
      if (perGuestPriceEl) perGuestPriceEl.textContent = '—';
      if (cheeseWeightEl) cheeseWeightEl.textContent = '—';
      if (wineBottlesEl) wineBottlesEl.textContent = '—';
      if (orderBtn) {
        orderBtn.disabled = true;
        orderBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }

    /**
     * Очищення стану помилки (Normal UI State)
     */
    function clearInputError() {
      guestsErrorEl.textContent = '';
      guestsErrorEl.classList.add('hidden');
      guestsInput.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500', 'bg-red-50/40');
      guestsInput.classList.add('border-stone-300', 'focus:ring-amber-600', 'focus:border-amber-600');
      guestsInput.setAttribute('aria-invalid', 'false');

      if (orderBtn) {
        orderBtn.disabled = false;
        orderBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    /**
     * Головна функція обчислення з повною обробкою Edge Cases (Defensive Programming)
     */
    function calculateTastingTotal() {
      const rawValue = guestsInput.value;

      // =========================================================================
      // ОБРОБКА EDGE CASES (СТРЕС-ТЕСТУВАННЯ ВХІДНИХ ДАНИХ)
      // =========================================================================

      // Edge Case 1: Порожнє поле вводу
      if (rawValue === null || rawValue.trim() === '') {
        showInputError('Введіть кількість гостей (від 1 до 50 осіб).');
        return;
      }

      const parsedFloat = parseFloat(rawValue);

      // Edge Case 2: NaN або некоректні нечислові значення
      if (Number.isNaN(parsedFloat) || !Number.isFinite(parsedFloat)) {
        showInputError('Некоректне значення. Введіть число від 1 до 50.');
        return;
      }

      // Edge Case 3: Дробове число (наприклад, 2.5 або 4.8) -> нормалізація
      if (!Number.isInteger(parsedFloat)) {
        const rounded = Math.round(parsedFloat);
        console.warn(`[QA Warning]: Дробове число ${parsedFloat} нормалізовано до ${rounded}`);
        guestsInput.value = rounded;
        // Рекурсивно викликаємо розрахунок для округленого числа
        calculateTastingTotal();
        return;
      }

      const guests = parsedFloat;

      // Edge Case 4: Від'ємне значення (наприклад: -5)
      if (guests < 0) {
        showInputError('Кількість гостей не може бути від\'ємною. Допустимо: 1–50.');
        return;
      }

      // Edge Case 5: Нуль (0)
      if (guests === 0) {
        showInputError('Мінімальна кількість гостей для замовлення — 1 особа.');
        return;
      }

      // Edge Case 6: Аномально великі числа (> 50, e.g. 9999999)
      if (guests > MAX_GUESTS) {
        showInputError(`Максимум ${MAX_GUESTS} гостей для онлайн-калькулятора. Для великих банкетів замовте консультацію.`);
        return;
      }

      // =========================================================================
      // БІЗНЕС-ЛОГІКА ТА ОБЧИСЛЕННЯ (HAPPY PATH)
      // =========================================================================
      clearInputError();

      // Отримання вартості формату дегустації (з захистом від невірних опцій)
      const formatPricePerGuest = parseFloat(formatSelect.value) || 590;

      // Додаткові опції
      let extrasTotal = 0;
      if (optSommelier && optSommelier.checked) extrasTotal += EXTRA_PRICES.sommelier;
      if (optOakBox && optOakBox.checked) extrasTotal += EXTRA_PRICES.oakBox;
      if (optDelivery && optDelivery.checked) extrasTotal += EXTRA_PRICES.delivery;

      // Підсумковий розрахунок
      const totalAmount = Math.round((guests * formatPricePerGuest) + extrasTotal);
      const perGuestAmount = Math.round(totalAmount / guests);

      // Розрахунок гастрономічних норм продуктів
      const totalCheeseGrams = guests * CHEESE_PER_GUEST_GRAMS;
      const totalWineBottles = Math.ceil(guests * WINE_PER_GUEST_BOTTLES);

      // Безпечне виведення результатів через textContent (XSS Protection)
      const formatter = new Intl.NumberFormat('uk-UA');
      totalPriceEl.textContent = formatter.format(totalAmount);

      if (perGuestPriceEl) {
        perGuestPriceEl.textContent = formatter.format(perGuestAmount);
      }

      if (cheeseWeightEl) {
        if (totalCheeseGrams >= 1000) {
          cheeseWeightEl.textContent = `${(totalCheeseGrams / 1000).toFixed(1)} кг (${CHEESE_PER_GUEST_GRAMS} г/ос.)`;
        } else {
          cheeseWeightEl.textContent = `${totalCheeseGrams} г (${CHEESE_PER_GUEST_GRAMS} г/ос.)`;
        }
      }

      if (wineBottlesEl) {
        const bottleWord = (totalWineBottles === 1) ? 'пляшка' : (totalWineBottles < 5 ? 'пляшки' : 'пляшок');
        wineBottlesEl.textContent = `${totalWineBottles} ${bottleWord} (~0.5 пл./ос.)`;
      }

      console.log(`📊 [SOMELIA QA Log]: Розраховано: гостей=${guests}, формат=${formatPricePerGuest} грн, допи=${extrasTotal} грн, сума=${totalAmount} грн`);
    }

    // 2. Додавання слухачів подій (Events: input та change для миттєвого перерахунку)
    guestsInput.addEventListener('input', calculateTastingTotal);
    guestsInput.addEventListener('change', calculateTastingTotal);
    formatSelect.addEventListener('change', calculateTastingTotal);

    if (optSommelier) optSommelier.addEventListener('change', calculateTastingTotal);
    if (optOakBox) optOakBox.addEventListener('change', calculateTastingTotal);
    if (optDelivery) optDelivery.addEventListener('change', calculateTastingTotal);

    // Кнопка замовлення дегустаційного сету
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        if (orderBtn.disabled) return;
        const total = totalPriceEl.textContent;
        const guests = guestsInput.value;
        alert(`🍷 Дякуємо за вибір SOMELIA!\n\nДегустаційний сет для ${guests} гостей успішно сформовано.\nЗагальна вартість: ${total} грн.\n\nНаш сомельє зв'яжеться з вами для уточнення деталей.`);
      });
    }

    // Первинний розрахунок при завантаженні (Happy Path за замовчуванням)
    calculateTastingTotal();
  });
})();
