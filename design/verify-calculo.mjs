import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const html = fs.readFileSync(path.join(root, 'calculo_diferencial_v3.html'), 'utf8');
let ok=0, bad=0;
function chk(label, cond, detail){ console.log((cond?'  ✅ ':'  ❌ ')+label+(detail?'  ('+detail+')':'')); cond?ok++:bad++; }
function near(a,b){ return Math.abs(a-b)<1e-9; }

// ── 1 · f(f(x)) con f(x)=1/(x-2) ──
const f=x=>1/(x-2), ff=x=>f(f(x));
const enDominioFF=x=>x!==2 && x!==5/2;
chk('1 · f(f(x))=(x−2)/(5−2x)', [1,3,5].every(x=> near(ff(x), (x-2)/(5-2*x))), 'x=1,3,5');
chk('1 · dominio excluye 2 y 5/2', !enDominioFF(2) && !enDominioFF(5/2) &&
    [1,3,5].every(enDominioFF));
chk('1 · HTML corregido y con dominio', html.includes('(x − 2) / (5 − 2x)') &&
    html.includes('Dominio: ℝ ∖ {2, 5/2}') && !html.includes('(3 − 2x)'));

// ── 2 · x⁴−8x²+7 · ordenada de inflexión en x²=4/3 ──
{const u=4/3, y=u*u-8*u+7; chk('2 · inflexión = −17/9', near(y,-17/9), y.toFixed(4));
 chk('2 · HTML', html.includes('(±2/√3, −17/9)') && !html.includes('(±2/√3, 1/9)'));}

// ── 3 · 3x⁴−16x³+24x²−9 en x=2/3 ──
{const x=2/3, y=3*x**4-16*x**3+24*x*x-9; chk('3 · f(2/3) = −67/27', near(y,-67/27), y.toFixed(4));
 chk('3 · HTML', html.includes('(2/3, −67/27)') && !html.includes('(2/3, −5)'));}

// ── 4 · x⁵−5x⁴ · (0,0) es MÁXIMO local, no inflexión ──
{const fp=x=>5*x**4-20*x**3; chk('4 · f′ cambia + a − en 0 (máx)', fp(-0.01)>0 && fp(0.01)<0, 'máx local');
 chk('4 · intervalos de monotonía', fp(-1)>0 && fp(1)<0 && fp(5)>0);
 const fpp=x=>20*x**3-60*x*x; chk('4 · concavidad e inflexión sólo en 3',
   fpp(-1)<0 && fpp(0.1)<0 && fpp(2)<0 && fpp(4)>0);
 chk('4 · HTML completo', html.includes('Máx. (0, 0) · Mín. (4, −256) · Inflexión (3, −162)') &&
   html.includes('Crece (−∞,0)∪(4,+∞) · Decrece (0,4)') &&
   html.includes('Cóncava ↑ (3,+∞) · Cóncava ↓ (−∞,3)') &&
   !html.includes('Inflexiones (0, 0) y (3, −162)'));}

// ── 5 · x⁴−4x³+4x² · ordenada de inflexión = 4/9 ──
{const x=(3-Math.sqrt(3))/3, y=x**4-4*x**3+4*x*x; chk('5 · inflexión = 4/9', near(y,4/9), y.toFixed(4));
 chk('5 · HTML', html.includes('((3±√3)/3, 4/9)') && !html.includes('0.48'));}

// ── 6 · cable dos postes 3 y 5, separados 4 · L_min = 4√5 ──
{const L=x=>Math.sqrt(9+x*x)+Math.sqrt(25+(4-x)**2);
 let m=Infinity,ax=0; for(let x=0;x<=4;x+=1e-4){if(L(x)<m){m=L(x);ax=x;}}
 chk('6 · L_min = 4√5 ≈ 8.944 en x=1.5', near(Math.round(m*1e4)/1e4, Math.round(4*Math.sqrt(5)*1e4)/1e4) && Math.abs(ax-1.5)<0.01, 'min='+m.toFixed(4)+' x='+ax.toFixed(3));
 chk('6 · HTML', html.includes('4√5 ≈ 8.94 m') && !html.includes('√34 ≈ 5.83'));}

// ── 7 · ventana normanda · h = r ──
{// P=2r+2h+πr=6 ; A=2rh+πr²/2 ; A'(r)=0 → r=6/(4+π), y de la restricción h=r
 const r=6/(4+Math.PI), h=(6-2*r-Math.PI*r)/2;
 const area=2*r*h+Math.PI*r*r/2;
 chk('7 · dimensiones y máximo', near(h,r) && near(area,18/(4+Math.PI)) && -(4+Math.PI)<0,
   'h='+h.toFixed(4)+' r='+r.toFixed(4)+' A='+area.toFixed(4));
 chk('7 · HTML completo', html.includes('r = 6/(π+4) m') && /h = r &nbsp;/.test(html) &&
   html.includes('18/(π+4) m²') && !html.includes('h = r/2'));}

const expected = 17;
if (ok + bad !== expected) {
  console.log(`  ❌ se esperaban ${expected} verificaciones y se ejecutaron ${ok + bad}`);
  bad++;
}
console.log(`\n  ${bad? '❌ '+bad+' fallas':'✅ '+ok+' verificaciones OK'}`);
process.exit(bad?1:0);
