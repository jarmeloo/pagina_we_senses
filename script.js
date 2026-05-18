/* ==========================================
   WE SENSES — script.js
   ========================================== */

// ---- NAV: scroll state ----
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ---- REVEAL ON SCROLL (Intersection Observer) ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

// Trigger hero reveals immediately on load
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});

// Non-hero reveals on scroll
revealEls.forEach(el => {
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ---- STAGGERED SECTION REVEALS ----
// Add reveal class dynamically to section children for staggered effect
const sectionSelectors = [
  '.sobre-text > *',
  '.contato-text > *',
  '.produto-card',
  '.colecao-item',
  '.personalizados-card',
  '.numero',
];

sectionSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });
});

// ---- SMOOTH ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--terracota)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ---- PRODUTO CARDS: click to navigate ----
document.querySelectorAll('.produto-card[data-href]').forEach(card => {
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.open(card.dataset.href, '_blank');
    }
  });
  card.style.cursor = 'pointer';
});

// ---- COLEÇÃO ITEMS: click to navigate ----
document.querySelectorAll('.colecao-item[data-href]').forEach(item => {
  item.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.open(item.dataset.href, '_blank');
    }
  });
});

// ---- MARQUEE: pause on hover ----
const marquee = document.querySelector('.marquee');
if (marquee) {
  marquee.addEventListener('mouseenter', () => {
    marquee.style.animationPlayState = 'paused';
  });
  marquee.addEventListener('mouseleave', () => {
    marquee.style.animationPlayState = 'running';
  });
}

// ---- SCROLL PROGRESS INDICATOR ----
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: var(--terracota);
  z-index: 200;
  width: 0%;
  transition: width 0.1s;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

// ---- BLOB animation variation trigger ----
// Randomize blob shape on load for freshness
const blob = document.querySelector('.sobre-blob');
if (blob) {
  const shapes = [
    '60% 40% 50% 60% / 50% 60% 40% 50%',
    '50% 60% 40% 60% / 60% 50% 60% 40%',
    '40% 60% 55% 45% / 55% 45% 60% 40%',
  ];
  const random = shapes[Math.floor(Math.random() * shapes.length)];
  blob.style.borderRadius = random;
}

// ---- CURSOR: subtle terracota dot on desktop ----
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    background: var(--terracota);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.3s;
    opacity: 0;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - 4}px`;
    cursor.style.top = `${e.clientY - 4}px`;
    cursor.style.opacity = '0.7';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Scale up on clickable elements
  document.querySelectorAll('a, button, .produto-card, .colecao-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2.5)';
      cursor.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.opacity = '0.7';
    });
  });
}
