// Fotografías de saberes y rituales del altiplano (sección Presentación). Originales en imagenes/Nueva carpeta;
// en /media/saberes/ están optimizadas (grande para el visor y mini para la galería).
export const saberes = [
  {
    id: 'autoridades-originarias',
    titulo: 'Sesión de autoridades originarias',
    texto: 'Autoridades de los pueblos originarios en diálogo.',
  },
  {
    id: 'tunta',
    titulo: 'Elaboración de la tunta',
    texto: 'La papa se deja en agua corriente, un saber andino de conservación de alimentos.',
  },
  {
    id: 'hilado',
    titulo: 'Adaptación de tecnología para el hilado',
    texto: 'Máquina de hilar de madera: el saber textil andino en diálogo con la tecnología.',
  },
  {
    id: 'conopa-alpaca',
    titulo: 'Conopa de alpaca y hojas de coca',
    texto: 'Ofrenda andina para la fertilidad del ganado.',
  },
  {
    id: 'mesa-ritual-candelaria',
    titulo: 'Mesa ritual',
    texto: 'Preparación de la mesa ritual en la festividad de la Candelaria.',
  },
  {
    id: 'ritual-cochamacho',
    titulo: 'Ritual del cochamacho',
    texto: 'Comunidades reunidas en torno al ritual.',
  },
  {
    id: 'bueyes-ritual-cochamacho',
    titulo: 'Bueyes adornados',
    texto: 'La yunta engalanada para el ritual del cochamacho.',
  },
  {
    id: 'ritual-candelaria',
    titulo: 'Ritual en la Candelaria',
    texto: 'Ofrenda con fuego durante la festividad de la Virgen de la Candelaria, en Puno.',
  },
]

export const fotoSaber = (id) => `/media/saberes/${id}.jpg`
export const miniSaber = (id) => `/media/saberes/mini/${id}.jpg`
