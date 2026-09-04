(function () {
  'use strict';

  var form = document.querySelector('[data-separation-practice]');
  if (!form) return;

  var source = form.querySelector('[data-separation-cases]');
  var caseNodes = Array.prototype.slice.call(source.querySelectorAll('[data-case-id]'));
  var progress = form.querySelector('[data-separation-progress]');
  var reset = form.querySelector('[data-separation-reset]');
  var check = form.querySelector('[data-separation-check]');
  var validation = form.querySelector('[data-separation-validation]');
  var storageKey = 'tercial:quimica:separacion-mezclas:methods:v1';
  var activeCase = null;
  var assignments = {};
  var validationResults = {};
  var hasValidated = false;

  var methods = [
    { id: 'filtracion', label: 'Filtración', property: 'tamaño de partícula' },
    { id: 'decantacion', label: 'Decantación', property: 'densidad y fases' },
    { id: 'tamizado', label: 'Tamizado', property: 'tamaño entre sólidos' },
    { id: 'imantacion', label: 'Imantación', property: 'magnetismo' },
    { id: 'centrifugacion', label: 'Centrifugación', property: 'densidad' },
    { id: 'evaporacion', label: 'Evaporación', property: 'volatilidad' },
    { id: 'cristalizacion', label: 'Cristalización', property: 'solubilidad' },
    { id: 'destilacion', label: 'Destilación', property: 'ebullición' },
    { id: 'cromatografia', label: 'Cromatografía', property: 'afinidad entre fases' },
    { id: 'sublimacion', label: 'Sublimación', property: 'cambio directo a gas' }
  ];

  var answerKey = {
    'separacion-01': 'imantacion',
    'separacion-02': 'cristalizacion',
    'separacion-03': 'destilacion',
    'separacion-04': 'decantacion',
    'separacion-05': 'cromatografia',
    'separacion-06': 'centrifugacion',
    'separacion-07': 'tamizado',
    'separacion-08': 'sublimacion',
    'separacion-09': 'filtracion',
    'separacion-10': 'cromatografia',
    'separacion-11': 'cristalizacion',
    'separacion-12': 'destilacion',
    'separacion-13': 'imantacion',
    'separacion-14': 'sublimacion',
    'separacion-15': 'filtracion'
  };

  var methodById = methods.reduce(function (index, method) {
    index[method.id] = method;
    return index;
  }, {});

  var cases = caseNodes.map(function (node) {
    return {
      id: node.dataset.caseId,
      number: node.dataset.caseNumber,
      title: node.dataset.caseTitle,
      goal: node.dataset.caseGoal
    };
  });

  var caseById = cases.reduce(function (index, item) {
    index[item.id] = item;
    return index;
  }, {});

  var workbench = document.createElement('section');
  workbench.className = 'method-workbench';
  workbench.setAttribute('data-method-workbench', '');
  workbench.setAttribute('aria-label', 'Mesa de métodos de separación');
  workbench.innerHTML = [
    '<div class="method-workbench__case" data-method-case aria-live="polite" tabindex="-1">',
      '<p class="method-workbench__kicker">Mezcla por resolver · <span data-method-number></span></p>',
      '<h3 class="method-workbench__case-title" data-method-title></h3>',
      '<p class="method-workbench__goal" data-method-goal></p>',
    '</div>',
    '<div class="method-workbench__tools">',
      '<p class="method-workbench__kicker">Elige una herramienta</p>',
      '<div class="method-workbench__method-list" data-method-list></div>',
    '</div>',
    '<div class="method-workbench__history">',
      '<header class="method-workbench__history-header">',
        '<div>',
          '<p class="method-workbench__kicker">Registro</p>',
          '<h3 class="method-workbench__history-title">Decisiones tomadas</h3>',
        '</div>',
        '<span class="method-workbench__history-count" data-history-count>0 de 15</span>',
      '</header>',
      '<div class="method-workbench__history-list" data-history-list>',
        '<p class="method-workbench__empty" data-history-empty>Aún no has elegido ningún método.</p>',
      '</div>',
    '</div>'
  ].join('');

  form.insertBefore(workbench, form.querySelector('.practice-tools'));

  var casePanel = workbench.querySelector('[data-method-case]');
  var caseNumber = workbench.querySelector('[data-method-number]');
  var caseTitle = workbench.querySelector('[data-method-title]');
  var caseGoal = workbench.querySelector('[data-method-goal]');
  var methodList = workbench.querySelector('[data-method-list]');
  var historyList = workbench.querySelector('[data-history-list]');
  var historyEmpty = workbench.querySelector('[data-history-empty]');
  var historyCount = workbench.querySelector('[data-history-count]');

  function readSavedAssignments() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch (_) {
      return {};
    }
  }

  function saveAssignments() {
    try {
      if (Object.keys(assignments).length) {
        localStorage.setItem(storageKey, JSON.stringify(assignments));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (_) {}
  }

  function createMethodButtons() {
    methods.forEach(function (method, index) {
      var button = document.createElement('button');
      button.className = 'method-workbench__method';
      button.type = 'button';
      button.dataset.methodOption = method.id;
      button.innerHTML = [
        '<span class="method-workbench__method-number">', String(index + 1).padStart(2, '0'), '</span>',
        '<span class="method-workbench__method-name">', method.label, '</span>',
        '<span class="method-workbench__method-property">', method.property, '</span>'
      ].join('');
      button.addEventListener('click', function () {
        if (activeCase) chooseMethod(activeCase.id, method.id);
      });
      methodList.appendChild(button);
    });
  }

  function showNextCase(preferredId) {
    var remaining = cases.filter(function (item) { return !assignments[item.id]; });
    activeCase = preferredId && !assignments[preferredId]
      ? caseById[preferredId]
      : remaining[0] || null;

    casePanel.classList.toggle('is-complete', !activeCase);
    workbench.classList.toggle('is-complete', !activeCase);
    methodList.querySelectorAll('[data-method-option]').forEach(function (button) {
      button.disabled = !activeCase;
    });

    if (activeCase) {
      caseNumber.textContent = activeCase.number + ' de ' + cases.length;
      caseTitle.textContent = activeCase.title;
      caseGoal.textContent = activeCase.goal;
    } else {
      caseNumber.textContent = cases.length + ' de ' + cases.length;
      caseTitle.textContent = 'Mesa completa';
      caseGoal.textContent = 'Valida tus decisiones o toca una para cambiarla.';
    }
  }

  function chooseMethod(caseId, methodId) {
    if (!caseById[caseId] || !methodById[methodId]) return;
    assignments[caseId] = methodId;
    delete validationResults[caseId];
    saveAssignments();
    showNextCase();
    renderHistory();
    updateProgress();
    if (hasValidated && Object.keys(assignments).length === cases.length) validateResponses();
    casePanel.focus();
  }

  function reviseCase(caseId) {
    if (!assignments[caseId]) return;
    delete assignments[caseId];
    delete validationResults[caseId];
    saveAssignments();
    showNextCase(caseId);
    renderHistory();
    updateProgress();
    if (hasValidated) validation.textContent = 'Elige otro método y vuelve a validar.';
    casePanel.focus();
  }

  function renderHistory() {
    historyList.querySelectorAll('[data-history-case]').forEach(function (item) { item.remove(); });
    var answered = 0;

    cases.forEach(function (item) {
      var methodId = assignments[item.id];
      if (!methodId) return;
      answered += 1;
      var method = methodById[methodId];
      var result = validationResults[item.id];
      var button = document.createElement('button');
      button.className = 'method-workbench__history-item';
      if (result === true) button.classList.add('is-correct');
      if (result === false) button.classList.add('is-review');
      button.type = 'button';
      button.dataset.historyCase = item.id;
      button.innerHTML = [
        '<span class="method-workbench__history-number">', item.number, '</span>',
        '<span class="method-workbench__history-case">', item.title, '</span>',
        '<span class="method-workbench__history-method">', method.label, '</span>',
        result === true ? '<span class="method-workbench__history-result">✓ Correcta</span>' : '',
        result === false ? '<span class="method-workbench__history-result">× Revisa</span>' : ''
      ].join('');
      button.setAttribute('aria-label', item.number + '. ' + item.title + '. Método elegido: ' +
        method.label + '. Toca para cambiarlo.');
      button.addEventListener('click', function () { reviseCase(item.id); });
      historyList.appendChild(button);
    });

    historyEmpty.hidden = answered > 0;
    historyCount.textContent = answered + ' de ' + cases.length;
  }

  function updateProgress() {
    var answered = Object.keys(assignments).length;
    var remaining = cases.length - answered;
    progress.textContent = answered + ' de ' + cases.length +
      ' resueltas · guardado en este dispositivo';
    reset.disabled = answered === 0;
    check.disabled = answered !== cases.length;

    if (!hasValidated) {
      validation.textContent = remaining === 0
        ? 'Ya puedes validar tus decisiones.'
        : remaining === 1
          ? 'Queda 1 mezcla por resolver.'
          : 'Quedan ' + remaining + ' mezclas por resolver.';
    }
  }

  function validateResponses() {
    var correct = 0;
    hasValidated = true;
    validationResults = {};

    cases.forEach(function (item) {
      var isCorrect = answerKey[item.id] === assignments[item.id];
      validationResults[item.id] = isCorrect;
      if (isCorrect) correct += 1;
    });

    renderHistory();
    validation.textContent = correct + ' de ' + cases.length +
      ' correctas. Toca las marcadas para cambiar el método.';
    validation.classList.add('has-result');
  }

  function restoreAssignments() {
    var saved = readSavedAssignments();
    cases.forEach(function (item) {
      if (methodById[saved[item.id]]) assignments[item.id] = saved[item.id];
    });
  }

  createMethodButtons();
  restoreAssignments();
  showNextCase();
  renderHistory();
  updateProgress();

  reset.addEventListener('click', function () {
    assignments = {};
    validationResults = {};
    hasValidated = false;
    validation.classList.remove('has-result');
    try { localStorage.removeItem(storageKey); } catch (_) {}
    showNextCase();
    renderHistory();
    updateProgress();
  });

  check.addEventListener('click', validateResponses);
})();
