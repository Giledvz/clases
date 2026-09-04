(function () {
  'use strict';

  var form = document.querySelector('[data-practice-form]');
  if (!form) return;

  var exerciseList = form.querySelector('.exercise-list');
  var responses = Array.prototype.slice.call(form.querySelectorAll('[data-response]'));
  var progress = form.querySelector('[data-practice-progress]');
  var reset = form.querySelector('[data-practice-reset]');
  var check = form.querySelector('[data-practice-check]');
  var validation = form.querySelector('[data-practice-validation]');
  var storageKey = 'tercial:quimica:clasificacion-materia:buckets:v2';
  var hasValidated = false;
  var activeItem = null;
  var pointerDrag = null;
  var dragPreview = null;
  var suppressClickUntil = 0;
  var assignments = {};

  var categories = [
    {
      id: 'elemento',
      label: 'Elemento',
      description: 'Un solo tipo de átomo.'
    },
    {
      id: 'compuesto',
      label: 'Compuesto',
      description: 'Elementos unidos en proporción fija.'
    },
    {
      id: 'mezcla-homogenea',
      label: 'Mezcla homogénea',
      description: 'Una sola fase visible.'
    },
    {
      id: 'mezcla-heterogenea',
      label: 'Mezcla heterogénea',
      description: 'Componentes o fases distinguibles.'
    }
  ];

  var answerKey = {
    'clasificacion-01': 'compuesto',
    'clasificacion-02': 'elemento',
    'clasificacion-03': 'mezcla-heterogenea',
    'clasificacion-04': 'mezcla-homogenea',
    'clasificacion-05': 'elemento',
    'clasificacion-06': 'mezcla-homogenea',
    'clasificacion-07': 'compuesto',
    'clasificacion-08': 'elemento',
    'clasificacion-09': 'elemento',
    'clasificacion-10': 'mezcla-homogenea',
    'clasificacion-11': 'elemento',
    'clasificacion-12': 'compuesto',
    'clasificacion-13': 'elemento',
    'clasificacion-14': 'compuesto',
    'clasificacion-15': 'compuesto',
    'clasificacion-16': 'compuesto',
    'clasificacion-17': 'mezcla-homogenea',
    'clasificacion-18': 'compuesto',
    'clasificacion-19': 'compuesto',
    'clasificacion-20': 'mezcla-homogenea',
    'clasificacion-21': 'mezcla-heterogenea',
    'clasificacion-22': 'elemento',
    'clasificacion-23': 'mezcla-homogenea',
    'clasificacion-24': 'mezcla-heterogenea',
    'clasificacion-25': 'mezcla-heterogenea',
    'clasificacion-26': 'compuesto',
    'clasificacion-27': 'compuesto',
    'clasificacion-28': 'mezcla-heterogenea',
    'clasificacion-29': 'compuesto',
    'clasificacion-30': 'mezcla-homogenea'
  };

  var categoryById = categories.reduce(function (index, category) {
    index[category.id] = category;
    return index;
  }, {});

  var fieldById = responses.reduce(function (index, field) {
    index[field.name] = field;
    return index;
  }, {});

  var sorter = document.createElement('div');
  sorter.className = 'classification-sorter';
  sorter.setAttribute('data-classification-sorter', '');
  sorter.innerHTML = [
    '<div class="classification-sorter__stage" tabindex="-1" data-sorter-stage>',
      '<div class="classification-sorter__stage-copy">',
        '<p class="classification-sorter__kicker">Por clasificar</p>',
        '<p class="classification-sorter__instruction">Toca un bucket o arrastra la situación hasta él.</p>',
      '</div>',
      '<div class="classification-sorter__source" data-sorter-source aria-live="polite"></div>',
      '<p class="classification-sorter__complete" data-sorter-complete hidden>Ya colocaste las 30 situaciones. Ahora puedes validar o mover cualquiera tocándola.</p>',
    '</div>',
    '<div class="classification-sorter__buckets" data-sorter-buckets></div>'
  ].join('');

  exerciseList.insertAdjacentElement('beforebegin', sorter);

  var stage = sorter.querySelector('[data-sorter-stage]');
  var stageKicker = sorter.querySelector('.classification-sorter__kicker');
  var stageInstruction = sorter.querySelector('.classification-sorter__instruction');
  var source = sorter.querySelector('[data-sorter-source]');
  var complete = sorter.querySelector('[data-sorter-complete]');
  var buckets = sorter.querySelector('[data-sorter-buckets]');
  var items = [];
  var itemById = {};

  function createBuckets() {
    categories.forEach(function (category) {
      var bucket = document.createElement('section');
      bucket.className = 'classification-bucket';
      bucket.dataset.bucket = category.id;
      bucket.setAttribute('aria-labelledby', 'bucket-title-' + category.id);
      bucket.innerHTML = [
        '<header class="classification-bucket__header">',
          '<div>',
            '<h3 class="classification-bucket__title" id="bucket-title-', category.id, '">', category.label, '</h3>',
            '<p class="classification-bucket__description">', category.description, '</p>',
          '</div>',
          '<span class="classification-bucket__count" data-bucket-count>0</span>',
          '<button class="classification-bucket__target" type="button" data-bucket-target="', category.id, '">Colocar aquí →</button>',
        '</header>',
        '<div class="classification-bucket__list" data-bucket-list="', category.id, '">',
          '<p class="classification-bucket__empty" data-bucket-empty>Aún vacío</p>',
        '</div>'
      ].join('');

      var target = bucket.querySelector('[data-bucket-target]');
      target.setAttribute('aria-label', 'Colocar la situación actual en ' + category.label);
      target.addEventListener('click', function () {
        if (activeItem) assignItem(activeItem.dataset.sortItem, category.id, true);
      });

      buckets.appendChild(bucket);
    });
  }

  function clearDragover() {
    sorter.querySelectorAll('.classification-bucket.is-dragover').forEach(function (bucket) {
      bucket.classList.remove('is-dragover');
    });
  }

  function bucketAtPoint(x, y) {
    var target = document.elementFromPoint(x, y);
    return target ? target.closest('[data-bucket]') : null;
  }

  function moveTouchPreview(x, y) {
    if (!dragPreview) return;
    dragPreview.style.left = x + 'px';
    dragPreview.style.top = y + 'px';

    clearDragover();
    var bucket = bucketAtPoint(x, y);
    if (bucket) bucket.classList.add('is-dragover');

    var edge = 72;
    if (y < edge) window.scrollBy(0, -12);
    if (y > window.innerHeight - edge) window.scrollBy(0, 12);
  }

  function beginPointerDrag(item, event) {
    if (!event.isPrimary || event.button > 0) return;
    pointerDrag = {
      id: item.dataset.sortItem,
      item: item,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false
    };
    try { item.setPointerCapture(event.pointerId); } catch (_) {}
  }

  function continuePointerDrag(event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    var distance = Math.hypot(
      event.clientX - pointerDrag.startX,
      event.clientY - pointerDrag.startY
    );
    if (!pointerDrag.moved && distance < 8) return;

    if (!pointerDrag.moved) {
      pointerDrag.moved = true;
      suppressClickUntil = Date.now() + 700;
      pointerDrag.item.classList.add('is-dragging');
      dragPreview = pointerDrag.item.cloneNode(true);
      dragPreview.removeAttribute('data-sort-item');
      dragPreview.removeAttribute('aria-label');
      dragPreview.removeAttribute('hidden');
      dragPreview.classList.remove('is-placed', 'is-correct', 'is-review', 'is-dragging');
      dragPreview.classList.add('classification-sorter__drag-preview');
      dragPreview.querySelectorAll('.classification-sorter__result').forEach(function (result) {
        result.remove();
      });
      dragPreview.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
      document.body.appendChild(dragPreview);
    }

    event.preventDefault();
    moveTouchPreview(event.clientX, event.clientY);
  }

  function finishPointerDrag(event, cancelled) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    var item = pointerDrag.item;
    var id = pointerDrag.id;
    var moved = pointerDrag.moved;
    var bucket = moved && !cancelled ? bucketAtPoint(event.clientX, event.clientY) : null;

    if (moved) {
      suppressClickUntil = Date.now() + 700;
      event.preventDefault();
    }
    try { item.releasePointerCapture(event.pointerId); } catch (_) {}
    item.classList.remove('is-dragging');
    if (dragPreview) dragPreview.remove();
    dragPreview = null;
    pointerDrag = null;
    clearDragover();

    if (bucket) assignItem(id, bucket.dataset.bucket, true);
  }

  function createItems() {
    responses.forEach(function (field) {
      var exercise = field.closest('.exercise');
      var number = exercise.querySelector('.exercise__num').textContent.trim();
      var statement = exercise.querySelector('.exercise__text');
      var item = document.createElement('button');

      item.className = 'classification-sorter__item';
      item.type = 'button';
      item.dataset.sortItem = field.name;
      item.innerHTML = [
        '<span class="classification-sorter__item-number">', number, '</span>',
        '<span class="classification-sorter__item-label">', statement.innerHTML, '</span>'
      ].join('');
      item.setAttribute('aria-label', number + '. ' + statement.textContent.trim() + '. Sin clasificar.');

      item.addEventListener('click', function () {
        if (Date.now() < suppressClickUntil) return;
        if (item.classList.contains('is-placed')) unassignItem(item.dataset.sortItem, true);
      });
      item.addEventListener('pointerdown', function (event) {
        beginPointerDrag(item, event);
      });
      item.addEventListener('pointermove', continuePointerDrag);
      item.addEventListener('pointerup', function (event) {
        finishPointerDrag(event, false);
      });
      item.addEventListener('pointercancel', function (event) {
        finishPointerDrag(event, true);
      });

      items.push(item);
      itemById[field.name] = item;
      source.appendChild(item);
    });
  }

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

  function updateItemLabel(item, categoryId) {
    var text = item.querySelector('.classification-sorter__item-label').textContent.trim();
    var number = item.querySelector('.classification-sorter__item-number').textContent.trim();
    var category = categoryById[categoryId];
    item.setAttribute('aria-label', number + '. ' + text + '. ' +
      (category ? 'Colocada en ' + category.label + '. Toca para moverla.' : 'Sin clasificar.'));
  }

  function clearResult(item) {
    item.classList.remove('is-correct', 'is-review');
    var result = item.querySelector('.classification-sorter__result');
    if (result) result.remove();
  }

  function showNextItem(preferredId) {
    var remaining = items.filter(function (item) {
      return !assignments[item.dataset.sortItem];
    });
    var next = preferredId ? itemById[preferredId] : remaining[0];
    if (!next || assignments[next.dataset.sortItem]) next = remaining[0] || null;

    remaining.forEach(function (item) { item.hidden = item !== next; });
    activeItem = next;
    complete.hidden = Boolean(next);
    source.hidden = !next;
    sorter.classList.toggle('is-complete', !next);
    stageKicker.textContent = next ? 'Por clasificar' : 'Clasificación completa';
    stageInstruction.textContent = next
      ? 'Toca un bucket o arrastra la situación hasta él.'
      : items.length + ' de ' + items.length + ' situaciones colocadas.';
    sorter.querySelectorAll('[data-bucket-target]').forEach(function (target) {
      target.hidden = !next;
    });
  }

  function assignItem(id, categoryId, shouldFocus) {
    var item = itemById[id];
    var field = fieldById[id];
    var category = categoryById[categoryId];
    var list = sorter.querySelector('[data-bucket-list="' + categoryId + '"]');
    if (!item || !field || !category || !list) return;

    assignments[id] = categoryId;
    field.value = category.label;
    item.hidden = false;
    item.classList.add('is-placed');
    clearResult(item);
    updateItemLabel(item, categoryId);
    list.appendChild(item);
    activeItem = null;

    saveAssignments();
    showNextItem();
    updateProgress();
    updateBuckets();
    if (hasValidated && Object.keys(assignments).length === items.length) validateResponses();
    if (shouldFocus && activeItem) stage.focus({ preventScroll: true });
  }

  function unassignItem(id, shouldFocus) {
    var item = itemById[id];
    var field = fieldById[id];
    if (!item || !field || !assignments[id]) return;

    delete assignments[id];
    field.value = '';
    item.classList.remove('is-placed');
    clearResult(item);
    updateItemLabel(item, '');
    source.prepend(item);
    showNextItem(id);
    saveAssignments();
    updateProgress();
    updateBuckets();
    if (hasValidated) {
      validation.textContent = 'Vuelve a colocar la situación para validar de nuevo.';
    }
    if (shouldFocus) stage.focus({ preventScroll: true });
  }

  function updateBuckets() {
    categories.forEach(function (category) {
      var bucket = sorter.querySelector('[data-bucket="' + category.id + '"]');
      var list = bucket.querySelector('[data-bucket-list]');
      var count = list.querySelectorAll('[data-sort-item]').length;
      bucket.querySelector('[data-bucket-count]').textContent = String(count);
      bucket.querySelector('[data-bucket-empty]').hidden = count > 0;
    });
  }

  function reportProgress(answered) {
    if (!window.TercialProgress) return;
    window.TercialProgress.recordProgress({ completed: answered, total: items.length });
  }

  function reportResult(correct, errorIds) {
    if (!window.TercialProgress) return;
    window.TercialProgress.recordResult({
      correct: correct,
      total: items.length,
      errorIds: errorIds
    });
  }

  function updateProgress() {
    var answered = Object.keys(assignments).length;
    progress.textContent = answered + ' de ' + items.length +
      ' clasificadas · guardado en este dispositivo';
    reset.disabled = answered === 0;
    check.disabled = answered !== items.length;
    if (!hasValidated) {
      var remaining = items.length - answered;
      validation.textContent = answered === items.length
        ? 'Ya puedes validar la clasificación.'
        : remaining === 1
          ? 'Queda 1 situación por clasificar.'
          : 'Quedan ' + remaining + ' situaciones por clasificar.';
    }
    reportProgress(answered);
  }

  function validateResponses() {
    var correct = 0;
    var errorIds = [];
    hasValidated = true;

    items.forEach(function (item) {
      var id = item.dataset.sortItem;
      var isCorrect = answerKey[id] === assignments[id];
      var result = item.querySelector('.classification-sorter__result');

      if (!result) {
        result = document.createElement('span');
        result.className = 'classification-sorter__result';
        item.appendChild(result);
      }

      result.textContent = isCorrect ? '✓ Correcta' : '× Revisa';
      item.classList.toggle('is-correct', isCorrect);
      item.classList.toggle('is-review', !isCorrect);
      if (isCorrect) correct += 1;
      else errorIds.push(id);
    });

    validation.textContent = correct + ' de ' + items.length +
      ' correctas. Toca las marcadas para volver a colocarlas.';
    validation.classList.add('has-result');
    reportResult(correct, errorIds);
  }

  function restoreAssignments() {
    var saved = readSavedAssignments();
    items.forEach(function (item) {
      var id = item.dataset.sortItem;
      var categoryId = saved[id];
      if (categoryById[categoryId]) assignItem(id, categoryId, false);
    });
  }

  createBuckets();
  createItems();
  restoreAssignments();
  exerciseList.hidden = true;
  form.classList.add('classification-sorter-ready');
  showNextItem();
  updateBuckets();
  updateProgress();

  reset.addEventListener('click', function () {
    form.reset();
    assignments = {};
    hasValidated = false;
    validation.classList.remove('has-result');
    items.forEach(function (item) {
      item.classList.remove('is-placed');
      clearResult(item);
      updateItemLabel(item, '');
      source.appendChild(item);
    });
    try { localStorage.removeItem(storageKey); } catch (_) {}
    if (window.TercialProgress) window.TercialProgress.resetCurrentAttempt();
    showNextItem();
    updateBuckets();
    updateProgress();
  });

  check.addEventListener('click', validateResponses);
})();
