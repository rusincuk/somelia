// База знань гастропар Somelia
const someliaDatabase = [
  {
    id: 1,
    cheeseCategory: "soft",
    wineCategory: "sparkling",
    cheeseName: "Брі де Мо (Brie de Meaux)",
    winePair: "Шампанське Брют або Просекко",
    origin: "Франція & Шампань",
    profile: "Вершковий, маслянистий, грибний післясмак",
    tip: "Висока кислотність та тонкий перляж ігристого вина очищують піднебіння від маслянистості білої скоринки Брі.",
    icon: "🍾🧀"
  },
  {
    id: 2,
    cheeseCategory: "soft",
    wineCategory: "white",
    cheeseName: "Камамбер Нормандський",
    winePair: "Шардоне з легкою витримкою у дубі",
    origin: "Нормандія, Франція",
    profile: "Вершковий, пікантний, землистий",
    tip: "Округле біле вино підкреслює ніжну структуру, не перебиваючи тонкі нотки скоринки camemberti.",
    icon: "🥂🧀"
  },
  {
    id: 3,
    cheeseCategory: "hard",
    wineCategory: "red",
    cheeseName: "Парміджано Реджано 36 міс.",
    winePair: "К'янті Класіко (Chianti Classico)",
    origin: "Тоскана, Італія",
    profile: "Зернистий, пікантний, горіховий, кристали умамі",
    tip: "Таніни сорту Санджовезе чудово гармоніюють із високим вмістом білка витриманого сиру.",
    icon: "🍷🧀"
  },
  {
    id: 4,
    cheeseCategory: "hard",
    wineCategory: "red",
    cheeseName: "Витримана Гауда (18 міс.)",
    winePair: "Каберне Совіньйон або Мерло",
    origin: "Нідерланди & Бордо",
    profile: "Карамельний, ірисковий, щільний",
    tip: "Щільні таніни червоного вина пом'якшуються солодкувато-горіховими відтінками зрілої Гауди.",
    icon: "🍷🧀"
  },
  {
    id: 5,
    cheeseCategory: "blue",
    wineCategory: "dessert",
    cheeseName: "Горгонзола Піканте / Рокфор",
    winePair: "Вінтажний Портвейн (Porto) або Сотерн",
    origin: "Ломбардія & Долина Дору",
    profile: "Гострий, солоний, пряний, пікантний",
    tip: "Золоте правило контрасту: гостра солоність плісняви нівелюється медовою солодкістю лікерного вина.",
    icon: "🍇🧀"
  },
  {
    id: 6,
    cheeseCategory: "goat",
    wineCategory: "white",
    cheeseName: "Шевр (Chèvre) / Козячий кротен",
    winePair: "Совіньйон Блан (Сансер)",
    origin: "Долина Луари, Франція",
    profile: "Трав'янистий, цитрусовий, сухий, свіжий",
    tip: "Регіональний союз: хрустка кислотність Совіньйону дублює свіжу кислотність молодого козячого сиру.",
    icon: "🥂🧀"
  }
];

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. TYPED.JS ІНІЦІАЛІЗАЦІЯ
  if (document.getElementById('typed-somelia')) {
    new Typed('#typed-somelia', {
      strings: [
        'крафтових сирів та шляхетного вина.',
        'ідеальних дегустаційних пар.',
        'французьких та італійських терруарів.',
        'вишуканого гастрономічного задоволення.'
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 400,
      loop: true,
      showCursor: true,
      cursorChar: '🍷'
    });
  }

  // 2. FANCYBOX V5 ІНІЦІАЛІЗАЦІЯ
  Fancybox.bind('[data-fancybox="somelia-gallery"]', {
    Carousel: {
      transition: 'fade'
    },
    Images: {
      Panzoom: {
        maxScale: 3
      }
    }
  });

  // 3. SWIPER.JS V11 ІНІЦІАЛІЗАЦІЯ
  new Swiper('.reviews-swiper', {
    loop: true,
    speed: 700,
    spaceBetween: 25,
    grabCursor: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 15 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 25 }
    }
  });

  // 4. ІНТЕРАКТИВНИЙ ФІЛЬТР КАТАЛОГУ
  const cheeseSelect = document.getElementById("cheeseSelect");
  const wineSelect = document.getElementById("wineSelect");
  const pairingResults = document.getElementById("pairingResults");

  function renderCards(pairs) {
    pairingResults.innerHTML = "";
    if (pairs.length === 0) {
      pairingResults.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-color);">
          <p style="color: var(--gold-accent); font-size: 1.1rem;">Специфічної пари за цим фільтром не знайдено 🍇</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Оберіть «Усі види вин» або інший сир.</p>
        </div>
      `;
      return;
    }

    pairs.forEach(pair => {
      const card = document.createElement("div");
      card.className = "pair-card";
      card.innerHTML = `
        <div>
          <div class="card-header">
            <h3 class="card-title">${pair.cheeseName}</h3>
            <span style="font-size: 1.5rem;">${pair.icon}</span>
          </div>
          <div class="card-tags">
            <span class="tag tag-cheese">${pair.cheeseCategory.toUpperCase()}</span>
            <span class="tag tag-wine">${pair.winePair}</span>
          </div>
          <div class="card-body">
            <p><strong>Регіон:</strong> ${pair.origin}</p>
            <p><strong>Профіль:</strong> ${pair.profile}</p>
          </div>
        </div>
        <div class="sommelier-note">
          <strong>Порада сомельє:</strong> ${pair.tip}
        </div>
      `;
      pairingResults.appendChild(card);
    });
  }

  function filterPairings() {
    const selectedCheese = cheeseSelect.value;
    const selectedWine = wineSelect.value;
    const filtered = someliaDatabase.filter(item => {
      const matchesCheese = (selectedCheese === "all") || (item.cheeseCategory === selectedCheese);
      const matchesWine = (selectedWine === "all") || (item.wineCategory === selectedWine);
      return matchesCheese && matchesWine;
    });
    renderCards(filtered);
  }

  cheeseSelect.addEventListener("change", filterPairings);
  wineSelect.addEventListener("change", filterPairings);
  renderCards(someliaDatabase);
});
