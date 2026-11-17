// SOMELIA — Bulletproof Mobile Menu Navigation Controller
// Works reliably across all mobile devices (iOS Safari, Android Chrome, Samsung Internet)
// Features explicit boolean state, event deduplication, backdrop click & escape key dismiss

(function() {
  'use strict';

  var isMenuOpen = false;

  function getElements() {
    return {
      btn: document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-menu-btn'),
      menu: document.getElementById('mobileMenu'),
      burger: document.getElementById('hamburgerIcon'),
      close: document.getElementById('closeIcon')
    };
  }

  function setMenuState(open) {
    isMenuOpen = !!open;
    var els = getElements();
    var menu = els.menu;
    var btn = els.btn;
    var burger = els.burger;
    var close = els.close;

    if (!menu) return;

    if (isMenuOpen) {
      // OPEN MENU
      menu.classList.remove('hidden');
      menu.classList.add('open');
      menu.style.display = 'block';

      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-active');
      }
      if (burger) {
        burger.classList.remove('block');
        burger.classList.add('hidden');
        burger.style.display = 'none';
      }
      if (close) {
        close.classList.remove('hidden');
        close.classList.add('block');
        close.style.display = 'block';
      }
    } else {
      // CLOSE MENU
      menu.classList.add('hidden');
      menu.classList.remove('open');
      menu.style.display = 'none';

      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-active');
      }
      if (burger) {
        burger.classList.remove('hidden');
        burger.classList.add('block');
        burger.style.display = 'block';
      }
      if (close) {
        close.classList.remove('block');
        close.classList.add('hidden');
        close.style.display = 'none';
      }
    }
  }

  function toggleSomeliaMenu(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    // Flip state
    setMenuState(!isMenuOpen);
    return false;
  }

  // Expose immediately to global scope
  window.toggleSomeliaMenu = toggleSomeliaMenu;
  window.setSomeliaMenuState = setMenuState;

  function initMobileNav() {
    var els = getElements();
    var btn = els.btn;
    var menu = els.menu;

    if (btn) {
      btn.style.touchAction = 'manipulation';
      // Direct click handler
      btn.onclick = function(e) {
        return toggleSomeliaMenu(e);
      };
    }

    // Dismiss when tapping outside or tapping a link inside menu
    document.addEventListener('click', function(e) {
      if (!isMenuOpen) return;
      var cur = getElements();

      // If clicked on button or its children, handled by toggle
      if (cur.btn && (cur.btn === e.target || cur.btn.contains(e.target))) {
        return;
      }

      // If clicked inside drawer
      if (cur.menu && cur.menu.contains(e.target)) {
        // If clicking a link, close menu so navigation feels crisp
        if (e.target && (e.target.tagName === 'A' || (e.target.closest && e.target.closest('a')))) {
          setMenuState(false);
        }
        return;
      }

      // Tapped outside drawer
      setMenuState(false);
    }, true);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuState(false);
      }
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setMenuState(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
