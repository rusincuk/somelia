# SOMELIA — Інтерактивна платформа українського крафтового сиру та вина 🧀🍷

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://rusincuk.github.io/somelia/)
[![Netlify Status](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify)](https://somelia-craft.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **SOMELIA** — це сучасний мультисторінковий вебкаталог та інтерактивний гастрономічний гід, покликаний популяризувати українське крафтове сироваріння та виноробство. Сервіс пропонує розумну систему підбору гастрономічних пар (food pairing) на основі смакових профілів, регіональних теруарів і технологій витримки.

---

## 🌐 Посилання на розгорнутий проєкт (Live Deployment)

| Платформа | Адреса публікації | Опис |
| :--- | :--- | :--- |
| **GitHub Pages** | [rusincuk.github.io/somelia](https://rusincuk.github.io/somelia/) | Статичний хостинг на базі гілки `main` репозиторію GitHub |
| **Netlify** | [somelia-craft.netlify.app](https://somelia-craft.netlify.app/) | Хмарний хостинг із безперервною інтеграцією (CI/CD) та захисними заголовками |

---

## 📌 Ключовий функціонал платформи

1. **Головний лендинг (AIDA funnel)** — презентація концепції крафтових теруарів України, сезонних сетів та культури споживання.
2. **Каталог українських крафтових сирів (`cheese-catalog.html`)** — гуцульська бринза, карпатські витримані сири, м'які козині сири та сири з білою/блакитною пліснявою.
3. **Каталог локальних вин (`wine-catalog.html`)** — сухі білі та червоні вина Закарпаття, Поділля, Причорномор'я та Бессарабії.
4. **Інтерактивний Wizard підбору пар (`pairing-wizard.html` & `pairing-result.html`)** — покроковий фільтр для створення гармонійного гастрономічного тандему під обрану подію або смаковий настрій.
5. **Мультимедіа-хаб** — адаптивне відео 16:9 із YouTube, інтерактивна навігація через Google Maps (дегустаційний зал у Києві, вул. Спаська, 12) та погодний інформер теруарів.
6. **Особисті списки вподобань (`favorites.html`)** та зворотний зв'язок (`contacts.html`).

---

## 🛠 Стек технологій

- **Розмітка та семантика**: Семантичний HTML5 (теги `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`).
- **Стилізація**: Tailwind CSS (Utility-First фреймворк), кастомні CSS-змінні для фірмової винно-сирної палітри, Google Fonts (*Playfair Display*, *Inter*).
- **Клієнтська логіка**: Vanilla JavaScript (керування мобільним меню, локальне збереження улюблених позицій, робота wizard-форми).
- **Контроль версій**: Git (локально через CLI та графічний інтерфейс VS Code Source Control).
- **Хмарний репозиторій**: GitHub (`rusincuk/somelia`).
- **Хостинг та деплой**: GitHub Pages, Netlify.

---

## 🚀 Локальний запуск та розробка

### 1. Клонування репозиторію:
```bash
git clone https://github.com/rusincuk/somelia.git
cd somelia
```

### 2. Відкриття у Visual Studio Code:
```bash
code .
```

### 3. Запуск вебсайту:
- За допомогою розширення **Live Server** у VS Code: натисніть `Go Live` на нижній панелі або клікніть правою кнопкою миші на `index.html` і виберіть `Open with Live Server`.
- Або просто відкрийте `index.html` у будь-якому сучасному веббраузері (Chrome, Firefox, Safari, Edge).

---

## 🌿 Структура репозиторію та культура комітів

Проєкт ведеться відповідно до міжнародного стандарту **Conventional Commits**:
- `feat:` — новий функціонал сайту або сторінки;
- `style:` — правки верстки, додавання стилів, оптимізація медіа;
- `chore:` — конфігураційні файли хостингу (`netlify.toml`, `.gitignore`);
- `docs:` — оновлення документації та звітності;
- `merge:` — інтеграція розроблених feature-гілок в основну гілку `main`.

---

## 👤 Авторка проєкту

- **Студентка**: Русинчук Юлія
- **Група**: ПП-25
- **Навчальний заклад**: Національний університет "Львівська політехніка"
- **Кафедра**: Систем автоматизованого проектування (САПР)
- **GitHub**: [@rusincuk](https://github.com/rusincuk)
