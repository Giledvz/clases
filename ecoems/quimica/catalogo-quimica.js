/*
 * Catálogo editorial del piloto de Química.
 *
 * El paquete QUA-001 es una fuente de procedencia, no un recurso público.
 * Cada segmento puede convertirse después en explicación, actividad,
 * consulta o práctica sin perder las páginas de las que proviene.
 */

export const FUENTE = {
  id: 'QUA-001',
  titulo: 'Paquete fuente del curso de Química UNAM',
  paginas: 41,
  huella: '45646b0c8c448ea368687f54d795f7f2da720b2214737ae199e9a7b03d941126'
};

export const ALCANCES = {
  nucleo: {
    id: 'nucleo',
    nombre: 'Núcleo ECOEMS',
    corto: 'ECOEMS',
    descripcion: 'Contenido directamente alineado con el temario de ingreso a bachillerato.'
  },
  ampliacion: {
    id: 'ampliacion',
    nombre: 'Ampliación ECOEMS',
    corto: 'ECOEMS +',
    descripcion: 'Profundiza el tema sin formar parte de la primera ruta de estudio.'
  },
  unam: {
    id: 'unam',
    nombre: 'Ingreso UNAM',
    corto: 'UNAM',
    descripcion: 'Se conserva para la futura ruta universitaria y no aparece en la ruta ECOEMS.'
  }
};

export const USOS = {
  aprende: 'Aprende',
  clase: 'Clase',
  consulta: 'Consulta',
  practica: 'Practica'
};

export const TEMAS = [
  {
    id: 'materiales',
    numero: '01',
    titulo: 'Las características de los materiales',
    descripcion: 'Reconoce la materia por sus propiedades, estados, cambios y formas de separación.',
    etiquetas: ['materia', 'propiedades', 'mezclas', 'estados']
  },
  {
    id: 'estructura-periodicidad',
    numero: '02',
    titulo: 'Estructura y periodicidad de los elementos',
    descripcion: 'Conecta la estructura del átomo con su lugar en la tabla y su manera de enlazarse.',
    etiquetas: ['átomo', 'tabla periódica', 'enlaces', 'periodicidad']
  },
  {
    id: 'reaccion-quimica',
    numero: '03',
    titulo: 'La reacción química',
    descripcion: 'Lee, clasifica y representa transformaciones químicas y sus cantidades.',
    etiquetas: ['reacciones', 'nomenclatura', 'balanceo', 'disoluciones']
  }
];

export const SEGMENTOS = [
  {
    id: 'materia-propiedades',
    tema: 'materiales',
    titulo: 'Materia y sus propiedades',
    descripcion: 'Definición de materia y distinción entre propiedades físicas y químicas.',
    paginas: '5',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['materia', 'propiedades físicas', 'propiedades químicas'],
    estado: 'disponible',
    href: './materia-propiedades.html'
  },
  {
    id: 'cambios-materia',
    tema: 'materiales',
    titulo: 'Cambios físicos y químicos',
    descripcion: 'Compara transformaciones reversibles y cambios que producen sustancias nuevas.',
    paginas: '5',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['cambio físico', 'cambio químico', 'transformación'],
    estado: 'disponible',
    href: './cambios-materia.html'
  },
  {
    id: 'estados-agregacion',
    tema: 'materiales',
    titulo: 'Estados de agregación',
    descripcion: 'Características de sólido, líquido, gas y plasma; cambios de estado.',
    paginas: '6–7',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['sólido', 'líquido', 'gas', 'plasma', 'cambios de estado'],
    estado: 'disponible',
    href: './estados-agregacion.html'
  },
  {
    id: 'clasificacion-materia',
    tema: 'materiales',
    titulo: 'Clasificación de la materia',
    descripcion: 'Sustancias puras, elementos, compuestos y mezclas homogéneas o heterogéneas.',
    paginas: '8',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['elementos', 'compuestos', 'mezclas', 'sustancias puras'],
    estado: 'disponible',
    href: './clasificacion-materia.html'
  },
  {
    id: 'separacion-mezclas',
    tema: 'materiales',
    titulo: 'Métodos de separación de mezclas',
    descripcion: 'Relaciona propiedades de la materia con el método de separación adecuado.',
    paginas: '9–10',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['filtración', 'decantación', 'destilación', 'cromatografía'],
    estado: 'disponible',
    href: './separacion-mezclas.html'
  },
  {
    id: 'disoluciones',
    tema: 'materiales',
    titulo: 'Disoluciones: soluto y disolvente',
    descripcion: 'Identifica las partes de una disolución y su proporción dentro de la mezcla.',
    paginas: '33',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['disolución', 'soluto', 'disolvente', 'mezcla homogénea'],
    estado: 'disponible',
    href: './disoluciones.html'
  },

  {
    id: 'modelos-atomicos',
    tema: 'estructura-periodicidad',
    titulo: 'Modelos atómicos',
    descripcion: 'Recorre las ideas que dieron forma al modelo actual del átomo.',
    paginas: '11',
    alcance: 'nucleo',
    usos: ['aprende', 'clase'],
    etiquetas: ['Dalton', 'Thomson', 'Rutherford', 'Bohr', 'átomo'],
    estado: 'fuente'
  },
  {
    id: 'particulas-subatomicas',
    tema: 'estructura-periodicidad',
    titulo: 'Partículas subatómicas',
    descripcion: 'Protones, neutrones, electrones y cálculo de partículas en átomos e iones.',
    paginas: '12',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['protón', 'neutrón', 'electrón', 'número atómico', 'masa'],
    estado: 'fuente'
  },
  {
    id: 'configuracion-electronica',
    tema: 'estructura-periodicidad',
    titulo: 'Configuración electrónica',
    descripcion: 'Distribuye electrones por niveles, subniveles y orbitales.',
    paginas: '13',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['electrones', 'orbitales', 'diagrama de Moeller', 'valencia'],
    estado: 'fuente'
  },
  {
    id: 'numeros-cuanticos',
    tema: 'estructura-periodicidad',
    titulo: 'Orbitales y números cuánticos',
    descripcion: 'Amplía la configuración con la descripción cuántica de los electrones.',
    paginas: '14',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['números cuánticos', 'orbital', 'espín', 'diagrama orbital'],
    estado: 'fuente'
  },
  {
    id: 'isotopos',
    tema: 'estructura-periodicidad',
    titulo: 'Número atómico, masa e isótopos',
    descripcion: 'Distingue número atómico, número de masa, isótopos y alótropos.',
    paginas: '15',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['isótopos', 'número atómico', 'número de masa', 'alótropos'],
    estado: 'fuente'
  },
  {
    id: 'mol-masa-molar',
    tema: 'estructura-periodicidad',
    titulo: 'Mol y masa molar',
    descripcion: 'Relaciona partículas, cantidad de sustancia y masa mediante el mol.',
    paginas: '15–16',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['mol', 'masa molar', 'Avogadro', 'partículas'],
    estado: 'fuente'
  },
  {
    id: 'tabla-periodica',
    tema: 'estructura-periodicidad',
    titulo: 'Tabla periódica: grupos y familias',
    descripcion: 'Consulta los 118 elementos y reconoce grupos, periodos y familias.',
    paginas: '17',
    alcance: 'nucleo',
    usos: ['consulta', 'clase', 'practica'],
    etiquetas: ['tabla periódica', 'grupos', 'periodos', 'familias', 'elementos'],
    estado: 'disponible',
    href: './tabla-periodica.html'
  },
  {
    id: 'metales-no-metales',
    tema: 'estructura-periodicidad',
    titulo: 'Metales, no metales y metaloides',
    descripcion: 'Compara propiedades físicas y químicas a partir de su posición periódica.',
    paginas: '17',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['metales', 'no metales', 'metaloides', 'clasificación'],
    estado: 'fuente'
  },
  {
    id: 'bloques-periodicos',
    tema: 'estructura-periodicidad',
    titulo: 'Bloques s, p, d y f',
    descripcion: 'Relaciona la configuración electrónica con las regiones de la tabla.',
    paginas: '18',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'consulta'],
    etiquetas: ['bloque s', 'bloque p', 'bloque d', 'bloque f'],
    estado: 'fuente'
  },
  {
    id: 'tendencias-periodicas',
    tema: 'estructura-periodicidad',
    titulo: 'Tendencias periódicas',
    descripcion: 'Dirección de electronegatividad, ionización, afinidad, carácter y radio atómico.',
    paginas: '18–19',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'consulta', 'practica'],
    etiquetas: ['electronegatividad', 'ionización', 'afinidad electrónica', 'radio atómico'],
    estado: 'fuente'
  },
  {
    id: 'enlaces-lewis',
    tema: 'estructura-periodicidad',
    titulo: 'Enlaces químicos y estructuras de Lewis',
    descripcion: 'Explica enlaces iónicos, covalentes y metálicos mediante electrones de valencia.',
    paginas: '19–21',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['enlace iónico', 'enlace covalente', 'Lewis', 'electrones de valencia'],
    estado: 'fuente'
  },

  {
    id: 'nomenclatura-inorganica',
    tema: 'reaccion-quimica',
    titulo: 'Nomenclatura inorgánica',
    descripcion: 'Nombra óxidos, hidruros, ácidos, hidróxidos y sales.',
    paginas: '22–24',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica', 'consulta'],
    etiquetas: ['óxidos', 'hidruros', 'ácidos', 'hidróxidos', 'sales'],
    estado: 'fuente'
  },
  {
    id: 'numeros-oxidacion',
    tema: 'reaccion-quimica',
    titulo: 'Números de oxidación',
    descripcion: 'Asigna números de oxidación e interpreta pérdida o ganancia de electrones.',
    paginas: '25–26',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['oxidación', 'reducción', 'electrones', 'iones'],
    estado: 'fuente'
  },
  {
    id: 'tipos-reaccion',
    tema: 'reaccion-quimica',
    titulo: 'Tipos de reacción química',
    descripcion: 'Síntesis, descomposición, sustitución simple y sustitución doble.',
    paginas: '27',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['síntesis', 'descomposición', 'sustitución', 'ecuaciones'],
    estado: 'fuente'
  },
  {
    id: 'acidos-bases',
    tema: 'reaccion-quimica',
    titulo: 'Ácidos, bases y neutralización',
    descripcion: 'Compara teorías ácido–base y reconoce neutralizaciones y escala de pH.',
    paginas: '28',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['ácido', 'base', 'neutralización', 'pH', 'Arrhenius'],
    estado: 'fuente'
  },
  {
    id: 'combustion',
    tema: 'reaccion-quimica',
    titulo: 'Reacciones de combustión',
    descripcion: 'Distingue combustión completa e incompleta a partir de sus productos.',
    paginas: '29',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['combustión', 'oxígeno', 'dióxido de carbono', 'monóxido'],
    estado: 'fuente'
  },
  {
    id: 'balanceo-tanteo',
    tema: 'reaccion-quimica',
    titulo: 'Balanceo por tanteo',
    descripcion: 'Conserva el número de átomos mediante coeficientes estequiométricos.',
    paginas: '30',
    alcance: 'nucleo',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['balanceo', 'tanteo', 'conservación de la materia', 'coeficientes'],
    estado: 'fuente'
  },
  {
    id: 'balanceo-redox',
    tema: 'reaccion-quimica',
    titulo: 'Balanceo por oxidación–reducción',
    descripcion: 'Profundiza el balanceo mediante semirreacciones y transferencia de electrones.',
    paginas: '30–32',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['redox', 'semirreacción', 'oxidante', 'reductor', 'balanceo'],
    estado: 'fuente'
  },
  {
    id: 'concentracion-disoluciones',
    tema: 'reaccion-quimica',
    titulo: 'Concentración de disoluciones',
    descripcion: 'Calcula concentraciones porcentuales y molares de una disolución.',
    paginas: '33–35',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['concentración', 'molaridad', 'porcentaje', 'disoluciones'],
    estado: 'fuente'
  },
  {
    id: 'calculos-estequiometricos',
    tema: 'reaccion-quimica',
    titulo: 'Cálculos estequiométricos',
    descripcion: 'Relaciona masa, moles y proporciones dentro de una ecuación química.',
    paginas: '33–35',
    alcance: 'ampliacion',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['estequiometría', 'mol', 'masa', 'proporción'],
    estado: 'fuente'
  },

  {
    id: 'enlace-organico',
    tema: 'unam-organica',
    titulo: 'Enlace e hibridación en química orgánica',
    descripcion: 'Enlaces sigma y pi, hibridación y representación de moléculas orgánicas.',
    paginas: '36',
    alcance: 'unam',
    usos: ['aprende', 'clase'],
    etiquetas: ['hibridación', 'enlace sigma', 'enlace pi', 'orgánica'],
    estado: 'fuente'
  },
  {
    id: 'grupos-funcionales',
    tema: 'unam-organica',
    titulo: 'Grupos funcionales',
    descripcion: 'Reconoce los principales grupos funcionales y sus representaciones.',
    paginas: '37–38',
    alcance: 'unam',
    usos: ['aprende', 'clase', 'consulta'],
    etiquetas: ['grupo funcional', 'alcohol', 'cetona', 'aldehído', 'amina'],
    estado: 'fuente'
  },
  {
    id: 'cadenas-nomenclatura-organica',
    tema: 'unam-organica',
    titulo: 'Cadenas y nomenclatura orgánica',
    descripcion: 'Clasifica cadenas y aplica reglas de nomenclatura a hidrocarburos.',
    paginas: '39–40',
    alcance: 'unam',
    usos: ['aprende', 'clase', 'practica'],
    etiquetas: ['cadenas', 'alcanos', 'alquenos', 'alquinos', 'nomenclatura'],
    estado: 'fuente'
  },
  {
    id: 'energia-equilibrio-cinetica',
    tema: 'unam-fisicoquimica',
    titulo: 'Energía, equilibrio y cinética',
    descripcion: 'El temario del paquete la menciona, pero no contiene apuntes desarrollados.',
    paginas: '4 (sólo temario)',
    alcance: 'unam',
    usos: ['aprende'],
    etiquetas: ['termodinámica', 'equilibrio', 'cinética', 'entalpía'],
    estado: 'referencia'
  }
];

export function segmentosDeTema(tema, alcances = ['nucleo', 'ampliacion']) {
  return SEGMENTOS.filter((segmento) => segmento.tema === tema && alcances.includes(segmento.alcance));
}

export function segmentosEcoems() {
  return SEGMENTOS.filter((segmento) => segmento.alcance !== 'unam');
}

export function segmentosUnam() {
  return SEGMENTOS.filter((segmento) => segmento.alcance === 'unam');
}
