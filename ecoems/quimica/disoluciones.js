const calculator = document.querySelector('#solutionCalculator');
const soluteInput = document.querySelector('#soluteMass');
const solventInput = document.querySelector('#solventMass');
const result = document.querySelector('#solutionResult');

const numberFormat = new Intl.NumberFormat('es-MX', {
  maximumFractionDigits: 2
});

calculator?.addEventListener('submit', (event) => {
  event.preventDefault();

  const solute = soluteInput.valueAsNumber;
  const solvent = solventInput.valueAsNumber;

  if (!Number.isFinite(solute) || !Number.isFinite(solvent) || solute < 0 || solvent < 0) {
    result.textContent = 'Escribe dos masas válidas, iguales o mayores que cero.';
    return;
  }

  const solution = solute + solvent;
  if (solution === 0) {
    result.textContent = 'La masa total debe ser mayor que cero.';
    return;
  }

  const percentage = (solute / solution) * 100;
  result.textContent = `Masa total: ${numberFormat.format(solution)} · Concentración: ${numberFormat.format(percentage)} % m/m`;
});

const practice = document.querySelector('[data-solution-practice]');

if (practice) {
  const storageKey = 'tercial-ecoems-disoluciones-v1';
  const problems = [
    {
      prompt: 'Se disuelven 23 g de KOH en 400 g de agua. ¿Cuál es la concentración % m/m?',
      expected: 23 / 423 * 100
    },
    {
      prompt: 'Una disolución de 5 000 g contiene 456 g de soluto. ¿Cuál es su concentración % m/m?',
      expected: 456 / 5000 * 100
    },
    {
      prompt: 'Se mezclan 55 g de soluto con 300 g de disolvente. ¿Cuál es la concentración % m/m?',
      expected: 55 / 355 * 100
    },
    {
      prompt: 'Una disolución contiene 34 g de soluto y 200 g de disolvente. ¿Cuál es la concentración % m/m?',
      expected: 34 / 234 * 100
    },
    {
      prompt: 'Se agregan 234 g de soluto a 500 g de disolvente. ¿Cuál es la concentración % m/m?',
      expected: 234 / 734 * 100
    }
  ];
  const tolerance = 0.05;
  const indexLabel = practice.querySelector('[data-solution-index]');
  const prompt = practice.querySelector('[data-solution-prompt]');
  const answer = practice.querySelector('[data-solution-answer]');
  const status = practice.querySelector('[data-solution-status]');
  const progress = practice.querySelector('[data-solution-progress]');
  const validation = practice.querySelector('[data-solution-validation]');
  const previousButton = practice.querySelector('[data-solution-prev]');
  const nextButton = practice.querySelector('[data-solution-next]');
  const checkButton = practice.querySelector('[data-solution-check]');
  const validateButton = practice.querySelector('[data-solution-validate]');
  const resetButton = practice.querySelector('[data-solution-reset]');
  const stepButtons = [...practice.querySelectorAll('[data-solution-step]')];
  let currentIndex = 0;
  let answers = loadAnswers();
  let reviewed = problems.map(() => null);

  function loadAnswers() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(saved) && saved.length === problems.length) {
        return saved.map((value) => typeof value === 'string' ? value : '');
      }
    } catch (_) {}
    return problems.map(() => '');
  }

  function persistAnswers() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch (_) {}
  }

  function parseAnswer(value) {
    const normalized = String(value).trim().replace(',', '.');
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function isCorrect(index) {
    const parsed = parseAnswer(answers[index]);
    return parsed !== null && Math.abs(parsed - problems[index].expected) <= tolerance;
  }

  function saveCurrentAnswer() {
    answers[currentIndex] = answer.value.trim();
    persistAnswers();
    updateProgress();
  }

  function reportProgress(answered) {
    if (!window.TercialProgress) return;
    window.TercialProgress.recordProgress({ completed: answered, total: problems.length });
  }

  function reportResult(correct, errorIds) {
    if (!window.TercialProgress) return;
    window.TercialProgress.recordResult({
      correct,
      total: problems.length,
      errorIds
    });
  }

  function updateProgress() {
    const answered = answers.filter((value) => parseAnswer(value) !== null).length;
    progress.textContent = `${answered} de ${problems.length} respondidos`;
    resetButton.disabled = answers.every((value) => value === '');
    reportProgress(answered);
  }

  function renderStatus() {
    status.classList.remove('is-review', 'is-correct');
    if (reviewed[currentIndex] === 'missing') {
      status.textContent = 'Escribe un resultado antes de comprobarlo.';
      status.classList.add('is-review');
    } else if (reviewed[currentIndex] === 'correct') {
      status.textContent = 'Correcto.';
      status.classList.add('is-correct');
    } else if (reviewed[currentIndex] === 'review') {
      status.textContent = 'Revisa este cálculo.';
      status.classList.add('is-review');
    } else {
      status.textContent = '';
    }
  }

  function updateSteps() {
    stepButtons.forEach((button, index) => {
      const state = reviewed[index];
      const displayIndex = String(index + 1).padStart(2, '0');
      button.classList.toggle('is-current', index === currentIndex);
      button.classList.toggle('has-answer', parseAnswer(answers[index]) !== null);
      button.classList.toggle('is-correct', state === 'correct');
      button.classList.toggle('is-review', state === 'review');
      button.classList.toggle('is-missing', state === 'missing');

      if (index === currentIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');

      const resultLabel = state === 'correct'
        ? ', correcto'
        : state === 'review'
          ? ', por revisar'
          : state === 'missing'
            ? ', sin respuesta'
            : parseAnswer(answers[index]) !== null
              ? ', respondido'
              : '';
      button.setAttribute('aria-label', `Ir al problema ${displayIndex}${resultLabel}`);
    });
  }

  function checkCurrentAnswer() {
    saveCurrentAnswer();
    if (parseAnswer(answers[currentIndex]) === null) {
      reviewed[currentIndex] = 'missing';
    } else {
      reviewed[currentIndex] = isCorrect(currentIndex) ? 'correct' : 'review';
    }
    renderStatus();
    updateSteps();
  }

  function formatProblemList(indices) {
    const numbers = indices.map((index) => String(index + 1).padStart(2, '0'));
    if (numbers.length < 2) return numbers[0] || '';
    return `${numbers.slice(0, -1).join(', ')} y ${numbers.at(-1)}`;
  }

  function renderProblem(shouldFocus = false) {
    const displayIndex = String(currentIndex + 1).padStart(2, '0');
    const displayTotal = String(problems.length).padStart(2, '0');
    indexLabel.textContent = `Problema ${displayIndex} de ${displayTotal}`;
    prompt.textContent = problems[currentIndex].prompt;
    answer.value = answers[currentIndex];
    previousButton.disabled = currentIndex === 0;
    nextButton.textContent = currentIndex === problems.length - 1
      ? 'Guardar respuesta'
      : 'Guardar y continuar →';
    updateProgress();
    renderStatus();
    updateSteps();
    if (shouldFocus) prompt.focus({ preventScroll: true });
  }

  answer.addEventListener('input', () => {
    answers[currentIndex] = answer.value.trim();
    reviewed[currentIndex] = null;
    persistAnswers();
    renderStatus();
    validation.textContent = '';
    validation.classList.remove('has-result');
    updateProgress();
    updateSteps();
  });

  practice.addEventListener('submit', (event) => {
    event.preventDefault();
    saveCurrentAnswer();
    if (currentIndex < problems.length - 1) {
      currentIndex += 1;
      renderProblem(true);
    } else {
      status.textContent = 'Respuesta guardada.';
    }
  });

  previousButton.addEventListener('click', () => {
    saveCurrentAnswer();
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderProblem(true);
    }
  });

  checkButton.addEventListener('click', () => {
    checkCurrentAnswer();
  });

  stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
      saveCurrentAnswer();
      currentIndex = Number(button.dataset.solutionStep);
      renderProblem(true);
    });
  });

  validateButton.addEventListener('click', () => {
    saveCurrentAnswer();
    reviewed = problems.map((_, index) => {
      if (parseAnswer(answers[index]) === null) return 'missing';
      return isCorrect(index) ? 'correct' : 'review';
    });
    const missingIndices = reviewed.flatMap((state, index) => state === 'missing' ? [index] : []);
    const reviewIndices = reviewed.flatMap((state, index) => state === 'review' ? [index] : []);
    const correct = reviewed.filter((state) => state === 'correct').length;
    const errorIds = reviewed.flatMap((state, index) => state === 'review' ? [`disolucion-${index + 1}`] : []);
    renderStatus();
    updateSteps();

    validation.classList.add('has-result');
    if (missingIndices.length > 0) {
      validation.textContent = `Falta responder ${missingIndices.length === 1 ? 'el problema' : 'los problemas'} ${formatProblemList(missingIndices)}.`;
    } else if (correct === problems.length) {
      validation.textContent = 'Los cinco resultados son correctos.';
    } else {
      validation.textContent = `Revisa ${reviewIndices.length === 1 ? 'el problema' : 'los problemas'} ${formatProblemList(reviewIndices)}.`;
    }
    if (missingIndices.length === 0) reportResult(correct, errorIds);
  });

  resetButton.addEventListener('click', () => {
    answers = problems.map(() => '');
    reviewed = problems.map(() => null);
    currentIndex = 0;
    try { localStorage.removeItem(storageKey); } catch (_) {}
    if (window.TercialProgress) window.TercialProgress.resetCurrentAttempt();
    validation.textContent = '';
    validation.classList.remove('has-result');
    renderProblem(true);
  });

  renderProblem();
}
