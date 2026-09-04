import { ELEMENTOS, FAMILIAS, FAMILIAS_POR_ID } from './elementos.js';

const grid = document.getElementById('periodicGrid');
const filters = document.getElementById('familyFilters');
const search = document.getElementById('elementSearch');
const searchClear = document.getElementById('searchClear');
const searchStatus = document.getElementById('searchStatus');
const detail = document.getElementById('elementDetail');

const detailFields = {
  number: document.getElementById('detailNumber'),
  symbol: document.getElementById('detailSymbol'),
  mass: document.getElementById('detailMass'),
  family: document.getElementById('detailFamily'),
  name: document.getElementById('detailName'),
  atomicNumber: document.getElementById('detailAtomicNumber'),
  period: document.getElementById('detailPeriod'),
  group: document.getElementById('detailGroup'),
  explanation: document.getElementById('detailExplanation')
};

const buttonsByNumber = new Map();
let selectedNumber = 1;
let activeFamily = 'all';

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

function familyLabel(id) {
  return FAMILIAS_POR_ID[id]?.nombre || id;
}

function cellPosition(element) {
  if (element.familia === 'lantanido') {
    return { row: 10, column: element.numero - 53 };
  }
  if (element.familia === 'actinido') {
    return { row: 11, column: element.numero - 85 };
  }
  return { row: element.periodo + 1, column: element.grupo + 1 };
}

function makeAxisLabel(text, row, column, extraClass = '') {
  const label = document.createElement('span');
  label.className = `axis-label ${extraClass}`.trim();
  label.textContent = text;
  label.setAttribute('aria-hidden', 'true');
  label.style.gridRow = row;
  label.style.gridColumn = column;
  grid.append(label);
}

function renderAxes() {
  for (let group = 1; group <= 18; group += 1) {
    makeAxisLabel(group, 1, group + 1);
  }
  for (let period = 1; period <= 7; period += 1) {
    makeAxisLabel(period, period + 1, 1);
  }

  makeAxisLabel('Lantánidos', 10, 1, 'series-label');
  makeAxisLabel('Actínidos', 11, 1, 'series-label');
}

function renderPlaceholders() {
  [
    { row: 7, range: '57–71', label: 'Lantánidos' },
    { row: 8, range: '89–103', label: 'Actínidos' }
  ].forEach(({ row, range, label }) => {
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder-cell';
    placeholder.style.gridRow = row;
    placeholder.style.gridColumn = 4;
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.innerHTML = `<strong>${range}</strong><span>${label}</span>`;
    grid.append(placeholder);
  });
}

function renderElements() {
  ELEMENTOS.forEach((element) => {
    const { row, column } = cellPosition(element);
    const button = document.createElement('button');
    button.className = 'element';
    button.type = 'button';
    button.dataset.number = element.numero;
    button.dataset.family = element.familia;
    button.style.gridRow = row;
    button.style.gridColumn = column;
    button.setAttribute(
      'aria-label',
      `${element.nombre}, ${element.simbolo}, número atómico ${element.numero}, masa ${element.masa}`
    );
    button.innerHTML = `
      <span class="element__number">${element.numero}</span>
      <span class="element__symbol">${element.simbolo}</span>
      <span class="element__name">${element.nombre}</span>
      <span class="element__mass">${element.masa}</span>
    `;
    button.addEventListener('click', () => selectElement(element.numero));
    button.addEventListener('keydown', (event) => navigateFromCell(event, element.numero));
    buttonsByNumber.set(element.numero, button);
    grid.append(button);
  });
}

function renderFilters() {
  const options = [
    { id: 'all', nombre: 'Todas' },
    ...FAMILIAS
  ];

  options.forEach((family) => {
    const button = document.createElement('button');
    button.className = family.id === 'all' ? 'filter filter--all' : 'filter';
    button.type = 'button';
    button.dataset.family = family.id;
    button.textContent = family.nombre;
    button.setAttribute('aria-pressed', family.id === 'all' ? 'true' : 'false');
    button.addEventListener('click', () => {
      activeFamily = family.id;
      filters.querySelectorAll('.filter').forEach((filter) => {
        filter.setAttribute('aria-pressed', String(filter === button));
      });
      applyFilters();
    });
    filters.append(button);
  });
}

function matchesSearch(element, rawTerm) {
  const term = normalize(rawTerm);
  if (!term) return true;

  const searchable = normalize([
    element.numero,
    element.simbolo,
    element.nombre,
    element.alias,
    familyLabel(element.familia)
  ].join(' '));

  return searchable.includes(term);
}

function applyFilters() {
  const rawTerm = search.value;
  let visible = 0;

  ELEMENTOS.forEach((element) => {
    const familyMatches = activeFamily === 'all' || element.familia === activeFamily;
    const searchMatches = matchesSearch(element, rawTerm);
    const matches = familyMatches && searchMatches;
    const button = buttonsByNumber.get(element.numero);
    button.classList.toggle('is-muted', !matches);
    button.setAttribute('aria-hidden', String(!matches));
    button.tabIndex = matches ? 0 : -1;
    if (matches) visible += 1;
  });

  const hasTerm = Boolean(rawTerm.trim());
  const hasFamily = activeFamily !== 'all';
  if (!hasTerm && !hasFamily) {
    searchStatus.textContent = '118 elementos disponibles.';
  } else if (visible === 0) {
    searchStatus.textContent = 'No encontramos elementos con esos criterios.';
  } else {
    searchStatus.textContent = `${visible} ${visible === 1 ? 'elemento coincide' : 'elementos coinciden'}.`;
  }

  searchClear.classList.toggle('is-visible', hasTerm);
}

function explanationFor(element) {
  const placement = element.grupo
    ? `Ocupa el periodo ${element.periodo} y el grupo ${element.grupo}.`
    : `Pertenece al bloque f del periodo ${element.periodo}; en esta representación no se le asigna un número de grupo.`;
  const massNote = element.masa.startsWith('[')
    ? ` El valor ${element.masa} es un número de masa de referencia, no un peso atómico estándar.`
    : '';
  return placement + massNote;
}

function selectElement(number, options = {}) {
  const element = ELEMENTOS.find((item) => item.numero === number);
  if (!element) return;

  const previousButton = buttonsByNumber.get(selectedNumber);
  previousButton?.classList.remove('is-selected');
  previousButton?.removeAttribute('aria-current');

  selectedNumber = number;
  const selectedButton = buttonsByNumber.get(number);
  selectedButton.classList.add('is-selected');
  selectedButton.setAttribute('aria-current', 'true');

  detail.dataset.family = element.familia;
  detailFields.number.textContent = element.numero;
  detailFields.symbol.textContent = element.simbolo;
  detailFields.mass.textContent = `Masa · ${element.masa}`;
  detailFields.family.textContent = familyLabel(element.familia);
  detailFields.name.textContent = element.nombre;
  detailFields.atomicNumber.textContent = element.numero;
  detailFields.period.textContent = element.periodo;
  detailFields.group.textContent = element.grupo || '—';
  detailFields.explanation.textContent = explanationFor(element);

  history.replaceState(null, '', `#elemento-${element.numero}`);

  if (options.focus) selectedButton.focus({ preventScroll: true });
  if (options.scroll) selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function navigateFromCell(event, number) {
  const visibleNumbers = ELEMENTOS
    .filter((element) => buttonsByNumber.get(element.numero)?.tabIndex !== -1)
    .map((element) => element.numero);
  const index = visibleNumbers.indexOf(number);
  let targetIndex = null;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    targetIndex = (index + 1) % visibleNumbers.length;
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    targetIndex = (index - 1 + visibleNumbers.length) % visibleNumbers.length;
  }
  if (event.key === 'Home') targetIndex = 0;
  if (event.key === 'End') targetIndex = visibleNumbers.length - 1;
  if (targetIndex === null || !visibleNumbers.length) return;

  event.preventDefault();
  selectElement(visibleNumbers[targetIndex], { focus: true, scroll: true });
}

function selectSearchResult() {
  const firstMatch = ELEMENTOS.find((element) => {
    const familyMatches = activeFamily === 'all' || element.familia === activeFamily;
    return familyMatches && matchesSearch(element, search.value);
  });
  if (firstMatch) selectElement(firstMatch.numero, { focus: true, scroll: true });
}

search.addEventListener('input', applyFilters);
search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    selectSearchResult();
  }
  if (event.key === 'Escape') {
    search.value = '';
    applyFilters();
  }
});

searchClear.addEventListener('click', () => {
  search.value = '';
  search.focus();
  applyFilters();
});

document.getElementById('previousElement').addEventListener('click', () => {
  selectElement(selectedNumber === 1 ? 118 : selectedNumber - 1, { scroll: true });
});

document.getElementById('nextElement').addEventListener('click', () => {
  selectElement(selectedNumber === 118 ? 1 : selectedNumber + 1, { scroll: true });
});

document.querySelector('.site-nav__theme').addEventListener('click', () => {
  if (window.ClasesTheme) window.ClasesTheme.toggle();
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
});

renderAxes();
renderPlaceholders();
renderElements();
renderFilters();

const hashNumber = Number(location.hash.match(/^#elemento-(\d{1,3})$/)?.[1]);
selectElement(hashNumber >= 1 && hashNumber <= 118 ? hashNumber : 1);
applyFilters();
