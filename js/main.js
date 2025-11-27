// main.js — Funciones globales para toda la web

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mostrar el año actual en el pie de página
  const yearEls = document.querySelectorAll('#year, #year-c, #year-p');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // 2. Simular envío del formulario de contacto (index.html y contacto.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const contactResult = document.getElementById('contact-result');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactResult.textContent = 'Gracias, tu mensaje ha sido recibido (simulado).';
      contactResult.style.color = 'green';
      contactForm.reset();
    });
  }

  // 3. Resaltar el enlace activo en la navegación
  (function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.main-nav a');
    if (!navLinks.length) return;
    const current = window.location.pathname.replace(/\/+$/, '');
    navLinks.forEach(a => {
      try {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        const linkUrl = new URL(href, window.location.origin + window.location.pathname);
        const linkPath = linkUrl.pathname.replace(/\/+$/, '');
        if (linkPath === current) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      } catch (err) {
        // Si hay error al procesar la URL, lo ignoramos
      }
    });
  })();

  // 4. Enlaces con hash que hacen scroll al inicio
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) return; // Si apunta a un ID, no hacemos nada
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 5. Accesibilidad: mostrar foco visible al navegar con teclado
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-tabbing');
    }
  }, { once: true });
});