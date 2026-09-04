import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = path.resolve(process.argv[2] || process.cwd());
const OMITIR = new Set(['.git', 'node_modules', '_site', 'backup', 'tmp', 'screenshots']);
const RETIRADOS = new Set([
  'calculo_diferencial_latex.pdf',
  'examenes-pdf/simulacion-2024-v1.html',
  'examenes-pdf/simulacion-2024-v2.html'
]);

function recorrer(dir) {
  const archivos = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    if (OMITIR.has(entrada.name)) continue;
    const destino = path.join(dir, entrada.name);
    if (entrada.isDirectory()) archivos.push(...recorrer(destino));
    else if (entrada.name.endsWith('.html')) archivos.push(destino);
  }
  return archivos;
}

function lineaDe(texto, indice) {
  return texto.slice(0, indice).split('\n').length;
}

function destinoLocal(referencia, origen) {
  if (!referencia || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(referencia)) return null;
  if (/[{}<>]/.test(referencia)) return null;

  const sinFragmento = referencia.split('#', 1)[0].split('?', 1)[0];
  if (!sinFragmento) return null;

  let ruta;
  try {
    ruta = decodeURIComponent(sinFragmento);
  } catch {
    ruta = sinFragmento;
  }

  let destino;
  if (ruta === '/tercial' || ruta === '/tercial/') destino = path.join(RAIZ, 'index.html');
  else if (ruta.startsWith('/tercial/')) destino = path.join(RAIZ, ruta.slice('/tercial/'.length));
  else if (ruta.startsWith('/')) destino = path.join(RAIZ, ruta.slice(1));
  else destino = path.resolve(path.dirname(origen), ruta);

  if (destino.endsWith(path.sep)) destino = path.join(destino, 'index.html');
  return destino;
}

const htmls = recorrer(RAIZ);
const errores = [];
let referencias = 0;
let scripts = 0;

for (const archivo of htmls) {
  const relativo = path.relative(RAIZ, archivo);
  const html = fs.readFileSync(archivo, 'utf8');
  // Evita confundir plantillas HTML escritas dentro de JavaScript/CSS con
  // atributos del documento. Conserva saltos e índices para reportar líneas.
  const htmlEstructural = html.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi,
    (bloque) => bloque.replace(/[^\n]/g, ' '));

  const ids = new Map();
  for (const match of htmlEstructural.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)) {
    const id = match[2];
    if (ids.has(id)) errores.push(`${relativo}:${lineaDe(html, match.index)} id duplicado: #${id}`);
    else ids.set(id, match.index);
  }

  for (const match of htmlEstructural.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) {
    const referencia = match[2].trim();
    const destino = destinoLocal(referencia, archivo);
    if (!destino) continue;
    referencias++;

    if (!fs.existsSync(destino)) {
      errores.push(`${relativo}:${lineaDe(html, match.index)} recurso inexistente: ${referencia}`);
      continue;
    }

    const destinoRelativo = path.relative(RAIZ, destino);
    if (RETIRADOS.has(destinoRelativo) && relativo !== destinoRelativo) {
      errores.push(`${relativo}:${lineaDe(html, match.index)} recurso retirado del despliegue: ${referencia}`);
    }

    const fragmento = referencia.includes('#') ? referencia.slice(referencia.indexOf('#') + 1) : '';
    if (fragmento && destino.endsWith('.html')) {
      const destinoHtml = destino === archivo ? html : fs.readFileSync(destino, 'utf8');
      let id;
      try { id = decodeURIComponent(fragmento); } catch { id = fragmento; }
      const idsDestino = new Set([...destinoHtml.matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi)].map((m) => m[2]));
      if (!idsDestino.has(id)) errores.push(`${relativo}:${lineaDe(html, match.index)} ancla inexistente: ${referencia}`);
    }
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const atributos = match[1];
    if (/\bsrc\s*=/.test(atributos)) continue;
    const tipo = atributos.match(/\btype\s*=\s*(["'])(.*?)\1/i)?.[2] || '';
    if (tipo && !/(?:java|ecma)script/i.test(tipo)) continue;

    scripts++;
    try {
      new vm.Script(match[2], { filename: `${relativo}:${lineaDe(html, match.index)}` });
    } catch (error) {
      errores.push(`${relativo}:${lineaDe(html, match.index)} JavaScript inválido: ${error.message}`);
    }
  }
}

assert.equal(errores.length, 0, `\n${errores.map((error) => `  ❌ ${error}`).join('\n')}`);
console.log(`  ✅ ${htmls.length} archivos HTML sin ids duplicados`);
console.log(`  ✅ ${referencias} referencias locales apuntan a recursos existentes`);
console.log(`  ✅ ${scripts} scripts inline tienen sintaxis válida`);
