// gallery.js — Galería dinámica con filtros, paginación y lightbox

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // 1. Lista de imágenes con categorías y descripciones
  // ============================
  const IMAGES = [
    { id: 1, src: '../images/portatil-x100.jpg', title: 'Portátil X100', cat: 'portatiles', desc: 'Ligero y potente.' },
    { id: 2, src: '../images/portatil-2.jpg', title: 'Portátil Slim', cat: 'portatiles', desc: 'Diseño ultrafino.' },
    { id: 3, src: '../images/auriculares-pro.jpg', title: 'Auriculares Pro', cat: 'auriculares', desc: 'Cancelación de ruido.' },
    { id: 4, src: '../images/auriculares-2.jpg', title: 'Auriculares Lite', cat: 'auriculares', desc: 'Cómodos y ligeros.' },
    { id: 5, src: '../images/teclado-mecha.jpg', title: 'Teclado Mecha', cat: 'accesorios', desc: 'Switches táctiles.' },
    { id: 6, src: '../images/mouse-gaming.jpg', title: 'Ratón GT', cat: 'accesorios', desc: 'Ergonómico y rápido.' },
    { id: 7, src: '../images/portatil-x100-news.jpg', title: 'X100 Edición', cat: 'portatiles', desc: 'Edición especial.' },
    { id: 8, src: '../images/auriculares-pro-news.jpg', title: 'Auriculares Pro 2', cat: 'auriculares', desc: 'Mejor batería.' },
    { id: 9, src: '../images/teclado-mecha-news.jpg', title: 'Teclado Mecha V2', cat: 'accesorios', desc: 'Soporte macros.' },
    { id: 10, src: '../images/accesorio-3.jpg', title: 'Soporte USB', cat: 'accesorios', desc: 'Compacto y útil.' }
  ];

  // ============================
  // 2. Estado inicial
  // ============================
  let currentFilter = 'all';
  let perPage = parseInt(document.getElementById('per-page').value, 10) || 9;
  let currentPage = 1;

  // ============================
  // 3. Elementos del DOM
  // ============================
  const galleryEl = document.getElementById('gallery');
  const paginationEl = document.getElementById('pagination');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const perPageSelect = document.getElementById('per-page');

  // Elementos del lightbox
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let lbIndex = 0;

  // ============================
  // 4. Filtrar imágenes por categoría
  // ============================
  function filteredImages() {
    return IMAGES.filter(i => currentFilter === 'all' ? true : i.cat === currentFilter);
  }

  // ============================
  // 5. Renderizar galería con paginación
  // ============================
  function renderGallery() {
    const items = filteredImages();
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * perPage;
    const pageItems = items.slice(start, start + perPage);

    galleryEl.innerHTML = '';

    if (pageItems.length === 0) {
      galleryEl.innerHTML = '<p class="muted">No hay imágenes para mostrar.</p>';
      paginationEl.innerHTML = '';
      return;
    }

    // Crear miniaturas
    pageItems.forEach((imgObj) => {
      const card = document.createElement('div');
      card.className = 'thumb-card';

      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Abrir ' + imgObj.title);

      const img = document.createElement('img');
      img.src = imgObj.src;
      img.alt = imgObj.title;
      img.loading = 'lazy';

      const info = document.createElement('div');
      info.className = 'thumb-info';
      const h4 = document.createElement('h4');
      h4.textContent = imgObj.title;
      const p = document.createElement('p');
      p.textContent = imgObj.desc;

      info.appendChild(h4);
      info.appendChild(p);
      btn.appendChild(img);
      btn.appendChild(info);
      card.appendChild(btn);

      // Abrir lightbox al hacer clic
      btn.addEventListener('click', () => {
        const all = filteredImages();
        lbIndex = all.findIndex(x => x.id === imgObj.id);
        openLightbox(all);
      });

      galleryEl.appendChild(card);
    });

    renderPagination(totalPages);
  }

  // ============================
  // 6. Renderizar botones de paginación
  // ============================
  function renderPagination(totalPages) {
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderGallery();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationEl.appendChild(btn);
    }
  }

  // ============================
  // 7. Filtros por categoría
  // ============================
  filterBtns.forEach(b => {
    b.addEventListener('click', () => {
      filterBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentFilter = b.dataset.filter;
      currentPage = 1;
      renderGallery();
    });
  });

  // ============================
  // 8. Cambiar cantidad por página
  // ============================
  perPageSelect.addEventListener('change', e => {
    perPage = parseInt(e.target.value, 10);
    currentPage = 1;
    renderGallery();
  });

  // ============================
  // 9. Funciones del lightbox
  // ============================
  function openLightbox(list) {
    const imgObj = list[lbIndex];
    if (!imgObj) {
      lbImage.src = 'about:blank';
      lbImage.alt = '';
      lbCaption.textContent = 'Imagen no encontrada.';
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      return;
    }
    lbImage.src = imgObj.src;
    lbImage.alt = imgObj.title;
    lbCaption.textContent = imgObj.title + ' — ' + imgObj.desc;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lb.dataset.list = JSON.stringify(list.map(i => i.id));
  }

  function closeLightbox() {
    lb.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    document.body.style.overflow = '';
    lb.removeAttribute('data-list');
  }

  function navigateLightbox(direction) {
    const ids = lb.dataset.list ? JSON.parse(lb.dataset.list) : [];
    if (!ids.length) return;
    lbIndex = (lbIndex + direction + ids.length) % ids.length;
    const id = ids[lbIndex];
    const all = filteredImages();
    const obj = all.find(i => i.id === id);
    if (obj) {
      lbImage.src = obj.src;
      lbImage.alt = obj.title;
      lbCaption.textContent = obj.title + ' — ' + obj.desc;
    } else {
      lbImage.src = 'about:blank';
      lbImage.alt = '';
      lbCaption.textContent = 'Imagen no encontrada.';
    }
  }

  // ============================
  // 10. Eventos del lightbox
  // ============================
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigateLightbox(-1));
  lbNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (lb.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  // ============================
  // 11. Inicializar galería
  // ============================
  renderGallery();
});