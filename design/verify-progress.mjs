import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const values = new Map();
const events = [];
const window = {
  location: { pathname: '/tercial/ecoems/quimica/estados-agregacion.html' },
  localStorage: {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); }
  },
  document: {
    title: 'Prueba · Tercial',
    querySelector() { return null; }
  },
  CustomEvent: class CustomEvent {
    constructor(type, options) {
      this.type = type;
      this.detail = options?.detail;
    }
  },
  dispatchEvent(event) { events.push(event); }
};

const context = vm.createContext({ window, Date, JSON, Object, Number, Math, TypeError, Error });
vm.runInContext(fs.readFileSync('assets/js/progress.js', 'utf8'), context, {
  filename: 'assets/js/progress.js'
});

const progress = window.TercialProgress;
assert.ok(progress, 'El API no quedó expuesto como window.TercialProgress');
assert.equal(progress.version, 1, 'La versión del esquema debe iniciar en 1');

const states = {
  id: 'ecoems-quimica-estados-agregacion',
  title: 'Estados de agregación',
  subject: 'quimica',
  topic: 'materiales',
  kind: 'lesson',
  path: '/tercial/ecoems/quimica/estados-agregacion.html'
};

progress.clearAll();
const visited = progress.recordVisit(states);
assert.equal(visited.visitCount, 1, 'La primera visita no se registró');
assert.equal(visited.status, 'started', 'Una visita nueva debe iniciar el recurso');

const partial = progress.recordProgress({ completed: 3, total: 20 });
assert.deepEqual(
  JSON.parse(JSON.stringify(partial.progress)),
  { completed: 3, total: 20, percent: 15, updatedAt: partial.progress.updatedAt },
  'El avance parcial se calculó incorrectamente'
);
assert.equal(partial.status, 'in_progress', 'Una respuesta parcial debe marcar avance en curso');

const firstResult = progress.recordResult({
  correct: 16,
  total: 20,
  errorIds: ['estado-02', 'estado-06', 'estado-11', 'estado-18']
});
assert.equal(firstResult.status, 'completed', 'Validar debe completar el intento');
assert.equal(firstResult.latestResult.percent, 80, 'El porcentaje del intento es incorrecto');
assert.equal(firstResult.latestResult.errorIds.length, 4, 'No se guardaron los errores');

const lowerResult = progress.recordResult({ correct: 12, total: 20 });
assert.equal(lowerResult.latestResult.percent, 60, 'El intento más reciente no se actualizó');
assert.equal(lowerResult.bestResult.percent, 80, 'Un intento menor reemplazó la mejor marca');

const summary = progress.getSubjectSummary('quimica');
assert.deepEqual(
  JSON.parse(JSON.stringify(summary)),
  { subject: 'quimica', resources: 1, completed: 1, attempts: 1, accuracy: 60 },
  'El resumen de materia no coincide con el último intento'
);

const reset = progress.resetCurrentAttempt();
assert.equal(reset.status, 'started', 'Reiniciar no regresó el recurso a su estado inicial');
assert.equal(reset.progress.completed, 0, 'Reiniciar no limpió el avance actual');
assert.equal(reset.latestResult, undefined, 'Reiniciar conservó el resultado del intento actual');
assert.equal(reset.bestResult.percent, 80, 'Reiniciar borró la mejor marca histórica');

progress.recordVisit({
  id: 'ecoems-quimica-cambios-materia',
  title: 'Cambios físicos y químicos',
  subject: 'quimica',
  topic: 'materiales',
  kind: 'lesson',
  path: '/tercial/ecoems/quimica/cambios-materia.html'
});
assert.equal(progress.getContinueActivity().id, 'ecoems-quimica-cambios-materia',
  'Continuar no devolvió la actividad pendiente más reciente');

assert.ok(events.some((event) => event.type === 'tercial:progresschange'),
  'Los cambios no emiten el evento para futuras interfaces');

values.set(progress.storageKey, '{almacenamiento roto');
assert.deepEqual(
  JSON.parse(JSON.stringify(progress.getSnapshot())),
  JSON.parse(JSON.stringify(progress.getSnapshot())),
  'El almacenamiento dañado no se recuperó de forma estable'
);

assert.throws(() => progress.recordVisit({ id: '__proto__' }), /id estable/,
  'El API aceptó un identificador inseguro');

console.log('  ✅ visitas, avance, resultados y errores persisten en un esquema común');
console.log('  ✅ la mejor marca sobrevive al reinicio del intento actual');
console.log('  ✅ continuar y el resumen por materia quedan listos para la futura interfaz');
