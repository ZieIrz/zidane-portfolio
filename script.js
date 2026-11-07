// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
});

// Close the mobile menu after selecting a section.
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Reveal elements as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Project category filtering.
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// Small cursor glow on devices with a fine pointer.
const cursorGlow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
} else {
  cursorGlow.remove();
}

// Keep the footer year current.
document.querySelector('#year').textContent = new Date().getFullYear();
