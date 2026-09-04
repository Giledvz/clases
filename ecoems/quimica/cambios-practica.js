(function () {
  'use strict';

  var form = document.querySelector('[data-practice-form]');
  if (!form) return;

  var storageKey = 'tercial:quimica:cambios-materia:practica:v1';
  var responses = Array.prototype.slice.call(form.querySelectorAll('[data-response]'));
  var progress = form.querySelector('[data-practice-progress]');
  var reset = form.querySelector('[data-practice-reset]');
  var check = form.querySelector('[data-practice-check]');
  var validation = form.querySelector('[data-practice-validation]');
  var hasValidated = false;
  var answerKey = {
    'cambio-01': 'Químico',
    'cambio-02': 'Químico',
    'cambio-03': 'Físico',
    'cambio-04': 'Físico',
    'cambio-05': 'Químico',
    'cambio-06': 'Físico',
    'cambio-07': 'Físico',
    'cambio-08': 'Químico',
    'cambio-09': 'Físico',
    'cambio-10': 'Físico',
    'cambio-11': 'Físico',
    'cambio-12': 'Químico'
  };

  function buildTercialChoices(field) {
    var sourceLabel = form.querySelector('label[for="' + field.id + '"]');
    var choices = document.createElement('fieldset');
    var legend = document.createElement('legend');
    var list = document.createElement('div');

    choices.className = 'exercise__choices';
    legend.className = 'exercise__response-label';
    legend.textContent = sourceLabel ? sourceLabel.textContent : 'Tu respuesta';
    list.className = 'exercise__choices-list';

    Array.prototype.slice.call(field.options, 1).forEach(function (option, index) {
      var choice = document.createElement('label');
      var input = document.createElement('input');
      var mark = document.createElement('span');
      var choiceText = document.createElement('span');

      choice.className = 'exercise__choice';
      input.className = 'visually-hidden';
      input.type = 'radio';
      input.name = 'opcion-' + field.name;
      input.value = option.value || option.textContent;
      input.checked = field.value === input.value;
      input.setAttribute('aria-label', option.textContent);
      input.id = field.id + '-opcion-' + (index + 1);
      mark.className = 'exercise__choice-mark';
      mark.setAttribute('aria-hidden', 'true');
      choiceText.className = 'exercise__choice-text';
      choiceText.textContent = option.textContent;

      input.addEventListener('change', function () {
        if (!input.checked) return;
        field.value = input.value;
        saveResponses();
        if (hasValidated) validateResponses();
      });

      choice.appendChild(input);
      choice.appendChild(mark);
      choice.appendChild(choiceText);
      list.appendChild(choice);
    });

    choices.appendChild(legend);
    choices.appendChild(list);
    field.insertAdjacentElement('afterend', choices);
    field.hidden = true;
    if (sourceLabel) sourceLabel.hidden = true;
  }

  function readSavedResponses() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveResponses() {
    var saved = {};
    responses.forEach(function (field) {
      if (field.value) saved[field.name] = field.value;
    });

    try {
      if (Object.keys(saved).length) localStorage.setItem(storageKey, JSON.stringify(saved));
      else localStorage.removeItem(storageKey);
    } catch (_) {}

    updateProgress();
  }

  function updateProgress() {
    var answered = responses.filter(function (field) { return Boolean(field.value); }).length;
    progress.textContent = answered + ' de ' + responses.length +
      ' respondidas · guardado en este dispositivo';
    reset.disabled = answered === 0;
    check.disabled = answered !== responses.length;
    if (!hasValidated) {
      validation.textContent = answered === responses.length
        ? 'Ya puedes validar tus respuestas.'
        : 'Completa las 12 situaciones para validar.';
    }
  }

  function validateResponses() {
    var correct = 0;
    hasValidated = true;

    responses.forEach(function (field) {
      var exercise = field.closest('.exercise');
      var summary = exercise.querySelector('.exercise__summary');
      var result = summary.querySelector('.exercise__result');
      var isCorrect = answerKey[field.name] === field.value;

      if (!result) {
        result = document.createElement('span');
        result.className = 'exercise__result';
        summary.insertBefore(result, summary.querySelector('.exercise__chevron'));
      }

      result.textContent = isCorrect ? '✓ Correcta' : '× Revisa';
      result.classList.toggle('is-review', !isCorrect);
      if (isCorrect) correct += 1;
    });

    validation.textContent = correct + ' de ' + responses.length +
      ' correctas. Revisa las marcadas y vuelve a intentarlo.';
    validation.classList.add('has-result');
  }

  var saved = readSavedResponses();
  responses.forEach(function (field) {
    if (typeof saved[field.name] === 'string') field.value = saved[field.name];
    field.addEventListener('change', saveResponses);
    buildTercialChoices(field);
  });

  reset.addEventListener('click', function () {
    form.reset();
    hasValidated = false;
    responses.forEach(function (field) { field.value = ''; });
    form.querySelectorAll('.exercise__choices input').forEach(function (input) {
      input.checked = false;
    });
    form.querySelectorAll('.exercise__result').forEach(function (result) {
      result.remove();
    });
    validation.classList.remove('has-result');
    try { localStorage.removeItem(storageKey); } catch (_) {}
    updateProgress();
  });

  check.addEventListener('click', validateResponses);
  updateProgress();
})();
