# Sistema de diseño — *Editorial cálido funcional*

**Versión:** 1.0 · **Fecha:** 2026-05-22 · **Alcance:** sistema único para todos los archivos del sitio. Reemplaza los sistemas A (UNAM cards), A' (exámenes) y C (worksheet) del [audit](audit.md). Conserva la intención del sistema B (paper-craft) pero la disciplina como plataforma educativa.

---

## 0. Punto de vista

Una herramienta moderna con alma editorial. Un libro de matemáticas contemporáneo que respira: voz editorial cálida con la disciplina funcional de una plataforma educativa. Se compromete con UNA dirección estética y elimina las otras dos.

**Lo que SÍ es:** editorial cálido (Fraunces + IBM Plex Sans), tipografía como protagonista, paleta crema/coñac/terracota, hairlines y bordes finos en lugar de sombras, marginalia como gesto puntual, italics en headings para acentuar palabras clave, motion discreto.

**Lo que NO es:** maximalismo editorial dramático con asimetrías violentas (la funcionalidad gana), tech dark (es "papel quemado"), gradientes saturados, glassmorphism, blob shapes, sombras pesadas, animaciones decorativas de entrada.

---

## 1. Tipografía

### 1.1 Justificación de la pareja

**Fraunces (display, headings) + IBM Plex Sans (body, UI)** — más IBM Plex Mono donde aplique.

Razones, en orden de peso:

1. **Continuidad parcial con el único sistema con POV del sitio actual.** El audit identifica el sistema B (flashcards, practicar, repaso) como el único con un punto de vista claro. Conservar Fraunces es evolucionar lo que ya funciona, no reinventar; reemplaza Lora (A) y Georgia (C) sin debate.
2. **Italics de Fraunces como gesto editorial central.** Fraunces tiene una italic excepcionalmente expresiva (formas calígrafas, curvas distintivas en `g`, `e`, `f`). Es el "one thing someone will remember" del sitio: cada heading puede acentuar 1-2 palabras clave en italic accent coñac.
3. **IBM Plex Sans tiene carácter sin pelearse con Fraunces.** A diferencia de Inter o DM Sans (genéricas según el `frontend-design` SKILL), Plex tiene aperturas amplias, terminaciones cuadradas y una `a` de doble piso muy reconocible. Encarna "modernidad funcional" sin perder personalidad.
4. **Cumple la blacklist del SKILL.** Cero Arial, Helvetica, Inter, Roboto, system-ui declarado.
5. **Variable fonts disponibles vía Google Fonts.** Reduce a una sola request por familia.

### 1.2 Carga de fuentes

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
```

- `display=swap` para no bloquear render.
- `preconnect` minimiza handshake.
- Fraunces variable usa `opsz` (optical size) para que el mismo archivo sirva 11px y 48px con shaping óptimo.

### 1.3 Escala tipográfica

| Token | Tamaño | Line-height | Letter-spacing | Familia · Peso | Uso recomendado |
|---|---|---|---|---|---|
| `--font-size-11` | 11px / 0.6875rem | 1.4 | 0.08em | Plex Sans 500 uppercase | Eyebrow, micro-labels en footer/cards |
| `--font-size-12` | 12px / 0.75rem | 1.5 | 0.02em | Plex Sans 400 | Meta, captions, badges |
| `--font-size-13` | 13px / 0.8125rem | 1.55 | 0.01em | Plex Sans 400 | Texto small (créditos, disclaimers, conteos) |
| `--font-size-14` | 14px / 0.875rem | 1.5 | 0 | Plex Sans 500 | UI: botones, inputs, nav links |
| `--font-size-15` | 15px / 0.9375rem | 1.6 | 0 | Plex Sans 400 | Body denso (tablas, listas dentro de cards) |
| `--font-size-16` | 16px / 1rem | 1.65 | 0 | Plex Sans 400 | Body default |
| `--font-size-18` | 18px / 1.125rem | 1.65 | 0 | Plex Sans 400 | Lede, body cómodo (repaso) |
| `--font-size-20` | 20px / 1.25rem | 1.45 | -0.005em | Fraunces 500 | Subhead de card, h4 |
| `--font-size-24` | 24px / 1.5rem | 1.3 | -0.01em | Fraunces 500 | h3, título de card grande |
| `--font-size-32` | 32px / 2rem | 1.15 | -0.015em | Fraunces 500 | h2, section heading |
| `--font-size-40` | 40px / 2.5rem | 1.1 | -0.02em | Fraunces 500 | h1 página interna |
| `--font-size-48` | 48px / 3rem | 1.05 | -0.025em | Fraunces 600 | Hero display (index, exámenes) |

Notas:

- `letter-spacing` negativo en Fraunces grande es deliberado: las formas serif se compactan en displays sin perder legibilidad.
- `letter-spacing` positivo en uppercase Plex (eyebrow) abre el texto para que se respire como caja editorial.
- En Fraunces variable, además del peso se controla `font-variation-settings: "opsz" <px-equivalente>` para shaping óptico. Lo encapsulamos por size dentro del CSS.

### 1.4 Reglas de uso de italics y accent coñac

**Italics de Fraunces — sólo en headings y display, nunca en UI.**

- **Permitido:** acentuar 1-2 palabras clave dentro de un heading. Ej. *"Practica con tarjetas de* ácidos *y bases"*.
- **Permitido:** títulos editoriales cortos completamente en italic cuando el heading no excede 6 palabras (índice de sección: *"Materias y temas"*).
- **Permitido:** numeración minúscula italic en sections (`i.`, `ii.`, `iii.`) en color accent coñac.
- **Prohibido:** italic en párrafos de body (rompe el ritmo lector — usar `<em>` se mantiene roman aunque hay debate de no usarlo en absoluto en body).
- **Prohibido:** italic en UI elements (botones, labels, inputs).

**Accent coñac (`#6b3a2e`) — uso restringido a:**

- Italics en headings (palabras clave).
- Numeración italic minúscula.
- Drop caps en cards de ejercicios (opcional, sólo donde sirve).
- Underline de "página actual" en navegación.

**Cero accent coñac como background; cero como color de body text.**

### 1.5 Reglas de uso de IBM Plex Mono

- Bloques `<code>`, `<pre>`, valores numéricos en tablas técnicas (cuando la alineación tabular importa).
- **No** para inline code de "etiqueta" — un span con borde fino y Plex Sans funciona mejor editorialmente.
- Peso 400 default; 500 sólo para keywords destacadas.

---

## 2. Color

### 2.1 Filosofía

- **Dominante única + accentes filosos** (no paleta tibia distribuida).
- **Crema (no blanco)** como fondo principal. El blanco puro es la firma del sistema C que abandonamos.
- **Dark mode = "papel quemado"**, no tech-dark invertido. Mantiene la calidez. Acentos desaturados para no quemar.
- **Categorías de física conservadas como tokens** — los 6 colores ya existen en los ejercicios actuales; los semantizamos.

### 2.2 Paleta light (default)

**Crema (fondo).** 10 stops desde el más claro al más profundo. No se usan todos en la UI; sirven para componer cards raised, borders sutiles, etc.

| Token | Hex | Uso |
|---|---|---|
| `--crema-50`  | `#faf7f0` | Fondo de tooltip, badges sutiles |
| `--crema-100` | `#f8f3e8` | Cards raised (sobre fondo principal) |
| `--crema-200` | `#f5efe4` | **Fondo principal del sitio** |
| `--crema-300` | `#efe7d8` | Hover bg sutil en cards |
| `--crema-400` | `#e6dcc4` | Bg de inputs deshabilitados |
| `--crema-500` | `#d9ccae` | Separadores muy tenues |
| `--crema-600` | `#c9bda3` | **Border default** (hairline) |
| `--crema-700` | `#a89880` | Border activo, dividers gruesos |
| `--crema-800` | `#8c7556` | Sienna tenue (ver § 2.5) |
| `--crema-900` | `#6b5a44` | Reservado para gráficos / sparklines |

**Tinta (texto).**

| Token | Hex | Uso |
|---|---|---|
| `--ink-900` | `#1f1a16` | **Texto principal, headings**. Casi negro pero cálido (no `#000`) |
| `--ink-700` | `#4a3f33` | **Texto secundario**, body relajado, ledes |
| `--ink-500` | `#7a6448` | Meta inline en body (cumple AA — ver § 2.5) |
| `--ink-300` | `#8c7556` | Meta de UI de tamaño grande (ver § 2.5) |
| `--ink-100` | `#c9bda3` | Placeholder de input |

**Acentos editoriales.**

| Token | Hex | Uso |
|---|---|---|
| `--accent-conac` | `#6b3a2e` | Italics en headings, drop caps, numeración, underline current page |
| `--accent-conac-soft` | `#8c5240` | Hover de links, footer accents |
| `--accent-terracota` | `#c2410c` | Tags accent, marginalia destacada, énfasis puntual |
| `--accent-terracota-soft` | `#dd6638` | Hover de tags accent |

**Estados semánticos.** Calibrados al tono cálido del sistema; no son los rojos/verdes saturados de UI tech genérica.

| Token | Hex | Uso |
|---|---|---|
| `--state-ok` | `#4a6b3f` | Respuesta correcta (oliva profundo cálido) |
| `--state-ok-bg` | `#e7ecd9` | Fondo sutil de bloque "correcto" |
| `--state-err` | `#9c3525` | Respuesta incorrecta (rojo terroso, no rojo escarlata) |
| `--state-err-bg` | `#f1dcd4` | Fondo sutil de bloque "incorrecto" |
| `--state-warn` | `#8a5208` | Para revisar (ámbar profundo) |
| `--state-warn-bg` | `#f1e6c4` | Fondo sutil de bloque "para revisar" |

**Categorías de física** (los 6 hardcoded del audit, semantizados):

| Token | Hex | Uso |
|---|---|---|
| `--cat-blue`   | `#1a4f8a` | Fluidos, electricidad, cinemática, dinámica, trabajo-energía, cantidad de movimiento, cálculo |
| `--cat-amber`  | `#b45309` | Óptica |
| `--cat-coral`  | `#c2410c` | Termodinámica |
| `--cat-teal`   | `#0e7490` | Ondas |
| `--cat-purple` | `#6d28d9` | Magnetismo |
| `--cat-navy`   | `#1e3a8a` | Física moderna |

Las categorías se usan **sólo como border-top de 3px** en cards de unidad. No como background ni como color de texto.

### 2.3 Paleta dark — "papel quemado"

No es inversión mecánica. El fondo es un grafito cálido (no negro tech). El texto principal es crema clara tenue (no blanco puro). Los acentos coñac y terracota se desaturan ligeramente para no quemar.

| Token | Hex | Uso |
|---|---|---|
| `--crema-50`  → | `#2a2420` | Fondo de tooltip dark, badges |
| `--crema-100` → | `#221d1a` | Cards raised |
| `--crema-200` → | `#1a1614` | **Fondo principal dark** (grafito cálido) |
| `--crema-300` → | `#231e1b` | Hover bg sutil |
| `--crema-400` → | `#2e2823` | Bg de inputs deshabilitados |
| `--crema-500` → | `#3a3229` | Separadores muy tenues |
| `--crema-600` → | `#4a3f33` | **Border default** |
| `--crema-700` → | `#6b5a44` | Border activo |
| `--crema-800` → | `#8a7861` | Sienna en dark |
| `--crema-900` → | `#a89880` | Reservado para gráficos |
| `--ink-900` → | `#efe4cf` | **Texto principal dark** (crema clara tenue, no blanco) |
| `--ink-700` → | `#d9cbb0` | Texto secundario |
| `--ink-500` → | `#a89880` | Meta inline |
| `--ink-300` → | `#8a7861` | Meta de UI grande |
| `--ink-100` → | `#4a3f33` | Placeholder |
| `--accent-conac` → | `#c79a82` | Italics en dark (desaturado) |
| `--accent-conac-soft` → | `#a07a64` | Hover dark |
| `--accent-terracota` → | `#dd8055` | Tags accent dark |
| `--accent-terracota-soft` → | `#c2663d` | Hover tags accent |
| `--state-ok` → | `#a3bd92` | Correcto dark |
| `--state-ok-bg` → | `#2a3526` | Fondo correcto dark |
| `--state-err` → | `#d68a73` | Incorrecto dark |
| `--state-err-bg` → | `#3a2622` | Fondo incorrecto dark |
| `--state-warn` → | `#d4a04a` | Revisar dark |
| `--state-warn-bg` → | `#3a3020` | Fondo revisar dark |

Las categorías de física se mantienen iguales (los hex funcionan en ambos modos al usarse como border-top de 3px sobre cards crema/grafito).

### 2.4 Atmósfera de fondo (grain)

Se aplica al `body` en ambos modos con `radial-gradient` de muy baja opacidad. **Sub-8% siempre.**

```css
body {
  background-color: var(--color-bg);
  background-image:
    radial-gradient(at 20% 30%, rgba(140,117,86, 0.04) 0px, transparent 50%),
    radial-gradient(at 80% 70%, rgba(107,58,46, 0.03) 0px, transparent 50%);
  background-attachment: fixed;
}
```

En dark, los `rgba()` se ajustan para que el grain se vea cálido sobre grafito (mismos tonos, opacidades 0.05/0.04).

### 2.5 Nota sobre `#8c7556` (sienna del brief)

El brief pide `#8c7556` como "tinta meta/hint". Calculado contra el fondo crema `#f5efe4`:

- **Ratio: 3.83 : 1** — falla AA para body (necesita 4.5), pasa AA-large (3:1 para ≥18px ó ≥14px bold).

Solución adoptada:

- `--ink-300: #8c7556` — sienna nominal, **restringido a uso ≥18px ó ≥14px bold** (eyebrow uppercase, meta en footers de cards, labels de tags).
- `--ink-500: #7a6448` (sienna profundizada, ratio **4.84 : 1**, pasa AA body) — meta inline en párrafos de body, captions de 12-13px.

Ambos se ofrecen como tokens semánticos: `--color-meta` (= `--ink-500`) y `--color-meta-large` (= `--ink-300`). Quien implemente no decide hex, decide semántica.

### 2.6 Ratios de contraste WCAG (calculados)

Light (sobre `--crema-200 #f5efe4`):

| Par | Ratio | Nivel |
|---|---|---|
| `--ink-900 #1f1a16` / bg | **15.19 : 1** | AAA |
| `--ink-700 #4a3f33` / bg | **9.32 : 1** | AAA |
| `--ink-500 #7a6448` / bg | **4.84 : 1** | AA body, AAA large |
| `--ink-300 #8c7556` / bg | **3.83 : 1** | AA-large sólo (≥18px ó ≥14px bold) |
| `--accent-conac #6b3a2e` / bg | **7.53 : 1** | AAA |
| `--accent-terracota #c2410c` / bg | **4.32 : 1** | AA-large; **no body** |
| `--state-ok #4a6b3f` / bg | **5.92 : 1** | AA body |
| `--state-err #9c3525` / bg | **5.71 : 1** | AA body |
| `--state-warn #8a5208` / bg | **5.57 : 1** | AA body |

Dark (sobre `--crema-200-dark #1a1614`):

| Par | Ratio | Nivel |
|---|---|---|
| `--ink-900 #efe4cf` / bg | **14.33 : 1** | AAA |
| `--ink-700 #d9cbb0` / bg | **11.02 : 1** | AAA |
| `--ink-500 #a89880` / bg | **6.41 : 1** | AAA |
| `--ink-300 #8a7861` / bg | **4.16 : 1** | AA-large sólo |
| `--accent-conac #c79a82` / bg | **8.10 : 1** | AAA |
| `--accent-terracota #dd8055` / bg | **6.78 : 1** | AAA |
| `--state-ok #a3bd92` / bg | **8.95 : 1** | AAA |
| `--state-err #d68a73` / bg | **7.34 : 1** | AAA |
| `--state-warn #d4a04a` / bg | **7.81 : 1** | AAA |

**Contrastes texto/fondo dentro de bloques de estado.**

Light:

| Par | Ratio | Nivel |
|---|---|---|
| `--state-ok #4a6b3f` / `--state-ok-bg #e7ecd9` | **5.02 : 1** | AA body |
| `--state-err #9c3525` / `--state-err-bg #f1dcd4` | **5.36 : 1** | AA body |
| `--state-warn #8a5208` / `--state-warn-bg #f1e6c4` | **5.12 : 1** | AA body |

Dark:

| Par | Ratio | Nivel |
|---|---|---|
| `--state-ok #a3bd92` / `--state-ok-bg #2a3526` | **6.27 : 1** | AA body |
| `--state-err #d68a73` / `--state-err-bg #3a2622` | **5.23 : 1** | AA body |
| `--state-warn #d4a04a` / `--state-warn-bg #3a3020` | **5.49 : 1** | AA body |

Ajuste hecho durante revisión: el `--state-warn` light originalmente declarado como `#a16207` calculaba **3.96 : 1** contra `--state-warn-bg`, fallando AA body. Se profundizó a `#8a5208` para asegurar 5.12 : 1. El cambio se propaga a § 2.2 y a [assets/css/tokens.css](../assets/css/tokens.css).

Reglas:
- Body text usa exclusivamente `--ink-900`, `--ink-700` o `--ink-500`.
- `--ink-300` y `--accent-terracota` requieren ≥18px ó ≥14px bold. El CSS define utilidades semánticas (`.eyebrow`, `.tag-accent`) que ya cumplen este floor.
- Cero text sobre gradientes complejos donde el ratio sea variable.

---

## 3. Espaciado

Escala base 4. Doce stops. No se usan magic numbers en ningún componente — todo viene del token.

| Token | px | Uso típico |
|---|---|---|
| `--space-1` | 4px | Gap entre icon + label, padding interno de tags |
| `--space-2` | 8px | Padding pequeño de chip, gap en form rows |
| `--space-3` | 12px | Padding de input, gap entre tags |
| `--space-4` | 16px | Padding de card pequeña, gap entre lista items |
| `--space-5` | 20px | Padding horizontal de botón grande |
| `--space-6` | 24px | **Padding default de card editorial**, gap entre cards |
| `--space-7` | 32px | Padding generoso de card hero, gap entre secciones cortas |
| `--space-8` | 40px | Gap entre section header y contenido |
| `--space-9` | 48px | Separación entre secciones mayores |
| `--space-10` | 64px | Padding-top de hero, separación de bloques de página |
| `--space-11` | 80px | Hero generoso (index) |
| `--space-12` | 96px | Padding-top de página completa, espacio editorial generoso |

Regla simple: **doblar al saltar escala** mentalmente (16→32→64). Stops intermedios (20, 40, 80) están para microajustes; el default debería caer en 4-6-8-10.

**Containers (max-width):**

| Token | px | Uso |
|---|---|---|
| `--container-narrow` | 640px | Texto largo de repaso (ancho de lectura ideal) |
| `--container-base` | 760px | Hero, cards de detalle, ejercicios |
| `--container-wide` | 1080px | Index, grids de practicar, listas de temas |
| `--container-full` | 1280px | Nav bar, footer (con padding interno) |

El audit detectó `max-width: 700px` fijo en 12 archivos sin padding flexible. Aquí el padding lateral mobile siempre es `--space-5` (20px) mínimo, y los containers son flex hasta su max.

---

## 4. Componentes

Cada componente lleva: **propósito · markup mínimo · tokens utilizados · estados · accesibilidad · qué NO hacer**.

### 4.1 Navigation bar persistente

**Propósito.** Permitir regreso al index y navegación entre secciones grandes desde cualquiera de las 20 páginas. Resuelve el hallazgo del audit § 8 ("18 archivos sin nav").

**Markup.**
```html
<site-nav active="fisica"></site-nav>
```

El atributo `active` acepta uno de seis valores canónicos del sistema: `inicio`, `examenes`, `tarjetas`, `fisica`, `matematicas`, `notas`. Si se omite, el componente lo infiere de `location.pathname` con la tabla de routes en `site-nav.js`.

Web component que se renderiza (Light DOM — el elemento `<site-nav>` mismo recibe `class="site-nav"` + `role="navigation"` + `aria-label="principal"`, sin wrapper extra):

```html
<site-nav class="site-nav" role="navigation" aria-label="principal">
  <a class="site-nav__brand" href="/tercial/" aria-label="Tercial — ir al inicio">Tercial</a>
  <ul class="site-nav__links">
    <li><a href="/tercial/">Inicio</a></li>
    <li><a href="/tercial/index.html#examenes">Exámenes</a></li>
    <li><a href="/tercial/practicar.html">Tarjetas</a></li>
    <li><a href="/tercial/index.html#fisica" aria-current="page">Física</a></li>
    <li><a href="/tercial/index.html#matematicas">Matemáticas</a></li>
    <li><a href="/tercial/repaso.html">Notas</a></li>
  </ul>
  <button class="site-nav__theme" type="button" aria-label="Cambiar modo de color">
    <!-- iconos sun/moon/sunmoon, el visible se decide por data-theme-pref -->
  </button>
</site-nav>
```

**Hrefs absolutos a `/tercial/`.** Todos los routes apuntan a `/tercial/*` (no relativos) para que la nav funcione desde cualquier profundidad — incluyendo páginas de docs internas como `design/preview.html`. La constante `HOME` vive en una sola línea de `site-nav.js`; si el deploy path cambia (improbable), es ahí donde se edita.

**Brand siempre clickeable al home.** En mobile (<760px) los 6 links se ocultan; sólo quedan brand + theme toggle. El brand `Tercial` linkea a `/tercial/` en todos los breakpoints — es la única vía de regreso al index hasta que se diseñe el menú hamburger en Fase 2.7.

**Local dev.** Servir desde la raíz del repositorio (el directorio que contiene `tercial/`), no desde dentro de `tercial/`: `python3 -m http.server 8000` y abrir `http://localhost:8000/tercial/...`.

**Tokens.** bg `--color-bg`, border-bottom `1px solid var(--color-border)`, height `--space-10`, padding horizontal `--space-6`. Brand en Fraunces italic accent coñac, links en Plex Sans 14. Current page recibe underline `--accent-conac` `2px`.

**Estados.**
- Default: bg crema con leve transparencia (`color-mix(in srgb, var(--color-bg) 95%, transparent)`) para que el grain del body se vea.
- Hover link: color `--ink-900`, underline `1px` con offset `4px`.
- Current: underline `2px` accent coñac.
- Focus-visible: outline `2px` accent coñac + offset `3px`.

**Accesibilidad.**
- `<nav aria-label="principal">`.
- `aria-current="page"` en link de página actual.
- Theme toggle con `aria-label` dinámico ("Cambiar a modo oscuro" / "Cambiar a modo claro").

**Qué NO hacer.** Fixed top con `position: sticky` está OK, **pero NO** `position: fixed` con `backdrop-filter: blur` — eso es glassmorphism, prohibido en esta dirección.

### 4.2 Hero header

**Propósito.** Apertura de página con jerarquía editorial: eyebrow + título + lede, y opcionalmente marginalia.

**Markup.**
```html
<header class="hero">
  <p class="eyebrow">Examen UNAM · 5 de julio 2026</p>
  <h1 class="hero__title">Practica <em>cónicas</em> con tarjetas</h1>
  <p class="hero__lede">Veinte ejercicios resueltos con término xy.</p>
  <aside class="hero__marginalia">
    Faltan <strong>44 días</strong> para tu examen, Lupita.
  </aside>
</header>
```

**Tokens.** Eyebrow `--font-size-11` uppercase ls 0.08em `--ink-300`. Title `--font-size-40` (mobile) → `--font-size-48` (desktop), Fraunces 500, `--ink-900`. `<em>` dentro del title usa Fraunces italic `--accent-conac`. Lede `--font-size-18`, `--ink-700`. Marginalia: lado derecho desktop, abajo mobile, Fraunces italic `--font-size-15`, `--ink-500`, max-width `--space-12 * 3`.

**Composición.** Centrada mobile-first. Desktop opcional: 2 columnas con title+lede a la izquierda y marginalia flotando a la derecha (CSS Grid). La asimetría es PUNTUAL — sólo en hero, no en headings internos.

**Qué NO hacer.** Gradientes en el bg (lo hace sistema A actual). Cero. Drop shadow en el title. Animación de entrada (es página de estudio).

### 4.3 Section header

**Propósito.** Abrir secciones internas con jerarquía editorial — numeración italic + título + count meta.

**Markup.**
```html
<header class="section-header">
  <h2 class="section-header__title">
    <span class="section-header__num">ii.</span>
    Materias y temas
  </h2>
  <span class="section-header__count">12 temas</span>
</header>
```

**Tokens.** `display: flex`, align-items baseline, `border-bottom: 1px solid var(--color-border)`, padding-bottom `--space-3`. Title Fraunces 500 `--font-size-32`. Numeración Fraunces italic `--accent-conac` `--font-size-24`, margin-right `--space-2`. Count Plex Sans `--font-size-13` `--ink-500`.

**Qué NO hacer.** Underline decorativo en el título. Background color. Icon a la izquierda (la numeración italic ES el icono).

### 4.4 Card editorial

**Propósito.** Bloque de contenido unitario (tema, ejercicio, flashcard meta, etc.). Reemplaza las cards de los sistemas A, B y C.

**Markup.**
```html
<article class="card">
  <header class="card__header">
    <p class="eyebrow">Cálculo · Derivadas</p>
    <h3 class="card__title">Regla de la <em>cadena</em></h3>
  </header>
  <div class="card__body">
    <p>Resumen breve del tema en 2-3 líneas.</p>
    <ul class="tag-list">
      <li class="tag">15 tarjetas</li>
      <li class="tag">5 ejercicios</li>
    </ul>
  </div>
  <footer class="card__footer">
    <span class="card__meta">actualizado 2026-05-22</span>
    <a class="card__cta" href="#">Practicar →</a>
  </footer>
</article>
```

**Tokens.** bg `--crema-100`, border `1px solid var(--color-border)`, border-radius `--radius-md` (= 4px), padding `--space-6`. Title Fraunces 500 `--font-size-20`. Body Plex Sans `--font-size-15` `--ink-700`. Footer: `border-top: 1px dotted var(--color-border)`, padding-top `--space-3`, margin-top `--space-4`, flex space-between, meta `--ink-500` `--font-size-13`.

**Variante con categoría** (ejercicios de física): `border-top: 3px solid var(--cat-X)` reemplaza el border-top normal.

**Estados.**
- Hover: `border-color: var(--ink-700)`, bg shift sutil a `--crema-200`. Cero `transform`. Cursor pointer si la card entera linkea.
- Focus-visible (cuando contiene un link envolvente): outline `2px accent-conac` + offset `3px` en la card.

**Qué NO hacer.** `box-shadow` pesada. `transform: translateY(-2px)` en hover (es UI de estudio, no de marketing). Border-radius `>8px`. Background gradient.

### 4.5 Tag pill

**Propósito.** Etiquetas de meta (número de tarjetas, dificultad, tema) y acentos puntuales.

**Markup.**
```html
<span class="tag">15 tarjetas</span>
<span class="tag tag--accent">Trampa común</span>
```

**Tokens.**
- Regular: `border: 1px solid var(--color-border)`, bg transparente, color `--ink-300` (= sienna ≥14px bold, cumple AA-large), Plex Sans 500 `--font-size-11` uppercase ls 0.08em, padding `--space-1` `--space-3`, border-radius `--radius-pill` (999px).
- Accent: misma forma, border + color `--accent-terracota`.

**Estados.**
- Hover (cuando es clickable): border-color `--ink-700`, color `--ink-700`. Si es accent: border-color y color `--accent-terracota-soft`.
- Focus-visible: outline `2px accent-conac` offset `2px`.

**Qué NO hacer.** Background saturado (`bg: var(--accent-terracota)` con texto blanco está PROHIBIDO en esta dirección).

### 4.6 Botones

**Filosofía.** Tres niveles claros. Cero gradientes. Border-radius pequeño (4px) — editorial moderno, no startup.

**Primary.**
```html
<button class="btn btn--primary">Iniciar examen</button>
```
- bg `--ink-900`, color `--crema-100`, border `1px solid var(--ink-900)`.
- Plex Sans 500 `--font-size-14`, padding `--space-3` `--space-5`, radius `--radius-md`.
- Hover: bg `--ink-700`, border-color `--ink-700`.
- Active: bg `--ink-900` con `transform: scale(0.98)` (única excepción al "no transforms", micro y funcional).
- Disabled: bg `--ink-300`, color `--crema-200`, cursor not-allowed, sin hover.

**Secondary.**
```html
<button class="btn btn--secondary">Cancelar</button>
```
- bg transparent, color `--ink-900`, border `1px solid var(--color-border)`.
- Mismo tamaño y tipografía que primary.
- Hover: border-color `--ink-700`, bg `--crema-300`.

**Ghost.**
```html
<button class="btn btn--ghost">Saltar</button>
```
- bg transparent, color `--ink-700`, sin border.
- Hover: color `--ink-900`, text-decoration underline offset `4px`.
- Uso: acciones secundarias en barras de exámenes, "ver más", etc.

**Botones con icon.** Icon a la izquierda, `gap: var(--space-2)`. Icon size `16px`, stroke `1.5`.

**Focus-visible global.** `outline: 2px solid var(--accent-conac)` + `outline-offset: 2px`.

**Qué NO hacer.** Botones gigantes "rounded-full". Tres botones primary en la misma vista (rompe jerarquía).

**Botón teñido por nivel — `--nivel` (excepción a prueba).**

```html
<html data-nivel="prepa">…
<a class="btn btn--nivel-solido">Panel del profesor</a>   <!-- relleno -->
<a class="btn btn--nivel">Panel del profesor</a>          <!-- contorno -->
```

El nivel se declara con `data-nivel` en un ancestro (normalmente `<html>`, porque es
propiedad de la página) y de ahí cuelga `--nivel`: **prepa = terracota**, **universidad
= coñac**. Los tokens ya se invierten solos en tema oscuro, y en el relleno el texto va
en `--crema-100`, que hace de contraste en los dos temas igual que en `.btn--primary`.

> ⚠️ **`.btn--nivel-solido` va contra la regla de contención de acentos** del § 2.2: el
> terracota está listado para tags, marginalia y énfasis puntual, no como relleno de
> botón. Se aprobó **a prueba el 07/08/26** para el botón del panel del profesor en
> `aula.html`, con un argumento concreto: ese botón existe para que la mamá de Gil lo
> encuentre sin preguntar, y la variante de contorno (`.btn--nivel`) corría el riesgo
> de pasar desapercibida — que es justo el problema que el botón resuelve.
>
> **No es un descuido: no lo "corrijas" a contorno.** Si al usarlo se decide volver a
> `.btn--nivel`, hay que quitar también esta nota. Está pendiente de confirmarse con
> Gil.

### 4.7 Input, select, textarea

**Markup.**
```html
<label class="field">
  <span class="field__label">Nombre</span>
  <input class="input" type="text" placeholder="María Lupita">
  <span class="field__hint">Aparecerá en tu reporte de progreso.</span>
</label>
```

**Tokens.**
- Input: bg `--crema-100`, border `1px solid var(--color-border)`, color `--ink-900`, Plex Sans `--font-size-15`, padding `--space-3`, radius `--radius-md`.
- Label: Plex Sans 500 `--font-size-13`, color `--ink-700`, margin-bottom `--space-1`.
- Hint: Plex Sans `--font-size-12`, color `--ink-500`, margin-top `--space-1`.
- Placeholder: color `--ink-100`.

**Estados.**
- Focus: `border-color: var(--accent-conac)`, `outline: 2px solid var(--accent-conac)`, `outline-offset: -1px` (toma el lugar del border).
- Invalid: `border-color: var(--state-err)`, hint pasa a `--state-err`.
- Disabled: bg `--crema-400`, color `--ink-300`, cursor not-allowed.

**Select.** Mismo styling + chevron SVG inline a la derecha (Lucide `chevron-down`, 16px, stroke 1.5, color `--ink-700`).

**Textarea.** Mismo styling, `min-height: var(--space-12)`, `resize: vertical`.

### 4.8 Toggle modo oscuro

**Decisión.** Icon button con sun/moon de Lucide (stroke 1.5, 18px). Tipográfico se sintió más cute que editorial — el icon es más sobrio y compatible con la nav bar.

**Markup.**
```html
<button class="theme-toggle" data-theme-toggle aria-label="Cambiar a modo oscuro">
  <svg class="theme-toggle__icon theme-toggle__icon--sun"><!-- lucide sun --></svg>
  <svg class="theme-toggle__icon theme-toggle__icon--moon"><!-- lucide moon --></svg>
</button>
```

**Comportamiento.**
- Click cicla: `light → dark → auto → light`.
- `auto` respeta `prefers-color-scheme` del sistema.
- En modo light se ve el moon (acción = "cambiar a oscuro"). En dark se ve el sun. En auto se ve un icono dual (sun-moon de Lucide) y un dot indicator.
- Persistencia en `localStorage` (clave `tercial-theme-pref`).
- API JS expuesta — ver § 8.3.

**Estados.** Hover: bg `--crema-300`, color `--ink-900`. Focus-visible: outline accent coñac.

**Sin flash en page load.** Snippet inline en `<head>` antes de cualquier `<link>` de CSS — documentado en § 11.

### 4.9 Estados de respuesta (exámenes y flashcards)

**Crítico.** No dependen sólo del color. Cada estado es **icono + label + color + posición** para cumplir accesibilidad WCAG 1.4.1 (use of color).

| Estado | Icon (Lucide) | Label | Color (texto) | Bg | Border-left |
|---|---|---|---|---|---|
| Correcto | `check` | "Correcto" | `--state-ok` | `--state-ok-bg` | `3px solid var(--state-ok)` |
| Incorrecto | `x` | "Incorrecto" | `--state-err` | `--state-err-bg` | `3px solid var(--state-err)` |
| Para revisar | `bookmark` | "Revisar" | `--state-warn` | `--state-warn-bg` | `3px solid var(--state-warn)` |
| Sin contestar | `circle-dashed` | "Sin contestar" | `--ink-500` | `--crema-300` | `3px dotted var(--color-border)` |

**Markup.**
```html
<div class="response response--ok">
  <svg class="response__icon"><!-- lucide check --></svg>
  <span class="response__label">Correcto</span>
  <div class="response__detail">
    <p>La derivada de x² es 2x.</p>
  </div>
</div>
```

**Tokens.** Padding `--space-4`, radius `--radius-md`, Plex Sans 500 `--font-size-14` para label, Plex Sans 400 `--font-size-15` para detail. Icon 18px stroke 1.5.

**Motion.** Aparición **instantánea**, sin animación. El brief lo pide explícito: la respuesta debe ser instantánea y legible, sin animación celebratoria.

**Qué NO hacer.** Confetti, scale-up animations, pulsing. Cero.

### 4.10 Bloque KaTeX (inline y display)

**Inline.**
- Tamaño: hereda el body (`em` based).
- Color: `--ink-900`.
- Espaciado horizontal: `padding: 0 0.1em` para que la matemática respire dentro del párrafo.

**Display.**
```html
<div class="math-display">
  $$\frac{d}{dx}\left[ x^n \right] = n x^{n-1}$$
</div>
```
- Padding vertical `--space-4`, padding horizontal `--space-5`.
- Centered.
- Variante "destacada": `border-left: 3px solid var(--accent-conac)`, padding-left `--space-5`, bg `--crema-100`. Para fórmulas-clave editoriales.
- Font-size de display: 1.05em del body que lo contiene.

**KaTeX font-family.** Se conserva `KaTeX_Main` (computer-modern-like). No se intenta forzar Fraunces dentro de fórmulas — eso rompe el rendering matemático.

**Override de tamaño.** Se inyecta `:root { --katex-font-size: 1em; }` y se mapea en el CSS de KaTeX para que el tamaño matemático respete el contexto.

### 4.11 Acordeón (`<details>`)

**Markup.**
```html
<details class="accordion">
  <summary class="accordion__summary">
    <span>Repaso de derivadas básicas</span>
    <svg class="accordion__chevron"><!-- lucide chevron-down --></svg>
  </summary>
  <div class="accordion__body">
    <p>Contenido…</p>
  </div>
</details>
```

**Tokens.**
- Summary: Plex Sans 500 `--font-size-16`, color `--ink-900`, padding `--space-3` 0, cursor pointer.
- Chevron: 16px stroke 1.5, color `--ink-500`, rotación 0deg → 180deg al abrir.
- Body: padding `--space-3` 0 `--space-4`, color `--ink-700`.
- Separación: `border-bottom: 1px dotted var(--color-border)` en el `<details>` cuando hay varios apilados.

**Motion.** `transition: transform var(--motion-duration-base) var(--motion-easing-standard)` en el chevron. El height del body no se anima (los navegadores no animan `<details>` confiable cross-browser) — abre/cierra en seco, lo cual es coherente con la dirección sobria.

**Variante "stack"** (para repaso): elimina border-bottom del último, summary uppercase eyebrow size cuando son micro-secciones.

### 4.12 Footer

**Markup.**
```html
<footer class="site-footer">
  <p class="site-footer__brand">
    <em>Tercial</em> · preparación examen UNAM
  </p>
  <p class="site-footer__credits">
    Compuesto en <em>Fraunces</em> e IBM Plex Sans · 2026
  </p>
  <nav class="site-footer__links" aria-label="enlaces de pie">
    <a href="/tercial/">Inicio</a>
    <a href="/tercial/practicar.html">Practicar</a>
    <a href="/tercial/repaso.html">Repaso</a>
  </nav>
</footer>
```

**Tokens.** border-top `1px solid var(--color-border)`, padding `--space-9` `--space-6`, Plex Sans 400 `--font-size-13`, color `--ink-500`. Brand y créditos pueden usar Fraunces italic en `<em>`.

---

## 5. Motion system

### 5.1 Duraciones

| Token | Valor | Uso |
|---|---|---|
| `--motion-instant` | 0ms | Estados de respuesta correcta/incorrecta (sin animación) |
| `--motion-fast` | 120ms | Hover de tags, chevron de accordion, micro cambios de color |
| `--motion-base` | 180ms | Default: hover de cards, links, botones |
| `--motion-slow` | 280ms | Theme switch (opcional, sobre `color` con `transition`) |

### 5.2 Easings

| Token | Valor | Uso |
|---|---|---|
| `--motion-ease-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default decel editorial |
| `--motion-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Salida (uso raro) |
| `--motion-ease-emphasized` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Theme switch, transiciones de mayor recorrido |

### 5.3 Qué se anima

**Sí:**
- `color`, `background-color`, `border-color` en hover/focus.
- `transform: rotate()` del chevron del accordion.
- `transform: scale(0.98)` en active de botón primary.

**No:**
- `transform: translateY()` en hover de cards.
- Animaciones de entrada (`@keyframes fade-in`, stagger reveal). **Es un sitio de estudio**; las distrae del contenido. El brief lo pide explícitamente.
- Pulsing, bouncing, confetti.

### 5.4 prefers-reduced-motion

Global en `base.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Excepción aceptada al "cero `!important`":** este patrón es la convención WCAG/MDN para reducir motion sin afectar el flujo normal del CSS. Lo documentamos como excepción única y justificada.

---

## 6. Iconografía

**Recomendación: Lucide.**

Razones:

1. **Stroke-based, 1.5-2px** — encaja con la sobriedad editorial. Phosphor tiene curvas más cute, Tabler es similar a Lucide pero con menos momentum y menor variedad.
2. **Open source, MIT** — bajamos los SVGs y los embebemos inline (cero requests, cero CSS extra de fuente de iconos). 
3. **Naming consistente y descriptivo** — `check`, `x`, `bookmark`, `chevron-down`, `sun`, `moon` se leen como inglés natural.
4. **Variabilidad mínima** — los iconos no compiten con la tipografía Fraunces, sirven como marcadores funcionales.

**Reglas:**
- Stroke-width **1.5** (sobrescribimos el default 2 para refinarlo).
- Tamaños permitidos: 14, 16, 18, 20, 24 (no fuera de eso).
- Color: `currentColor` siempre. El icon hereda del texto que lo acompaña.
- `aria-hidden="true"` cuando hay label adyacente; `aria-label` cuando el icon vive solo (toggles).
- **No** se usan iconos coloridos (filled multicolor).

**Iconos del sistema (lista cerrada para esta fase):**
- Nav/UI: `chevron-down`, `chevron-right`, `arrow-left`, `arrow-right`, `external-link`, `x`, `menu`.
- Estado: `check`, `x`, `bookmark`, `circle-dashed`, `alert-triangle`.
- Tema: `sun`, `moon`, `sun-moon` (auto).
- Acción: `play`, `rotate-ccw` (reiniciar), `shuffle` (aleatorio), `filter`, `search`.

---

## 7. Reglas tipográficas para KaTeX

1. **Tamaño relativo al contexto.** KaTeX usa `em`, así que automáticamente respeta el `font-size` del padre. Sólo se ajusta el factor base si en un display el rendering se ve demasiado pequeño (`.math-display .katex { font-size: 1.05em }`).
2. **Alineación.** Inline: baseline (default de KaTeX, no se toca). Display: centered, salvo en cards de "fórmula destacada" donde alinea a la izquierda con la barra accent coñac.
3. **Espaciado en párrafos.** Inline math no genera ascenders/descenders raros si se usa `\$ … \$` con `katex.render({displayMode:false})`. Margin inline ya gestionado por la propia librería.
4. **Espaciado en displays.** Padding vertical `--space-4` arriba y abajo. Cero margin negativo de "tirar hacia arriba" para "ahorrar espacio".
5. **Color.** El default `currentColor` de KaTeX hereda `--ink-900`. En dark hereda `--ink-900-dark` (= `#efe4cf`). Cero override de color en operadores/símbolos: rompería convenciones matemáticas.
6. **Símbolos destacados.** Cuando un autor quiera colorear un símbolo (raro), usar `\textcolor{var(--accent-conac)}{…}` — pero por defecto, no.
7. **Selección de texto.** El `::selection` del body usa `background: rgba(107,58,46,0.18)`, color `--ink-900`. KaTeX hereda esto sin override.

---

## 8. Decisiones técnicas (justificadas)

### 8.1 CSS centralizado vs inline

**Recomendación: centralizado** con `<link rel="stylesheet">` apuntando a `assets/css/tokens.css`, `assets/css/base.css`, `assets/css/components.css`.

Razones:

1. **Una sola fuente de verdad.** El audit identificó que los 20 archivos llevan 3 sistemas paralelos sin overlap. Sólo separando el CSS del HTML se acaba ese problema en raíz; inline lo perpetúa.
2. **HTTP/2 + cache de navegador.** GitHub Pages sirve sobre HTTP/2 con cache headers razonables; un único stylesheet de ~20-30KB se descarga una vez y se reutiliza en las 20 páginas. El ahorro acumulado supera por mucho el costo de 1 request inicial extra.
3. **Sin build step.** Vanilla CSS funciona directamente — no se requiere bundler. Cumple la restricción del proyecto.
4. **Refactor coherente.** Cualquier ajuste futuro al sistema se hace en un lugar y propaga a 20 páginas. Sin esto, mantener consistencia es imposible.

**Tres archivos, no uno:** `tokens.css` (variables), `base.css` (reset + tipografía base), `components.css` (componentes). Permite que páginas que no usen ciertos componentes igual carguen los tokens — y la separación enseña la arquitectura.

**Inline override permitido** sólo para page-specific JS-generated styles (raro). Cero inline `<style>` de presentación.

### 8.2 Navegación persistente entre 20 páginas sin includes nativos

**Recomendación: web component custom `<site-nav>`** en `assets/js/site-nav.js`.

Razones:

1. **Native API, cero dependencias.** Custom elements son estándar desde 2018; soportados en todos los navegadores modernos. Sin framework.
2. **Single source of truth.** Cambiar un link de nav en 20 páginas es editar un archivo (el componente), no 20.
3. **Anti-FOUC.** El componente renderiza dentro de su propio scope. Cargando `site-nav.js` en el `<head>` con `defer` o como `<script type="module">`, el browser tiene el constructor listo antes de toparse con el `<site-nav>`. Comparado con un snippet JS que inyecta HTML al `DOMContentLoaded`, el custom element evita el flash de "nav vacío" porque el navegador conoce el elemento desde el primer parse.
4. **A11y bien encapsulada.** El componente declara internamente su `<nav aria-label>`, `aria-current`, y el theme toggle. El consumidor sólo escribe `<site-nav current="repaso">`.

**Por qué no las otras opciones:**
- *Copy-paste disciplinado*: el audit demostró que la disciplina falla a 20 archivos. Inviable.
- *Snippet JS que inyecta nav*: viable pero introduce FOUC y obliga a montar listeners de a11y desde fuera del componente. Menos limpio.
- *Server-side includes / iframes*: no aplica (GitHub Pages sin build).

**Carga.** `<script type="module" src="/tercial/assets/js/site-nav.js"></script>` en el `<head>` con `defer` implícito por ser module.

### 8.3 Toggle modo oscuro — API

`assets/js/theme.js` se carga con `defer` y expone `window.ClasesTheme` con cuatro métodos públicos:

```js
window.ClasesTheme = {
  get()      → 'light' | 'dark' | 'auto'     // preferencia persistida
  set(pref)  → void                          // valida + persiste + aplica
  toggle()   → void                          // cicla light → dark → auto → light
  applied()  → 'light' | 'dark'              // modo efectivo resuelto
};
```

**Persistencia.** `localStorage['tercial-theme-pref']`. Valores aceptados: `light`, `dark`, `auto`. Cualquier otra cosa se trata como `auto`.

**Efectos al aplicar.** Setea en `<html>`:
- `data-theme="light"` o `data-theme="dark"` — lo lee toda la paleta del CSS.
- `data-theme-pref="light|dark|auto"` — lo lee el CSS del toggle para mostrar el ícono correcto (moon / sun / sunmoon).

**Evento.** Cada cambio dispara `window.dispatchEvent(new CustomEvent('tercial:themechange', { detail: { applied, pref } }))`. Lo pueden escuchar componentes que necesiten reaccionar al cambio de tema (ej. inputs con SVG inline cuyo color requiere recompute).

**Auto + prefers-color-scheme.** En preferencia `auto`, el módulo se suscribe a `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', …)` para reaplicar cuando el sistema cambia.

**Anti-flash.** Ver § 11 — snippet inline obligatorio en `<head>` antes de cualquier `<link>` de CSS.

### 8.4 KaTeX — carga selectiva

**Recomendación: cargar sólo donde se usa** (no en todas las páginas).

Razones:

1. **Tamaño.** KaTeX completo (CSS + JS + fonts en CDN) pesa ~270KB gzipped. En las 16 páginas sin matemáticas no aporta nada.
2. **Hoy se usa en 4 archivos** (`examen_unam_area2.html`, `flashcards.html`, `formulario.html`, `repaso.html`). Las 16 restantes son ejercicios físicos con su propia notación HTML, index, exámenes de mate sin formulas KaTeX (que las renderizan diferente), etc.
3. **Coherencia de uso.** Para que no se descontrole, encapsulamos la carga en `assets/js/katex-loader.js`:

```js
// Las páginas con matemáticas añaden:
// <script type="module" src="/tercial/assets/js/katex-loader.js"></script>
// y el loader inyecta CSS + JS + auto-render con la config estándar del sistema.
```

El loader:
- Inyecta `<link rel="stylesheet">` de KaTeX.
- Carga el JS de KaTeX y `auto-render`.
- Llama `renderMathInElement(document.body, { delimiters: […], throwOnError: false })` cuando todo está listo.
- Define delimitadores estándar: `$…$` inline, `$$…$$` display, `\(…\)` y `\[…\]`.

Trade-off aceptado: las 4 páginas con KaTeX pagan ~270KB; las 16 restantes pagan 0. Net positivo y coherente.

---

## 9. Reglas de calidad — checklist

Aplica a todo CSS/HTML del sistema:

- [ ] Cero `!important` (única excepción documentada: bloque `prefers-reduced-motion` global).
- [ ] Cero magic numbers en CSS — todo viene de un token (`--space-*`, `--font-size-*`, `--color-*`, `--radius-*`).
- [ ] Mobile-first: media queries usan `min-width`. Breakpoints fijos: `--bp-sm: 480px`, `--bp-md: 760px`, `--bp-lg: 1080px`.
- [ ] WCAG AA mínimo, AAA donde sea barato. Ratios reportados en § 2.6.
- [ ] `:focus-visible` definido en todos los elementos interactivos (botón, link, input, select, textarea, summary, theme toggle).
- [ ] `prefers-reduced-motion` respetado globalmente.
- [ ] Cero fuentes blacklist (Arial, Helvetica, Inter, Roboto, system-ui declarado). Sólo Fraunces + IBM Plex Sans + IBM Plex Mono + KaTeX_Main para math.
- [ ] Cero animaciones decorativas de entrada (page-load fades, staggers).
- [ ] Cero `box-shadow` pesada (sombras planas/cero — los bordes hacen el trabajo).
- [ ] Cero glassmorphism, `backdrop-filter: blur`, gradientes de fondo saturados, blob shapes.
- [ ] Cero copy-paste de tokens; redefinir un color por página está prohibido.

---

## 10. Estructura del CSS resultante (preview)

```
assets/
├── css/
│   ├── tokens.css       (~250 líneas: :root + [data-theme="dark"])
│   ├── base.css         (~150 líneas: reset, body, links, headings, focus-visible global, prefers-reduced-motion)
│   └── components.css   (~500 líneas: todos los componentes de § 4)
└── js/
    ├── theme.js         (~50 líneas: API ClasesTheme)
    ├── site-nav.js      (~120 líneas: web component <site-nav>)
    └── katex-loader.js  (~40 líneas: carga selectiva)
```

Total estimado: ~1 100 líneas centralizadas reemplazan ~3 500 líneas inline duplicadas a lo largo de 20 archivos (estimación basada en el audit).

---

## 11. Snippet anti-flash (obligatorio en cada HTML)

Va en `<head>`, **antes** de cualquier `<link rel="stylesheet">`. Aplica `data-theme` y `data-theme-pref` al `<html>` antes del primer paint, evitando el flash blanco al cargar páginas con preferencia dark. Auto-contenido: no depende de `theme.js` (que carga después con `defer`).

```html
<script>
  /* Anti-flash editorial · tercial · v2.0 */
  (function () {
    var p = localStorage.getItem('tercial-theme-pref') || 'auto';
    var d = p === 'auto'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : p;
    var r = document.documentElement;
    r.setAttribute('data-theme', d);
    r.setAttribute('data-theme-pref', p);
  })();
</script>
```

**Trece líneas, sin presentación.** Es el ÚNICO bloque inline replicado en las 20 páginas. Se mantiene en sync vía búsqueda y reemplazo si llega a cambiar.

**Por qué no se factoriza a un archivo.** Cualquier `<script src>` (con o sin `defer`/`async`) llega después del parse del `<head>`. Para que `data-theme` exista antes del primer paint — único momento donde el flash es visible — el código DEBE ejecutar inline y síncronamente.

**Después del primer paint.** `theme.js` carga con `defer` y reaplica idempotentemente. Si la preferencia es `auto`, también empieza a escuchar `prefers-color-scheme` para reaccionar a cambios en vivo.


## 12. Roadmap (recordatorio del plan)

- **Fase 1 (completada):** sistema de diseño + tokens + base + components + preview. **Cero modificación de los 20 HTML existentes.**
- **Fase 2.0 (en curso):** infraestructura JS compartida — `theme.js`, `site-nav.js`, `katex-loader.js`. Snippet anti-flash documentado.
- **Fase 2.1+ :** refactor de los 20 archivos para consumir el sistema. Empezar por templates más usados (ejercicios físicos × 12) → exámenes → flashcards/practicar/repaso → index → formulario.
- **Fase 2.7:** menú hamburger mobile (<760px) tras refactorizar páginas — patrón se decide con uso real.
- **Fase 3:** validación end-to-end, ajustes finos, dark mode QA por página.
