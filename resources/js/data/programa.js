// Programación de ponencias centrales (documento oficial de la comisión organizadora).
// Presencial en Educación Continua UNA Puno, 26 y 27 de noviembre de 2026. Hora de Perú (UTC-5).
// tipo: conferencia | mesa | panel | cultural | campo | general
// modalidad: 'Presencial' | 'Virtual' | null (por confirmar). fin: hora de término (opcional).
const SEDE = 'Educación Continua UNA Puno'

export const programa = [
  {
    id: 'dia-1',
    dia: 'Día 1',
    fecha: 'Jueves 26 de noviembre',
    actividades: [
      { hora: '08:00', fin: '10:00', tipo: 'general', titulo: 'Inauguración del evento', ponente: 'Autoridades de la UNA Puno', lugar: SEDE },
      {
        hora: '10:00', fin: '10:30', tipo: 'conferencia', modalidad: 'Virtual',
        titulo: 'Reflexiones sociológicas sobre cultura e interculturalidad en Latinoamérica',
        ponente: 'Dr. Adrián Scribano', detalle: 'Sociólogo, investigador del CONICET, Argentina',
      },
      {
        hora: '10:30', fin: '11:00', tipo: 'conferencia', modalidad: 'Virtual',
        titulo: 'El Buen Vivir en la educación universitaria latinoamericana: diálogo intercultural entre los conocimientos científicos y los saberes de los pueblos originarios',
        ponente: 'Dr. Jaime Ríos Burga', detalle: 'Sociólogo, Facultad de Ciencias Sociales, UNMSM, Lima',
      },
      {
        hora: '11:00', fin: '11:30', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'La apuesta por una descolonización para el diálogo intercultural emancipatorio en la educación superior universitaria desde el sur andino',
        ponente: 'Dr. Vicente Alanoca Arocutipa', detalle: 'Docente de Antropología, Facultad de Ciencias Sociales, UNA Puno', lugar: SEDE,
      },
      {
        hora: '11:30', fin: '12:00', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'El diálogo mítico en la cosmovisión andina',
        ponente: 'Dr. Emilio Chambi Apaza', detalle: 'Docente de Sociología, Facultad de Ciencias Sociales, UNA Puno', lugar: SEDE,
      },
      {
        hora: '12:00', fin: '12:30', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'Los caminos de crianza del saber en los niños de Amantaní, Puno',
        ponente: 'Dr. Juan José Pari Arapa', detalle: 'Docente de la Facultad de Ciencias de la Educación, UNA Puno', lugar: SEDE,
      },
      { hora: '12:30', tipo: 'general', titulo: 'Almuerzo', ponente: 'Receso', lugar: null },
      { hora: '14:00', tipo: 'mesa', titulo: 'Inicio de ponencias de las mesas de trabajo', ponente: 'Ponentes de las mesas temáticas', lugar: SEDE },
    ],
  },
  {
    id: 'dia-2',
    dia: 'Día 2',
    fecha: 'Viernes 27 de noviembre',
    actividades: [
      {
        hora: '09:00', fin: '09:30', tipo: 'conferencia', modalidad: 'Virtual',
        titulo: 'Desecación de lagos en el valle de México, una apreciación hermenéutica',
        ponente: 'Mtro. Lorenzo Espinoza Gómez', detalle: 'Docente de la Universidad Autónoma Chapingo, México',
      },
      {
        hora: '09:30', fin: '10:00', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'La Universidad Intercultural de Quillabamba, educación pertinente para jóvenes de pueblos originarios y la integración de saberes',
        ponente: 'Dr. Florentino Vizcarra Pinto', detalle: 'Docente de la Universidad Intercultural de Quillabamba', lugar: SEDE,
      },
      {
        hora: '10:00', fin: '10:30', tipo: 'conferencia', modalidad: null,
        titulo: 'Conocimiento científico y tecnológico: aportes para la sostenibilidad y el desarrollo en la perspectiva del diálogo de saberes',
        ponente: 'Dr. Ángel Canales Gutiérrez', detalle: 'Docente de la Facultad de Ciencias Biológicas, UNA Puno', lugar: SEDE,
      },
      {
        hora: '10:30', fin: '11:00', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: '«Yaku Unu Mama» y «Madre Agua», sujeto de derechos en gobiernos subnacionales en la región Puno, periodo 2019-2025',
        ponente: 'Dr. Juan Casazola Ccama', detalle: 'Docente de la Facultad de Ciencias Jurídicas y Políticas, UNA Puno', lugar: SEDE,
      },
      {
        hora: '11:00', fin: '11:30', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'Pueblos indígenas, interculturalidad y educación superior: el caso del pueblo aimara peruano. De construcción colectiva a demandas',
        ponente: 'Antrop. Rolando Pilco Mallea', detalle: 'Director de IDECA Puno', lugar: SEDE,
      },
      {
        hora: '11:30', fin: '12:00', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'Perspectiva interepistémica del diálogo intercultural: del saber científico hegemónico a la articulación equitativa de conocimientos en la educación universitaria peruana',
        ponente: 'Dr. Porfirio Enríquez Salas y Carlos V. Enríquez Añamuro', detalle: 'Docentes de la Facultad de Ciencias Sociales y de la FMVZ, UNA Puno', lugar: SEDE,
      },
      {
        hora: '12:30', fin: '13:00', tipo: 'conferencia', modalidad: 'Presencial',
        titulo: 'El saber sagrado y la interculturalidad en la educación universitaria',
        ponente: 'Antrop. Rubén Saraza Barriga', detalle: 'Sabio originario aimara lupaka, en estudios de sabiduría ancestral', lugar: SEDE,
      },
      { hora: '13:00', tipo: 'general', titulo: 'Almuerzo', ponente: 'Receso', lugar: null },
      { hora: '14:00', tipo: 'mesa', titulo: 'Inicio de ponencias de las mesas de trabajo', ponente: 'Ponentes de las mesas temáticas', lugar: SEDE },
      { hora: 'Cierre', tipo: 'general', titulo: 'Clausura del evento', ponente: 'Comisión organizadora', lugar: SEDE },
    ],
  },
]
