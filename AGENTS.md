# Reglas de trabajo para Codex

## Claude es responsable del diseño

- Codex no debe modificar el diseño visual de este proyecto.
- Claude sí puede modificar libremente el diseño visual y es la IA responsable
  de CSS, layout, componentes y decisiones de interfaz.
- Esto incluye CSS, tokens, colores, tipografías, espaciado, tamaños, layout,
  breakpoints, componentes, animaciones y estructura visual del HTML.
- Codex puede corregir contenido dentro de la estructura existente, pero debe
  conservar clases, jerarquía, componentes y comportamiento visual.
- Si una corrección de contenido provoca un problema visual, Codex debe
  reportarlo para que lo resuelva la IA responsable de diseño; no debe
  solucionarlo modificando estilos.
- La única excepción es una autorización explícita del usuario, en el turno
  actual, para realizar un cambio de diseño concreto.

## Las dos aulas (07/08/2026)

Hay **dos** páginas de aula, una por nivel:

| Página | Nivel | `data-nivel` | Color del nivel |
|---|---|---|---|
| `aula.html` | prepa · ECOEMS/COMIPEMS | `prepa` | terracota |
| `aula-uni.html` | universidad · UNAM | `uni` | coñac |

Los nombres no son simétricos a propósito: `aula.html` ya existía y está enlazada
desde fuera, así que renombrarla rompería enlaces. La nueva se llama `aula-uni.html`
para casar con `uni.html`.

⚠️ **`aula-uni.html` todavía tiene contenido de prepa.** Sus tarjetas, exámenes y
simulacros son una copia de `aula.html` —material COMIPEMS— puestos como marcador de
posición hasta que exista el material de UNAM. Está avisado en un comentario al
principio del archivo. **No es un error de contenido que haya que "corregir" copiando
más de prepa**; lo que toca es sustituirlo cuando haya material propio.

## El nivel se declara en la página, no en el componente

`data-nivel` va en `<html>` y de ahí cuelga `--nivel`, que tiñe los componentes que lo
usen (hoy, el botón del panel del profesor). Si creas una página nueva, decláralo:
`prepa` o `uni`. Sin él, los componentes teñidos por nivel se quedan sin color.

El detalle está en `design/design-system.md` § 4.6.

## Botón del panel del profesor

Está en el hero de `aula.html`, `aula-uni.html` y `uni.html`. Apunta al **nombre de
red** de la Mac de Gil (`Mac-mini-de-Gil.local`), no a su IP: el servidor de exámenes
es local y la IP cambia con el DHCP. No lo sustituyas por una IP.

Va relleno del color del nivel, que es una excepción **a prueba** a la regla de
contención de acentos del sistema de diseño; está documentada en el § 4.6 y no debe
"corregirse" a contorno sin decisión de Gil.
