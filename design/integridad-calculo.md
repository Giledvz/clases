# Integridad · Cálculo diferencial — 7 correcciones

Fuente corregida: `calculo_diferencial_v3.html` (el HTML es la fuente principal).
El PDF `calculo_diferencial_latex.pdf` **no tiene fuente editable** en el repo →
se retira del deploy hasta regenerarlo desde el mismo banco que alimenta el HTML.

Prueba reproducible: `design/verify-calculo.mjs` (recalcula estos siete resultados
y comprueba su representación en el HTML y el dominio). Se ejecuta junto con el
verificador del formulario mediante `npm run test:regresiones`; corre en los pull
requests y bloquea el deploy si detecta que reaparece una corrección auditada.
Es una prueba de **regresión conocida**, no una certificación automática de los
88 ejercicios.

| # | Ejercicio | Antes (mal) | Después (correcto) | Comprobación |
|---|---|---|---|---|
| 1 | Composición · f(x)=1/(x−2), f(f(x)) | (x−2)/(3−2x) | **(x−2)/(5−2x)**, dominio **ℝ∖{2,5/2}** | f(f(1))=−1/3 = (1−2)/(5−2); se excluyen el valor fuera del dominio de f y el que hace f(x)=2 |
| 2 | Curvas · x⁴−8x²+7 · ordenada de inflexión | (±2/√3, 1/9) | **(±2/√3, −17/9)** | f en x²=4/3: 16/9−32/3+7 = −17/9 |
| 3 | Curvas · 3x⁴−16x³+24x²−9 · f(2/3) | (2/3, −5) | **(2/3, −67/27)** | (16−128+288−243)/27 = −67/27 |
| 4 | Curvas · x⁵−5x⁴ · punto (0,0) | "x=0 no es extremo · Inflexión (0,0)" | **Máx. (0,0); inflexión solo (3,−162)** | f′=5x³(x−4) cambia + a − en 0 → máx; f″=20x²(x−3) no cambia signo en 0 → no inflexión. (También se corrigió Crece/Decrece: Crece (−∞,0)∪(4,∞), Decrece (0,4).) |
| 5 | Curvas · x⁴−4x³+4x² · ordenada de inflexión | ≈ 0.48 | **4/9 (≈0.44)** | f=(x²−2x)²; en x=(3−√3)/3, x²−2x=−2/3 → (−2/3)²=4/9 |
| 6 | Optimización · cable entre postes 3 y 5 m, 4 m aparte | L_min = √34 ≈ 5.83 | **L_min = 4√5 ≈ 8.94** | reflexión: √((3+5)²+4²)=√80=4√5; x=1.5 sí estaba bien |
| 7 | Optimización · ventana normanda | h = r/2 | **h = r** | A′(r)=0 → r=P/(4+π); de P=r(4+π) se sigue h=r |

Nota: en #4 el error incluía la monotonía, no solo el punto (0,0); se reescribió
el análisis completo del ejercicio. El resto fueron correcciones puntuales.

---

# Integridad · formulario.html + repaso.html

Una segunda revisión independiente confirmó las tres correcciones iniciales y
detectó condiciones de aplicación que todavía faltaban. Se corrigieron sin
alterar la jerarquía ni la navegación de las páginas.

Cambios principales:

- Fricción cinética y estática separadas; ley de Hooke con signo restaurador.
- Tercera ley y condición de `N=F_g` expresadas con sus hipótesis.
- Teorema trabajo–energía y relación general `W_no conservativas = ΔE_m`.
- Constante de los gases y `PV=nRT` alineadas en SI y en atm·L.
- Pascal formulado como transmisión del **incremento** de presión.
- Bernoulli, primera ley de la termodinámica y efecto fotoeléctrico con sus condiciones.
- Cónicas clasificadas sólo después de descartar casos degenerados.
- L’Hôpital presentado como teorema con hipótesis, no como sustitución automática.
- Conservación de energía condicionada a fuerzas conservativas.
- Argumentos de logaritmos estrictamente positivos.

Prueba reproducible: `design/verify-formulario.mjs`. Protege las correcciones
enumeradas; la auditoría conceptual completa sigue siendo una revisión humana.
