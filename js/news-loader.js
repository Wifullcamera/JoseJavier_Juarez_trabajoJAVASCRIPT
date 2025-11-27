// news-loader.js — carga de noticias desde un archivo JSON externo utilizando Ajax (XMLHttpRequest)

document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;

  // Mostrar un mensaje de error en la zona de noticias
  function showError(msg) {
    newsList.innerHTML = `<p class="muted">${msg}</p>`;
  }

  // Pintar las tarjetas de noticias a partir de un array de objetos
  function renderNews(items) {
    if (!Array.isArray(items) || items.length === 0) {
      showError('No hay noticias disponibles en este momento.');
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'news-card';

      const title = document.createElement('h3');
      title.textContent = item.title || 'Titular sin título';

      const meta = document.createElement('p');
      meta.className = 'muted small';
      meta.textContent = item.source || '';

      const link = document.createElement('a');
      link.href = item.link || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Leer más';

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(link);

      fragment.appendChild(card);
    });

    newsList.innerHTML = '';
    newsList.appendChild(fragment);
  }

  // Cargar noticias mediante Ajax desde un archivo JSON externo (misma origen)
  function loadLocalNews() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'js/noticias.json', true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          // Se espera que el JSON tenga una propiedad "articles"
          renderNews(data.articles || []);
        } catch (err) {
          console.error('Error procesando el JSON de noticias:', err);
          showError('No se pudieron procesar las noticias.');
        }
      } else {
        console.error('Error HTTP cargando noticias:', xhr.status, xhr.statusText);
        showError('No se pudieron cargar las noticias.');
      }
    };

    xhr.onerror = function () {
      console.error('Error de red al cargar noticias.');
      showError('No se pudieron cargar las noticias.');
    };

    newsList.innerHTML = '<p class="muted">Cargando noticias...</p>';
    xhr.send();
  }

  // Inicializar
  loadLocalNews();
});
