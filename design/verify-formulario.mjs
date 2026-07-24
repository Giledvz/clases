import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const formulario = fs.readFileSync(path.join(root, 'formulario.html'), 'utf8');
const repaso = fs.readFileSync(path.join(root, 'repaso.html'), 'utf8');

let ok = 0;
let bad = 0;
function chk(label, condition) {
  console.log((condition ? '  ✅ ' : '  ❌ ') + label);
  condition ? ok++ : bad++;
}
function delimitadoresEnCadaLinea(text) {
  return text.split('\n').every(line => {
    const sinDolaresEscapados = line.replace(/\\\$/g, '');
    return (sinDolaresEscapados.match(/\$/g) || []).length % 2 === 0;
  });
}

chk('fricción cinética y estática separadas',
  formulario.includes('$f_k = \\mu_k N$') &&
  formulario.includes('$\\;0 \\leq |f_s| \\leq \\mu_s N$') &&
  !formulario.includes('$F_f = \\mu\\,N$'));
chk('segunda ley usa la fuerza neta',
  formulario.includes('$\\sum \\vec F = m\\,\\vec a$') &&
  !formulario.includes('$F = m\\,a$'));
chk('Hooke conserva el signo restaurador',
  formulario.includes('$F_{\\mathrm{resorte}} = -k\\,x$') &&
  formulario.includes('$k$ es la constante elástica'));
chk('Coulomb no reutiliza la constante del resorte',
  formulario.includes('$k_e = 9 \\times 10^{9}') &&
  formulario.includes('$F = k_e\\,\\dfrac{|q_1 q_2|}{r^2}$'));
chk('tercera ley distingue los dos cuerpos',
  formulario.includes('pero actúan sobre cuerpos distintos'));
chk('peso no reutiliza el símbolo de trabajo',
  formulario.includes('$F_g = m\\,g$') &&
  !formulario.includes('$W = m\\,g$'));
chk('N=Fg queda condicionado',
  formulario.includes('$N=F_g=mg$ sólo si no hay aceleración vertical'));
chk('teorema trabajo–energía presente',
  formulario.includes('$W_{\\mathrm{neto}} = \\Delta E_c$'));
chk('trabajo no conservativo expresado con signo',
  formulario.includes('$W_{\\mathrm{no\\,conservativas}}=\\Delta E_m$'));
chk('constante de los gases ofrece sistemas coherentes',
  formulario.includes('$R = 0.082057') &&
  formulario.includes('= 8.314') &&
  formulario.includes('usa $R=8.314$ con Pa·m³ o $R=0.082057$ con atm·L'));
chk('Pascal usa incremento de presión',
  formulario.includes('$\\Delta P_1=\\Delta P_2') &&
  formulario.includes('un incremento de presión aplicado'));
chk('continuidad declara caudal y velocidad media',
  formulario.includes('$Q = A_1 \\bar v_1 = A_2 \\bar v_2$'));
chk('Bernoulli declara sus condiciones básicas',
  formulario.includes('flujo ideal y estacionario') &&
  formulario.includes('$h$ es elevación respecto a una referencia'));
chk('primera ley declara la convención de W',
  formulario.includes('$Q>0$ entra al sistema') &&
  formulario.includes('$W_{\\mathrm{sis}}>0$ lo realiza el sistema'));
chk('leyes de los gases exigen presión absoluta',
  formulario.includes('misma cantidad de gas, presión absoluta y temperatura en kelvin') &&
  formulario.includes('Gas ideal — $n$ en mol'));
chk('Doppler distingue la velocidad de la fuente',
  formulario.includes("$f' = f\\,\\dfrac{v}{v - v_s}$") &&
  !formulario.includes('v - v_f'));
chk('campo eléctrico usa la magnitud de la carga de prueba',
  formulario.includes('$E = \\dfrac{F}{|q_0|}$'));
chk('Faraday distingue la FEM promedio',
  formulario.includes('$\\varepsilon_{\\mathrm{prom}} = -N\\,\\dfrac{\\Delta\\Phi_B}{\\Delta t}$'));
chk('solenoide define la densidad de espiras',
  formulario.includes('$n=N/L$ [m⁻¹]'));
chk('fotoeléctrico incluye umbral',
  formulario.includes('$K_{\\mathrm{max}} = h f - \\phi$') &&
  formulario.includes('emisión si $hf \\geq \\phi$'));
chk('masa–energía define el defecto de masa',
  formulario.includes('$E_{\\mathrm{liberada}} = \\Delta m_{\\mathrm{def}}\\,c^2$') &&
  formulario.includes('$\\Delta m_{\\mathrm{def}}=m_i-m_f>0$'));
chk('cónicas advierten casos degenerados',
  repaso.includes('Para una cónica real no degenerada') &&
  repaso.includes('un punto, un par de rectas ni el conjunto vacío'));
chk('L’Hôpital conserva sus hipótesis',
  repaso.includes('puedes intentar L’Hôpital') &&
  repaso.includes("$g'(x)\\neq0$") &&
  repaso.includes('las condiciones deben volver a cumplirse'));
chk('energía se conserva bajo fuerzas conservativas',
  repaso.includes('Si sólo actúan fuerzas conservativas') &&
  repaso.includes('si también interviene un resorte, añade $\\dfrac{1}{2}kx^2$'));
chk('dominio de logaritmos exige positividad',
  repaso.includes('cada argumento quede <em>estrictamente positivo</em>'));
chk('delimitadores matemáticos cierran en la misma línea',
  delimitadoresEnCadaLinea(formulario) && delimitadoresEnCadaLinea(repaso));

const expected = 26;
if (ok + bad !== expected) {
  console.log(`  ❌ se esperaban ${expected} verificaciones y se ejecutaron ${ok + bad}`);
  bad++;
}
console.log(`\n  ${bad ? '❌ ' + bad + ' fallas' : '✅ ' + ok + ' verificaciones OK'}`);
process.exit(bad ? 1 : 0);
