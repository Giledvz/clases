import {
  ALCANCES,
  SEGMENTOS,
  TEMAS,
  USOS,
  segmentosEcoems,
  segmentosUnam
} from './catalogo-quimica.js';

const themeNav = document.getElementById('themeNav');
const courseIndex = document.getElementById('courseIndex');
const scopeFilters = document.getElementById('scopeFilters');
const contentSearch = document.getElementById('contentSearch');
const searchClear = document.getElementById('searchClear');
const finderStatus = document.getElementById('finderStatus');
const emptyState = document.getElementById('emptyState');

let activeScope = 'all';

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

function renderSummary() {
  const ecoems = segmentosEcoems();
  document.getElementById('themeCount').textContent = TEMAS.length;
  document.getElementById('segmentCount').textContent = ecoems.length;
  document.getElementById('availableCount').textContent = ecoems.filter((item) => item.href).length;
  document.getElementById('unamCount').textContent = `${segmentosUnam().length} contenidos reservados`;
}

function renderThemeNav() {
  TEMAS.forEach((theme) => {
    const count = SEGMENTOS.filter((segment) => segment.tema === theme.id && segment.alcance !== 'unam').length;
    const link = document.createElement('a');
    link.className = 'theme-link';
    link.href = `#${theme.id}`;
    link.innerHTML = `
      <span class="theme-link__number">${theme.numero}</span>
      <span class="theme-link__title">${theme.titulo}</span>
      <span class="theme-link__count">${count} ${count === 1 ? 'contenido' : 'contenidos'}</span>
    `;
    themeNav.append(link);
  });
}

function renderScopeFilters() {
  [
    { id: 'all', nombre: 'Todo ECOEMS' },
    { id: 'nucleo', nombre: ALCANCES.nucleo.nombre },
    { id: 'ampliacion', nombre: ALCANCES.ampliacion.nombre }
  ].forEach((scope) => {
    const button = document.createElement('button');
    button.className = 'filter';
    button.type = 'button';
    button.dataset.scope = scope.id;
    button.textContent = scope.nombre;
    button.setAttribute('aria-pressed', scope.id === 'all' ? 'true' : 'false');
    button.addEventListener('click', () => {
      activeScope = scope.id;
      scopeFilters.querySelectorAll('.filter').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      applyFilters();
    });
    scopeFilters.append(button);
  });
}

function resourceMarkup(segment) {
  const actionLabel = 'Abrir recurso →';
  const action = segment.href
    ? `<a class="resource__link" href="${segment.href}">${actionLabel}</a>`
    : '<span class="resource__state">En preparación</span>';
  const usages = segment.usos
    .map((usage) => USOS[usage])
    .join(' · ');
  const tags = segment.etiquetas.slice(0, 3)
    .map((tag) => `<a class="resource__tag" data-search-tag="${tag}" href="?q=${encodeURIComponent(tag)}#courseIndex">${tag}</a>`)
    .join('<span class="meta-separator" aria-hidden="true">·</span>');
  const scope = ALCANCES[segment.alcance].nombre;

  return `
    <div>
      <p class="resource__scope">${scope}</p>
      <h3>${segment.titulo}</h3>
      <p class="resource__description">${segment.descripcion}</p>
      <div class="resource__meta">
        <p class="resource__usage"><span class="resource__meta-label">Uso</span> ${usages}</p>
        <nav class="resource__tags" aria-label="Etiquetas de ${segment.titulo}">
          <span class="resource__meta-label">Etiquetas</span>${tags}
        </nav>
      </div>
    </div>
    <div class="resource__action">${action}</div>
  `;
}

function renderCourseIndex() {
  TEMAS.forEach((theme) => {
    const chapter = document.createElement('section');
    chapter.className = 'chapter';
    chapter.id = theme.id;
    chapter.dataset.theme = theme.id;
    chapter.innerHTML = `
      <header class="chapter__head">
        <span class="chapter__number">Tema ${theme.numero}</span>
        <h2>${theme.titulo}</h2>
        <p class="chapter__description">${theme.descripcion}</p>
        <nav class="chapter__tags" aria-label="Buscar por etiqueta en ${theme.titulo}">
          <span class="resource__meta-label">Explorar</span>
          ${theme.etiquetas.map((tag) => `<a class="chapter__tag" data-search-tag="${tag}" href="?q=${encodeURIComponent(tag)}#courseIndex">${tag}</a>`).join('<span class="meta-separator" aria-hidden="true">·</span>')}
        </nav>
      </header>
      <div class="resource-list"></div>
    `;

    const list = chapter.querySelector('.resource-list');
    SEGMENTOS
      .filter((segment) => segment.tema === theme.id && segment.alcance !== 'unam')
      .forEach((segment) => {
        const article = document.createElement('article');
        article.className = 'resource';
        article.dataset.id = segment.id;
        article.dataset.scope = segment.alcance;
        article.dataset.search = normalize([
          segment.titulo,
          segment.descripcion,
          segment.etiquetas.join(' '),
          segment.usos.map((usage) => USOS[usage]).join(' '),
          theme.titulo
        ].join(' '));
        article.innerHTML = resourceMarkup(segment);
        list.append(article);
      });

    courseIndex.append(chapter);
  });
}

function applyFilters() {
  const term = normalize(contentSearch.value);
  let visibleTotal = 0;

  courseIndex.querySelectorAll('.chapter').forEach((chapter) => {
    let visibleInChapter = 0;
    chapter.querySelectorAll('.resource').forEach((resource) => {
      const matchesScope = activeScope === 'all' || resource.dataset.scope === activeScope;
      const matchesTerm = !term || resource.dataset.search.includes(term);
      const visible = matchesScope && matchesTerm;
      resource.classList.toggle('is-hidden', !visible);
      if (visible) visibleInChapter += 1;
    });
    chapter.classList.toggle('is-hidden', visibleInChapter === 0);
    visibleTotal += visibleInChapter;
  });

  searchClear.classList.toggle('is-visible', Boolean(contentSearch.value));
  emptyState.classList.toggle('is-visible', visibleTotal === 0);
  courseIndex.querySelectorAll('a[data-search-tag]').forEach((link) => {
    const isCurrent = Boolean(term) && normalize(link.dataset.searchTag) === term;
    if (isCurrent) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });

  if (!term && activeScope === 'all') {
    finderStatus.textContent = `${visibleTotal} contenidos organizados en los tres temas ECOEMS.`;
  } else if (visibleTotal === 0) {
    finderStatus.textContent = 'No encontramos contenidos con esos criterios.';
  } else {
    finderStatus.textContent = `${visibleTotal} ${visibleTotal === 1 ? 'contenido coincide' : 'contenidos coinciden'}.`;
  }
}

function updateFilterAddress(value) {
  const address = new URL(window.location.href);
  const query = value.trim();
  if (query) address.searchParams.set('q', query);
  else address.searchParams.delete('q');
  address.hash = 'courseIndex';
  window.history.replaceState(null, '', address);
}

function filterByTag(tag) {
  const isCurrent = normalize(contentSearch.value) === normalize(tag);
  contentSearch.value = isCurrent ? '' : tag;
  activeScope = 'all';
  scopeFilters.querySelectorAll('.filter').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.scope === 'all'));
  });
  applyFilters();
  updateFilterAddress(contentSearch.value);
  courseIndex.scrollIntoView({ block: 'start' });
}

courseIndex.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-search-tag]');
  if (!link) return;
  event.preventDefault();
  filterByTag(link.dataset.searchTag);
});

contentSearch.addEventListener('input', () => {
  applyFilters();
  updateFilterAddress(contentSearch.value);
});
contentSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    contentSearch.value = '';
    applyFilters();
    updateFilterAddress('');
  }
});

searchClear.addEventListener('click', () => {
  contentSearch.value = '';
  contentSearch.focus();
  applyFilters();
  updateFilterAddress('');
});

document.querySelector('.site-nav__theme').addEventListener('click', () => {
  if (window.ClasesTheme) window.ClasesTheme.toggle();
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== contentSearch) {
    event.preventDefault();
    contentSearch.focus();
  }
});

renderSummary();
renderThemeNav();
renderScopeFilters();
renderCourseIndex();
const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery) contentSearch.value = initialQuery;
applyFilters();
