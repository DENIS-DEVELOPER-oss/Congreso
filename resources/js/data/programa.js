// Programa tentativo por día: presencial (campus UNA Puno) y virtual (Zoom), 26 y 27 de noviembre de 2026.
// Horarios, títulos y asignación de ponentes por confirmar con la comisión organizadora.
// tipo: conferencia | mesa | panel | cultural | campo | general
export const programa = [
  {
    id: 'dia-1',
    dia: 'Día 1',
    fecha: 'Jueves 26 de noviembre',
    actividades: [
      { hora: '08:00', tipo: 'general', titulo: 'Acreditación y conexión a la sala virtual', ponente: 'Comisión organizadora', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '09:00', tipo: 'general', titulo: 'Ceremonia de inauguración', ponente: 'Autoridades de la UNA Puno', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '10:00', tipo: 'conferencia', titulo: 'Conferencias centrales', ponente: 'Ponentes centrales', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '15:00', tipo: 'mesa', titulo: 'Mesas temáticas: saberes andino-amazónicos', ponente: 'Ponentes de las mesas', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '18:00', tipo: 'cultural', titulo: 'Presentación cultural de bienvenida', ponente: 'Conjuntos de la región Puno', lugar: 'Campus UNA Puno y Zoom' },
    ],
  },
  {
    id: 'dia-2',
    dia: 'Día 2',
    fecha: 'Viernes 27 de noviembre',
    actividades: [
      { hora: '09:00', tipo: 'conferencia', titulo: 'Conferencias centrales', ponente: 'Ponentes centrales', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '11:30', tipo: 'panel', titulo: 'Diálogo intercultural en la educación superior universitaria', ponente: 'Panel de ponentes centrales', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '15:00', tipo: 'mesa', titulo: 'Mesas temáticas: formación universitaria intercultural', ponente: 'Ponentes de las mesas', lugar: 'Campus UNA Puno y Zoom' },
      { hora: '18:00', tipo: 'general', titulo: 'Clausura y entrega de certificados', ponente: 'Comisión organizadora', lugar: 'Campus UNA Puno y Zoom' },
    ],
  },
]
