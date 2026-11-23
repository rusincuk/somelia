/**
 * =============================================================================
 * SOMELIA — Модуль клієнтської валідації та інтерактивних станів форми
 * Лабораторна робота №9: Адаптивні форми зворотного зв'язку та клієнтська валідація
 * Стек: Vanilla JavaScript (ES6+), RegEx, Tailwind CSS UI-стани, A11y (ARIA)
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Отримання посилань на елементи форми
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const topicSelect = document.getElementById('topic');
  const messageInput = document.getElementById('message');
  const agreementInput = document.getElementById('agreement');
  const submitBtn = document.getElementById('submitBtn');
  const messageCounter = document.getElementById('messageCounter');

  // Елементи повідомлень про помилки
  const usernameError = document.getElementById('usernameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');
  const agreementError = document.getElementById('agreementError');

  // Елементи іконок стану
  const usernameIcon = document.getElementById('usernameStatusIcon');
  const emailIcon = document.getElementById('emailStatusIcon');
  const phoneIcon = document.getElementById('phoneStatusIcon');
  const messageIcon = document.getElementById('messageStatusIcon');

  // Елементи доступного модального вікна
  const modal = document.getElementById('successModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseIconBtn = document.getElementById('modalCloseIconBtn');
  const summaryName = document.getElementById('summaryName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryPhone = document.getElementById('summaryPhone');
  const summaryTopic = document.getElementById('summaryTopic');

  // =============================================================================
  // 2. Регулярні вирази (RegEx) та константи валідації
  // =============================================================================

  /**
   * REGEX_NAME:
   * Підтримує українські (включаючи і, ї, є, ґ) та латинські літери, апострофи, дефіси та пробіли.
   * Довжина: від 2 до 50 символів.
   * Забороняє цифри та спеціальні технічні символи (<, >, $, %, тощо).
   */
  const REGEX_NAME = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'’\s\-]{2,50}$/;

  /**
   * REGEX_EMAIL:
   * Відповідає сучасному стандарту перевірки адреси електронної пошти:
   * локальна частина @ доменне ім'я . доменна зона (мінімум 2 літери).
   */
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * REGEX_PHONE:
   * Суворий український національний стандарт зв'язку:
   * Починається з префіксу країни +380, після якого йде рівно 9 десяткових цифр (код оператора + номер).
   * Загальна довжина: 13 символів (+380XXXXXXXXX).
   */
  const REGEX_PHONE = /^\+380\d{9}$/;

  /**
   * Мінімальна кількість символів для повідомлення
   */
  const MIN_MESSAGE_LENGTH = 10;

  // Відстеження полів, з якими користувач уже взаємодіяв (UX: don't shout before touch)
  const touchedFields = new Set();

  // =============================================================================
  // 3. Допоміжні функції керування UI-станами (Tailwind CSS + ARIA)
  // =============================================================================

  /**
   * Відобразити стан помилки (Error State)
   */
  function showError(input, errorEl, message, iconEl) {
    if (!input || !errorEl) return;

    // Скидаємо нейтральні та успішні класи
    input.classList.remove('border-stone-300', 'border-emerald-500', 'focus:ring-amber-600', 'focus:border-amber-600', 'focus:ring-emerald-500', 'focus:border-emerald-500');
    // Додаємо класи помилки
    input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

    // Текст помилки та ARIA
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    input.setAttribute('aria-invalid', 'true');

    // Іконка статусу
    if (iconEl) {
      iconEl.innerHTML = '<span class="text-red-500 font-bold">✕</span>';
      iconEl.classList.remove('hidden');
    }
  }

  /**
   * Відобразити стан успіху (Success State)
   */
  function showSuccess(input, errorEl, iconEl) {
    if (!input) return;

    // Скидаємо нейтральні та помилкові класи
    input.classList.remove('border-stone-300', 'border-red-500', 'focus:ring-amber-600', 'focus:border-amber-600', 'focus:ring-red-500', 'focus:border-red-500');
    // Додаємо класи успіху
    input.classList.add('border-emerald-500', 'focus:ring-emerald-500', 'focus:border-emerald-500');

    // Приховуємо помилку та оновлюємо ARIA
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    input.setAttribute('aria-invalid', 'false');

    // Іконка статусу
    if (iconEl) {
      iconEl.innerHTML = '<span class="text-emerald-600 font-bold">✓</span>';
      iconEl.classList.remove('hidden');
    }
  }

  /**
   * Очистити стан поля до початкового (Normal State)
   */
  function clearStatus(input, errorEl, iconEl) {
    if (!input) return;

    input.classList.remove('border-red-500', 'border-emerald-500', 'focus:ring-red-500', 'focus:border-red-500', 'focus:ring-emerald-500', 'focus:border-emerald-500');
    input.classList.add('border-stone-300', 'focus:ring-amber-600', 'focus:border-amber-600');

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    input.setAttribute('aria-invalid', 'false');

    if (iconEl) {
      iconEl.textContent = '';
      iconEl.classList.add('hidden');
    }
  }

  // =============================================================================
  // 4. Окремі функції валідації для кожного поля форми
  // =============================================================================

  /**
   * Валідація поля "Ім'я"
   */
  function validateName() {
    const value = usernameInput.value.trim();

    if (!value) {
      showError(usernameInput, usernameError, 'Введіть ваше ім\'я (поле не може бути порожнім)', usernameIcon);
      return false;
    }

    if (value.length < 2) {
      showError(usernameInput, usernameError, 'Ім\'я занадто коротке (мінімум 2 символи)', usernameIcon);
      return false;
    }

    if (!REGEX_NAME.test(value)) {
      showError(usernameInput, usernameError, 'Ім\'я може містити лише літери, пробіли або дефіс (без цифр)', usernameIcon);
      return false;
    }

    showSuccess(usernameInput, usernameError, usernameIcon);
    return true;
  }

  /**
   * Валідація поля "Електронна пошта"
   */
  function validateEmail() {
    const value = emailInput.value.trim();

    if (!value) {
      showError(emailInput, emailError, 'Введіть електронну пошту', emailIcon);
      return false;
    }

    if (!REGEX_EMAIL.test(value)) {
      showError(emailInput, emailError, 'Введіть коректний email у форматі name@example.com', emailIcon);
      return false;
    }

    showSuccess(emailInput, emailError, emailIcon);
    return true;
  }

  /**
   * Валідація поля "Номер телефону" з врахуванням Edge Cases
   */
  function validatePhone() {
    let value = phoneInput.value.trim();

    if (!value) {
      showError(phoneInput, phoneError, 'Введіть номер телефону', phoneIcon);
      return false;
    }

    // Перевірка суворим RegEx
    if (!REGEX_PHONE.test(value)) {
      if (value.startsWith('0')) {
        showError(phoneInput, phoneError, 'Номер повинен починатися з міжнародного коду +380 (наприклад: +380501234567)', phoneIcon);
      } else if (!value.startsWith('+380')) {
        showError(phoneInput, phoneError, 'Невірний префікс. Номер повинен починатися з +380', phoneIcon);
      } else if (value.length < 13) {
        showError(phoneInput, phoneError, `Недостатньо цифр (${value.length - 4} з 9 після +380)`, phoneIcon);
      } else if (value.length > 13) {
        showError(phoneInput, phoneError, `Забагато цифр (${value.length - 4} замість 9 після +380)`, phoneIcon);
      } else {
        showError(phoneInput, phoneError, 'Номер містить неприпустимі символи. Формат: +380XXXXXXXXX', phoneIcon);
      }
      return false;
    }

    showSuccess(phoneInput, phoneError, phoneIcon);
    return true;
  }

  /**
   * Автоматичне інтелектуальне форматування номера телефону (UX Edge Cases Handler)
   * Якщо користувач вставляє або вводить "050...", "380...", або номер з пробілами/дужками
   */
  function handlePhoneInput() {
    let raw = phoneInput.value;

    // Якщо користувач очистив поле
    if (!raw) {
      if (touchedFields.has('phone')) validatePhone();
      return;
    }

    // Якщо користувач почав вводити з 0 (наприклад, 0501234567) -> автодоповнюємо до +380
    if (raw.startsWith('0') && raw.length <= 10) {
      // Автопідстановка міжнародного коду України
      phoneInput.value = '+38' + raw;
      raw = phoneInput.value;
    } else if (raw.startsWith('380') && !raw.startsWith('+')) {
      phoneInput.value = '+' + raw;
      raw = phoneInput.value;
    }

    // Видаляємо пробіли, дужки, дефіси під час вставки
    if (/[\s\(\)\-]/.test(raw)) {
      phoneInput.value = raw.replace(/[\s\(\)\-]/g, '');
    }

    // Обмежуємо довжину максимум 13 символів (+380XXXXXXXXX)
    if (phoneInput.value.length > 13) {
      phoneInput.value = phoneInput.value.slice(0, 13);
    }

    if (touchedFields.has('phone')) {
      validatePhone();
    }
  }

  /**
   * Валідація поля "Повідомлення" та оновлення лічильника
   */
  function validateMessage() {
    const value = messageInput.value.trim();
    const length = value.length;

    // Оновлення візуального лічильника символів
    if (messageCounter) {
      messageCounter.textContent = `${length} / ${MIN_MESSAGE_LENGTH} символів`;
      if (length >= MIN_MESSAGE_LENGTH) {
        messageCounter.classList.remove('text-stone-500', 'text-red-500');
        messageCounter.classList.add('text-emerald-600', 'font-semibold');
      } else {
        messageCounter.classList.remove('text-emerald-600', 'font-semibold');
        messageCounter.classList.add('text-stone-500');
      }
    }

    if (!value) {
      showError(messageInput, messageError, 'Введіть текст вашого повідомлення', messageIcon);
      return false;
    }

    if (length < MIN_MESSAGE_LENGTH) {
      showError(messageInput, messageError, `Повідомлення занадто коротке (ще мінімум ${MIN_MESSAGE_LENGTH - length} симв.)`, messageIcon);
      return false;
    }

    showSuccess(messageInput, messageError, messageIcon);
    return true;
  }

  /**
   * Валідація чекбоксу "Згода з політикою конфіденційності"
   */
  function validateAgreement() {
    if (!agreementInput.checked) {
      agreementError.textContent = 'Необхідно надати згоду на обробку персональних даних для надсилання';
      agreementError.classList.remove('hidden');
      agreementInput.setAttribute('aria-invalid', 'true');
      agreementInput.classList.add('ring-2', 'ring-red-500');
      return false;
    }

    agreementError.textContent = '';
    agreementError.classList.add('hidden');
    agreementInput.setAttribute('aria-invalid', 'false');
    agreementInput.classList.remove('ring-2', 'ring-red-500');
    return true;
  }

  // =============================================================================
  // 5. Динамічна валідація (Events: blur, input, change)
  // =============================================================================

  // Ім'я
  usernameInput.addEventListener('blur', () => {
    touchedFields.add('username');
    validateName();
  });
  usernameInput.addEventListener('input', () => {
    if (touchedFields.has('username')) validateName();
  });

  // Email
  emailInput.addEventListener('blur', () => {
    touchedFields.add('email');
    validateEmail();
  });
  emailInput.addEventListener('input', () => {
    if (touchedFields.has('email')) validateEmail();
  });

  // Телефон
  phoneInput.addEventListener('blur', () => {
    touchedFields.add('phone');
    validatePhone();
  });
  phoneInput.addEventListener('input', handlePhoneInput);

  // Повідомлення
  messageInput.addEventListener('blur', () => {
    touchedFields.add('message');
    validateMessage();
  });
  messageInput.addEventListener('input', () => {
    validateMessage();
  });

  // Чекбокс згоди
  agreementInput.addEventListener('change', () => {
    touchedFields.add('agreement');
    validateAgreement();
  });

  // =============================================================================
  // 6. Керування доступним модальним вікном (Accessible Modal Dialog)
  // =============================================================================

  let lastActiveElement = null;

  function openSuccessModal(formData) {
    if (!modal) return;

    // Запам'ятовуємо елемент, який мав фокус перед відкриттям вікна (для A11y)
    lastActiveElement = document.activeElement;

    // Заповнюємо підсумкові дані
    if (summaryName) summaryName.textContent = formData.name;
    if (summaryEmail) summaryEmail.textContent = formData.email;
    if (summaryPhone) summaryPhone.textContent = formData.phone;
    if (summaryTopic) summaryTopic.textContent = formData.topicText;

    // Показуємо модальне вікно
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // блокування прокрутки сторінки

    // Фокусуємо кнопку закриття для зручної клавіатурної навігації
    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);

    // Додаємо слухач закриття на Escape
    document.addEventListener('keydown', handleModalKeyDown);
  }

  function closeSuccessModal() {
    if (!modal) return;

    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    // Видаляємо слухач Escape
    document.removeEventListener('keydown', handleModalKeyDown);

    // Повертаємо фокус користувача на кнопку відправки або перше поле
    if (lastActiveElement) {
      lastActiveElement.focus();
    } else if (submitBtn) {
      submitBtn.focus();
    }
  }

  function handleModalKeyDown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeSuccessModal();
    }

    // Focus Trap: утримання фокусу всередині модального вікна
    if (e.key === 'Tab' && modal && !modal.classList.contains('hidden')) {
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  // Закриття кнопками
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSuccessModal);
  if (modalCloseIconBtn) modalCloseIconBtn.addEventListener('click', closeSuccessModal);

  // Закриття кліком по затемненому оверлею (але не по самій білій картці)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeSuccessModal);
  }

  // =============================================================================
  // 7. Обробка події надсилання форми (Submit Event Handler)
  // =============================================================================

  form.addEventListener('submit', (e) => {
    // 1. Зупиняємо стандартну поведінку браузера (перезавантаження сторінки)
    e.preventDefault();

    // 2. Позначаємо всі поля як перевірені
    touchedFields.add('username');
    touchedFields.add('email');
    touchedFields.add('phone');
    touchedFields.add('message');
    touchedFields.add('agreement');

    // 3. Запускаємо перевірку кожного поля
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    const isAgreementValid = validateAgreement();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid && isAgreementValid;

    // 4. Якщо хоча б одне поле невалідне — знаходимо перше з них і фокусуємо
    if (!isFormValid) {
      if (!isNameValid) {
        usernameInput.focus();
      } else if (!isEmailValid) {
        emailInput.focus();
      } else if (!isPhoneValid) {
        phoneInput.focus();
      } else if (!isMessageValid) {
        messageInput.focus();
      } else if (!isAgreementValid) {
        agreementInput.focus();
      }
      return;
    }

    // 5. Збираємо валідовані дані форми
    const topicText = topicSelect.options[topicSelect.selectedIndex]?.text || topicSelect.value;
    const validatedData = {
      name: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      topicText: topicText,
      message: messageInput.value.trim()
    };

    console.log('✅ [SOMELIA Client Validation]: Дані успішно валідовано:', validatedData);

    // 6. Відкриваємо доступне модальне вікно успіху
    openSuccessModal(validatedData);

    // 7. Очищаємо форму (form.reset()) та скидаємо UI-стани
    form.reset();
    touchedFields.clear();

    clearStatus(usernameInput, usernameError, usernameIcon);
    clearStatus(emailInput, emailError, emailIcon);
    clearStatus(phoneInput, phoneError, phoneIcon);
    clearStatus(messageInput, messageError, messageIcon);
    agreementError.classList.add('hidden');
    agreementInput.classList.remove('ring-2', 'ring-red-500');

    if (messageCounter) {
      messageCounter.textContent = `0 / ${MIN_MESSAGE_LENGTH} символів`;
      messageCounter.classList.remove('text-emerald-600', 'font-semibold');
      messageCounter.classList.add('text-stone-500');
    }
  });
});
