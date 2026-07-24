# Fundamentos · secuencia integrada mate + física

> 8 semanas · **5 de agosto → 23 de septiembre de 2026** · grupo parejo el **30 de septiembre**.
> Miércoles = mate (3 h) · Jueves = física (3 h) · lun/mar/vie = 1 h de refuerzo.
>
> **La idea:** cada tema de física usa **la herramienta de mate que se vio el día anterior**.
> El alumno no siente que son dos materias sino una sola con dos aplicaciones — y eso ataca
> directo el "es que la física es otra cosa" que paraliza a muchos.

---

## La secuencia

| Sem | Miércoles · MATE | Jueves · FÍSICA | El puente |
|:--:|---|---|---|
| **1** | Operaciones con signos | **Magnitudes y unidades** (SI, fundamentales vs derivadas) | El signo es dirección: −5 m/s es ir al revés |
| **2** | Fracciones | **Conversiones de unidades** | Convertir *es* multiplicar por una fracción que vale 1 |
| **3** | Potencias y radicales | **Notación científica** (sin calculadora) | 10ⁿ es la misma potencia; aquí se vuelve herramienta de supervivencia |
| **4** | Expresiones algebraicas | **Análisis dimensional** | Tratar m, kg, s como literales que se cancelan igual que las x |
| **5** | Productos notables | **Gráficas I: leer** (pendiente, corte, área) | La recta y=mx+b es x=x₀+vt con otros nombres |
| **6** | Factorización | **Gráficas II: interpretar movimiento** | Curva que se empina = acelera; cruza cero = se regresa |
| **7** | Ecuaciones de 1er grado | **Despejes en fórmulas físicas** | Despejar v de d=vt es lo mismo que despejar x de 3x=12 |
| **8** | Ecuaciones de 2º grado y sistemas | **Vectores** (geométrico) + razonamiento proporcional | Sistemas 2×2 ↔ componentes; proporción ↔ "si duplico r, F cae a ¼" |

---

## Por qué este orden

**Semanas 1–4 · la caja de herramientas.** Todo lo que se necesita para *manipular* cantidades
físicas. Nada de fenómenos todavía: primero que puedan operar sin miedo.

- **Signos primero** porque es el error universal documentado (§6 de METODO.md) y en física
  reaparece como *dirección* — un vector negativo no es "menos", es "al revés".
- **Conversiones justo después de fracciones** es el mayor ahorro de la secuencia: convertir
  no es una regla nueva que memorizar, es multiplicar por una fracción que vale 1. Si lo
  presentas así el día siguiente de ver fracciones, se entiende solo.
- **Notación científica pega con potencias.** Y es crítico: **en el examen no hay calculadora**,
  y sin manejar 3×10⁸ o 1.6×10⁻¹⁹ mentalmente, electromagnetismo y física contemporánea
  (2 de los 9 temas) se vuelven imposibles.
- **Análisis dimensional después de expresiones algebraicas:** las unidades se cancelan igual
  que las literales. Es la misma operación, y además se convierte en **arma de examen**: si
  buscas velocidad y el resultado sale en kg, la opción se descarta sin calcular.

**Semanas 5–6 · gráficas.** El hueco más grande de los fundamentos típicos. Es lo más
transversal (aparece en cinemática, termodinámica, ondas, circuitos) y el examen lo usa
muchísimo porque permite preguntar **sin pedir cálculo**. Va a mitad de camino: ya saben
operar, y todavía no llegan a los temas pesados.
→ **Pieza construida:** `rediseno/lab-cinematica.html` (el carrito con las dos gráficas en vivo).

**Semanas 7–8 · el puente al razonamiento.** Despejes y vectores son las dos llaves que abren
el temario formal. Y se cierra con **razonamiento proporcional** ("si duplico la distancia, la
fuerza gravitacional se hace ¼"), que es el modo en que el examen pregunta cuando no quiere
que calcules — y es justo el cuello de botella tardío que Gil identificó.

---

## Dos advertencias

⚠️ **Vectores necesita trigonometría, y la trig formal está hasta la semana 15** (tema 7 del
temario UNAM). En la semana 8 hay que darlos **geométricamente**: suma cabeza-cola, el
paralelogramo, descomposición cualitativa. Los senos y cosenos se retoman al llegar a trig.
Alternativa: meter una dosis mínima de razones trigonométricas en la semana 8.

⚠️ **Los despejes ya vienen "gratis"** de la semana 7 de mate. Nómbralo así explícitamente
frente al grupo: *"esto que hicimos ayer con x, hoy se llama despejar v"*. Baja la ansiedad
de "la física es otra cosa" — que es más un problema de percepción que de capacidad.

---

## Qué ya está construido para estas 8 semanas

| Recurso | Cubre |
|---|---|
| **Generador de ejercicios** (`rediseno/ejercicios.html`) | Las 8 semanas de mate: práctica ilimitada con distractores = errores reales |
| **Laboratorio de cinemática** (`rediseno/lab-cinematica.html`) | Semanas 5–6 (gráficas) |
| **Plan de hoy** (`rediseno/alumno.html`) | Entrega el tema del día solo, y la nivelación de quien entra tarde |
| `a-ojo.html` · `descarta.html` (ya en producción) | Estimación y descarte — falta sembrarlos con reactivos de física |

**Huecos por construir:** conversiones y notación científica no tienen generador todavía
(serían los siguientes del catálogo), y las piezas interactivas de vectores y proporcionalidad
están pendientes.
