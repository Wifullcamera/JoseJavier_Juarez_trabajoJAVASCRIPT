// news-loader.js — carga de titulares tecnológicos desde Google News (RSS) usando Ajax
// Nota: Se usa el proxy público api.allorigins.win para evitar problemas de CORS
// y poder consumir el RSS de Google News desde GitHub Pages o un hosting estático.

document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;

  // RSS de noticias de Tecnología de Google News (edición España, idioma español)
  const GOOGLE_TECH_RSS =
    'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=es&gl=ES&ceid=ES:es';

  // Proxy CORS gratuito
  const PROXY = 'https://api.allorigins.win/get?url=';

  function showError(msg) {
    newsList.innerHTML = `<p class="muted">${msg}</p>`;
  }

  // Convierte los <item> del RSS en un array de objetos { title, link, source }
  function parseRssItems(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'text/xml');
    const items = Array.from(xml.getElementsByTagName('item'));

    if (!items.length) {
      return [];
    }

    return items.slice(0, 6).map((item) => {
      const titleEl = item.getElementsByTagName('title')[0];
      const linkEl = item.getElementsByTagName('link')[0];
      const sourceEl = item.getElementsByTagName('source')[0];

      const title = titleEl ? titleEl.textContent : 'Titular sin título';
      const link = linkEl ? linkEl.textContent : '#';
      const source = sourceEl ? sourceEl.textContent : 'Google News — Tecnología';

      return { title, link, source };
    });
  }

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
      title.textContent = item.title;

      const meta = document.createElement('p');
      meta.className = 'muted small';
      meta.textContent = item.source;

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

  // Carga las noticias de Google News Tecnología usando Ajax (XMLHttpRequest + proxy CORS)
  function loadGoogleTechNews() {
    const xhr = new XMLHttpRequest();
    const url = PROXY + encodeURIComponent(GOOGLE_TECH_RSS);

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const xmlString = data.contents;
          const items = parseRssItems(xmlString);
          if (!items.length) {
            showError('No se pudieron procesar las noticias.');
          } else {
            renderNews(items);
          }
        } catch (err) {
          console.error('Error procesando el RSS de Google News:', err);
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

    // Mensaje mientras se realiza la petición Ajax
    newsList.innerHTML = '<p class="muted">Cargando noticias de tecnología...</p>';

    xhr.send();
  }

  // Inicializar
  loadGoogleTechNews();
});
