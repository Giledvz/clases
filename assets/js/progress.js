/*
 * progress.js — memoria común de avance de Tercial
 *
 * Fase 1: guarda el avance sólo en este dispositivo. La estructura está
 * versionada para poder sincronizarla con una cuenta en una fase posterior.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'tercial:progress:v1';
  var SCHEMA_VERSION = 1;
  var memoryStore = createEmptyStore();
  var activeResource = null;

  function createEmptyStore() {
    return {
      version: SCHEMA_VERSION,
      updatedAt: null,
      lastActivity: null,
      resources: {}
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function cleanText(value, fallback) {
    var text = typeof value === 'string' ? value.trim() : '';
    return text || fallback || '';
  }

  function cleanId(value) {
    var id = cleanText(value).toLowerCase();
    return /^[a-z0-9][a-z0-9:_-]*$/.test(id) ? id : '';
  }

  function cleanCount(value) {
    var number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
  }

  function cleanErrorIds(value) {
    if (!Array.isArray(value)) return [];
    return value
      .map(function (id) { return cleanText(id); })
      .filter(Boolean)
      .slice(0, 100);
  }

  function isStore(value) {
    return Boolean(value && value.version === SCHEMA_VERSION &&
      value.resources && typeof value.resources === 'object' && !Array.isArray(value.resources));
  }

  function readStore() {
    try {
      var parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || 'null');
      if (isStore(parsed)) {
        memoryStore = parsed;
        return parsed;
      }
    } catch (_) {
      // Safari privado y algunas políticas escolares pueden bloquear storage.
    }
    return clone(memoryStore);
  }

  function announceChange(store) {
    if (typeof global.CustomEvent !== 'function' || typeof global.dispatchEvent !== 'function') return;
    global.dispatchEvent(new global.CustomEvent('tercial:progresschange', {
      detail: { snapshot: clone(store) }
    }));
  }

  function writeStore(store) {
    store.version = SCHEMA_VERSION;
    store.updatedAt = now();
    memoryStore = store;
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      // Durante esta sesión la memoria sigue disponible aunque no sea persistente.
    }
    announceChange(store);
    return clone(store);
  }

  function normalizeResource(resource) {
    var source = resource || {};
    var id = cleanId(source.id);
    if (!id) throw new TypeError('El recurso necesita un id estable');
    return {
      id: id,
      title: cleanText(source.title, id),
      subject: cleanText(source.subject, 'general'),
      topic: cleanText(source.topic, 'general'),
      kind: cleanText(source.kind, 'lesson'),
      path: cleanText(source.path, global.location && global.location.pathname)
    };
  }

  function ensureResource(store, resource) {
    var normalized = normalizeResource(resource);
    var previous = store.resources[normalized.id] || {};
    var current = Object.assign({}, previous, normalized);
    if (!current.firstVisitedAt) current.firstVisitedAt = now();
    if (!current.status) current.status = 'started';
    if (!Number.isFinite(current.visitCount)) current.visitCount = 0;
    store.resources[normalized.id] = current;
    return current;
  }

  function setLastActivity(store, resource, at) {
    resource.lastVisitedAt = at;
    store.lastActivity = {
      resourceId: resource.id,
      path: resource.path,
      at: at
    };
  }

  function currentResource(input) {
    if (input && input.id) return Object.assign({}, activeResource || {}, input);
    if (activeResource) return activeResource;
    throw new Error('No hay un recurso activo para registrar el avance');
  }

  function recordVisit(resource) {
    activeResource = normalizeResource(resource);
    var store = readStore();
    var current = ensureResource(store, activeResource);
    var at = now();
    current.visitCount += 1;
    setLastActivity(store, current, at);
    writeStore(store);
    return clone(current);
  }

  function recordProgress(update) {
    var input = update || {};
    var resource = currentResource(input.resource);
    var store = readStore();
    var current = ensureResource(store, resource);
    var completed = cleanCount(input.completed);
    var total = cleanCount(input.total);
    if (total > 0) completed = Math.min(completed, total);
    var at = now();

    current.progress = {
      completed: completed,
      total: total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      updatedAt: at
    };
    if (input.status === 'completed') current.status = 'completed';
    else if (current.latestResult && total > 0 && completed === total) current.status = 'completed';
    else current.status = completed > 0 ? 'in_progress' : 'started';
    setLastActivity(store, current, at);
    writeStore(store);
    return clone(current);
  }

  function recordResult(update) {
    var input = update || {};
    var resource = currentResource(input.resource);
    var store = readStore();
    var current = ensureResource(store, resource);
    var total = cleanCount(input.total);
    var correct = Math.min(cleanCount(input.correct), total);
    var at = now();
    var result = {
      correct: correct,
      total: total,
      percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      errorIds: cleanErrorIds(input.errorIds),
      at: at
    };

    current.latestResult = result;
    if (!current.bestResult || result.percent > current.bestResult.percent) {
      current.bestResult = clone(result);
    }
    current.progress = {
      completed: total,
      total: total,
      percent: total > 0 ? 100 : 0,
      updatedAt: at
    };
    current.status = 'completed';
    setLastActivity(store, current, at);
    writeStore(store);
    return clone(current);
  }

  function resetCurrentAttempt(resourceInput) {
    var resource = currentResource(resourceInput ? { resource: resourceInput } : {});
    var store = readStore();
    var current = ensureResource(store, resource);
    var previousTotal = current.progress ? current.progress.total : 0;
    var at = now();

    current.status = 'started';
    current.progress = {
      completed: 0,
      total: previousTotal,
      percent: 0,
      updatedAt: at
    };
    delete current.latestResult;
    setLastActivity(store, current, at);
    writeStore(store);
    return clone(current);
  }

  function getSnapshot() {
    return clone(readStore());
  }

  function getContinueActivity() {
    var store = readStore();
    var latest = store.lastActivity && store.resources[store.lastActivity.resourceId];
    if (latest && ['lesson', 'practice', 'exam'].indexOf(latest.kind) !== -1 && latest.status !== 'completed') {
      return clone(latest);
    }

    var resources = Object.values(store.resources).filter(function (resource) {
      return ['lesson', 'practice', 'exam'].indexOf(resource.kind) !== -1;
    });
    resources.sort(function (a, b) {
      return String(b.lastVisitedAt || '').localeCompare(String(a.lastVisitedAt || ''));
    });
    var unfinished = resources.find(function (resource) { return resource.status !== 'completed'; });
    return unfinished ? clone(unfinished) : resources[0] ? clone(resources[0]) : null;
  }

  function getSubjectSummary(subject) {
    var target = cleanText(subject).toLowerCase();
    var resources = Object.values(readStore().resources).filter(function (resource) {
      return cleanText(resource.subject).toLowerCase() === target;
    });
    var completed = resources.filter(function (resource) { return resource.status === 'completed'; }).length;
    var results = resources.map(function (resource) { return resource.latestResult; }).filter(Boolean);
    var scoreTotal = results.reduce(function (sum, result) { return sum + result.correct; }, 0);
    var questionTotal = results.reduce(function (sum, result) { return sum + result.total; }, 0);

    return {
      subject: subject,
      resources: resources.length,
      completed: completed,
      attempts: results.length,
      accuracy: questionTotal > 0 ? Math.round((scoreTotal / questionTotal) * 100) : null
    };
  }

  function clearAll() {
    memoryStore = createEmptyStore();
    try { global.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    announceChange(memoryStore);
  }

  function meta(name) {
    if (!global.document || typeof global.document.querySelector !== 'function') return '';
    var node = global.document.querySelector('meta[name="' + name + '"]');
    return node ? cleanText(node.getAttribute('content')) : '';
  }

  function resourceFromDocument() {
    var id = meta('tercial:resource-id');
    if (!id) return null;
    return {
      id: id,
      title: meta('tercial:resource-title') || cleanText(global.document.title).split('·')[0].trim(),
      subject: meta('tercial:subject'),
      topic: meta('tercial:topic'),
      kind: meta('tercial:kind'),
      path: global.location && global.location.pathname
    };
  }

  var api = {
    storageKey: STORAGE_KEY,
    version: SCHEMA_VERSION,
    recordVisit: recordVisit,
    recordProgress: recordProgress,
    recordResult: recordResult,
    resetCurrentAttempt: resetCurrentAttempt,
    getSnapshot: getSnapshot,
    getContinueActivity: getContinueActivity,
    getSubjectSummary: getSubjectSummary,
    clearAll: clearAll
  };

  global.TercialProgress = Object.freeze(api);

  var pageResource = resourceFromDocument();
  if (pageResource) recordVisit(pageResource);
})(window);
