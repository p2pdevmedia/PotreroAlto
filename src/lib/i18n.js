export const LANGUAGE_OPTIONS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' }
];

export const GRADE_SYSTEM_OPTIONS = [
  { code: 'french', label: 'Español / Alemán / Francés / Portugués (French)' },
  { code: 'yds', label: 'Inglés (YDS)' },
  { code: 'uiaa', label: 'Ruso (UIAA)' },
  { code: 'ewbank', label: 'Chino (Ewbank)' }
];

const BASE_ES = {
  howToGetThere: 'Cómo llegar',
  faqGuide: 'FAQ guía',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  searchRoute: 'Buscar vía',
  routeNamePlaceholder: 'Nombre de la vía...',
  noPhoto: 'Sin foto',
  photo: 'Foto',
  gradeLabel: 'Grado',
  noGrade: 'Sin grado',
  noDescription: 'Todavía no hay una descripción cargada para esta vía.',
  noSimilarRoutes: 'No encontramos vías con un nombre similar.',
  language: 'Idioma',
  gradeSystem: 'Sistema de graduación',
  loadErrorTitle: 'No se pudo cargar la información en este entorno',
  loadErrorHintBefore: 'En tu entorno local ejecuta',
  loadErrorHintAfter: 'y verifica acceso de red y disponibilidad de la API pública de theCrag.',
  howToGetThereText: 'Potrero Alto está ubicado en Q8370 San Martín de los Andes, Neuquén. Podés usar el siguiente mapa para ver el punto exacto del sector.',
  mapTitle: 'Mapa de Potrero Alto',
  faqRatingTitle: 'Sistema de puntuación',
  faqRatingBody1: 'En los resultados de búsqueda, la valoración de cada vía aparece con una combinación de emojis en este orden:',
  faqRatingBody2: 'A mayor cantidad de símbolos, mejor puntuada está la vía por la comunidad. Si no ves emojis, significa que todavía no tiene puntuación cargada.',
  faqClimbingGuideTitle: 'FAQ: cómo entender la guía de escalada',
  faqDistributionTitle: 'Distribución de subsectores en el predio',
  faqDistributionBody: 'Esta imagen muestra la distribución de los subsectores dentro del Predio Potrero Alto para que puedas ubicarte más rápido al llegar.',
  openLargeImage: 'Abrir en grande la imagen de distribución de subsectores',
  clickImageToZoom: 'Hacé click en la imagen para verla en grande.',
  faqSubsectorTitle: '¿Qué muestra cada subsector?',
  faqSubsectorBody: 'Cada subsector agrupa las vías por pared o zona. Ahí vas a encontrar cantidad de rutas, dificultad, descripciones y, cuando está disponible, foto de referencia.',
  faqHistogramTitle: '¿Cómo uso el histograma de grados?',
  faqHistogramBody1: 'El gráfico de distribución te ayuda a ver rápidamente si el sector tiene más rutas fáciles, intermedias o duras. Es ideal para planificar una jornada según tu nivel y el de tu cordada.',
  faqHistogramBody2: 'Escala de colores por dificultad en el histograma:',
  colorEasy: 'verde',
  colorMedium: 'azul',
  colorHard: 'rojo',
  colorVeryHard: 'rojo oscuro',
  faqConversionTitle: 'Tabla de conversión de grados (aproximada)',
  faqConversionBody: 'En Potrero Alto usamos principalmente el sistema francés, pero acá tenés una guía rápida para comparar con otros sistemas comunes: Yosemite (YDS), UIAA y Ewbank (Australia/Nueva Zelanda).',
  conversionFrench: 'Francés',
  conversionYds: 'Yosemite (YDS)',
  conversionUiaa: 'UIAA',
  conversionEwbank: 'Ewbank',
  conversionNote: 'Nota: las conversiones entre sistemas son orientativas y pueden variar según el estilo de escalada y la región.',
  faqSearchTitle: '¿Para qué sirve el buscador de vías?',
  faqSearchBody: 'Podés escribir el nombre de una vía y el buscador te sugiere coincidencias similares. En cada resultado vas a ver subsector, grado, descripción y puntuación.',
  rulesTitle: 'Reglamento del sector — Potrero Alto',
  rules1Title: '1️⃣ 🏕️ No acampar',
  rules1Line1: '🚫 No está permitido acampar dentro del sector de escalada.',
  rules1Line2: '🌿 Ayudamos a reducir el impacto ambiental y visual.',
  rules2Title: '2️⃣ 🔥 No hacer fuego',
  rules2Line1: '🚫 Prohibido hacer fuego o fogatas.',
  rules2Line2: '🌲 Zona sensible a incendios.',
  rules3Title: '3️⃣ 🗑️ Basura',
  rules3Line1: '♻️ Todo lo que entra, sale.',
  rules3Line2: '🧹 Llevarse siempre la basura propia.',
  rules3Line3: '💚 Si podés, llevar también basura que encuentres.',
  rules4Title: '4️⃣ 🧗 Respeto por el sector',
  rules4Line1: '🤫 Mantener volumen bajo y ambiente tranquilo.',
  rules4Line2: '🌱 Respetar la flora y el entorno natural.',
  rules5Title: '5️⃣ 🤝 Comunidad',
  rules5Line1: '🛠️ Si disfrutás del lugar, ayudá a mejorarlo.',
  rules5Line2: '🚶 Podés colaborar limpiando senderos o moviendo piedras sueltas.',
  rules5Line3: '💬 Compartí buenas prácticas con otros escaladores.',
  rules6Title: '6️⃣ 🚙 Estacionamiento responsable🅿️',
  rules6Line1: '↔️ Estacionar pensando en ocupar la menor parte posible del camino.',
  rules6Line2: '🚗 Dejar espacio suficiente para el paso de otros vehículos.',
  rules6Line3: '🚜 Mantener libre el acceso para vecinos, servicios y emergencias.',
  rules6Line4: 'El acceso depende del respeto y la buena convivencia con los vecinos. Estacionar bien es parte de cuidar el sector.',
  spiritTitle: '⭐ Espíritu del lugar',
  spiritBody: 'Potrero Alto es un espacio construido entre todos. Cuidarlo es responsabilidad compartida.',
  zoomedImageLabel: 'Imagen ampliada de distribución de subsectores',
  close: 'Cerrar',
  zoomedImageAlt: 'Distribución de los subsectores dentro del Predio Potrero Alto ampliada',
  sectorImageAlt: 'Distribución de los subsectores dentro del Predio Potrero Alto',
  footerMadeWith: 'Hecho con 💪 para la comunidad ❤️',
  footerGiftBeer: 'Regalame una 🍺',
  goHome: 'Ir al inicio',
  userPreferences: 'Preferencias de usuario',
  distributionByGrade: 'Distribución de vías por grado',
  withGrade: 'con grado',
  gradeColorSentence: 'Escala de colores por dificultad en el histograma: verde para grados más fáciles, azul para intermedios, rojo para difíciles y rojo oscuro para los más exigentes.',
  viewSubsectorRoutes: 'Ver rutas del subsector',
  subsectorImageAlt: 'Imagen del subsector',
  routeSingle: 'ruta',
  routePlural: 'rutas',
  closeButton: 'Cerrar',
  gradesIn: 'Grados en',
  noRoutesInSubsector: 'Sin vías registradas en este subsector.',
  routeImageAlt: 'Imagen de la vía',
  ratingAria: 'Valoración'
};

const BASE_EN = {
  howToGetThere: 'How to get there',
  faqGuide: 'FAQ guide',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  searchRoute: 'Search route',
  routeNamePlaceholder: 'Route name...',
  noPhoto: 'No photo',
  photo: 'Photo',
  gradeLabel: 'Grade',
  noGrade: 'No grade',
  noDescription: 'No description has been uploaded for this route yet.',
  noSimilarRoutes: 'No routes with a similar name were found.',
  language: 'Language',
  gradeSystem: 'Grade system',
  loadErrorTitle: 'Could not load data in this environment',
  loadErrorHintBefore: 'In your local environment run',
  loadErrorHintAfter: 'and verify network access and public theCrag API availability.',
  howToGetThereText: 'Potrero Alto is located at Q8370 San Martín de los Andes, Neuquén. You can use the map below to see the exact location of the sector.',
  mapTitle: 'Potrero Alto map',
  faqRatingTitle: 'Rating system',
  faqRatingBody1: 'In search results, each route rating appears using this emoji sequence:',
  faqRatingBody2: 'The more symbols shown, the better the route is rated by the community. If you see no emojis, it has no rating yet.',
  faqClimbingGuideTitle: 'FAQ: how to read the climbing guide',
  faqDistributionTitle: 'Subsector layout inside the property',
  faqDistributionBody: 'This image shows the distribution of subsectors inside Potrero Alto so you can orient yourself faster on arrival.',
  openLargeImage: 'Open full-size subsector layout image',
  clickImageToZoom: 'Click the image to view it larger.',
  faqSubsectorTitle: 'What does each subsector show?',
  faqSubsectorBody: 'Each subsector groups routes by wall or area. You will find route count, grade, descriptions and reference photos when available.',
  faqHistogramTitle: 'How do I use the grade histogram?',
  faqHistogramBody1: 'The distribution chart helps you quickly see whether the sector has mostly easy, intermediate or hard routes. It is useful for planning according to your level and your climbing partner’s level.',
  faqHistogramBody2: 'Difficulty color scale in the histogram:',
  colorEasy: 'green',
  colorMedium: 'blue',
  colorHard: 'red',
  colorVeryHard: 'dark red',
  faqConversionTitle: 'Grade conversion table (approximate)',
  faqConversionBody: 'At Potrero Alto we mainly use the French system, but this quick guide lets you compare with Yosemite (YDS), UIAA and Ewbank (Australia/New Zealand).',
  conversionFrench: 'French',
  conversionYds: 'Yosemite (YDS)',
  conversionUiaa: 'UIAA',
  conversionEwbank: 'Ewbank',
  conversionNote: 'Note: conversions are approximate and may vary by climbing style and region.',
  faqSearchTitle: 'What is route search for?',
  faqSearchBody: 'You can type a route name and the search tool suggests similar matches. Each result shows subsector, grade, description and rating.',
  rulesTitle: 'Sector rules — Potrero Alto',
  rules1Title: '1️⃣ 🏕️ No camping',
  rules1Line1: '🚫 Camping is not allowed inside the climbing sector.',
  rules1Line2: '🌿 This helps reduce environmental and visual impact.',
  rules2Title: '2️⃣ 🔥 No fire',
  rules2Line1: '🚫 No campfires or open fire allowed.',
  rules2Line2: '🌲 Fire-sensitive area.',
  rules3Title: '3️⃣ 🗑️ Trash',
  rules3Line1: '♻️ Pack in, pack out.',
  rules3Line2: '🧹 Always take your trash with you.',
  rules3Line3: '💚 If you can, pick up extra litter too.',
  rules4Title: '4️⃣ 🧗 Respect the sector',
  rules4Line1: '🤫 Keep volume low and preserve a calm environment.',
  rules4Line2: '🌱 Respect flora and the natural surroundings.',
  rules5Title: '5️⃣ 🤝 Community',
  rules5Line1: '🛠️ If you enjoy the place, help improve it.',
  rules5Line2: '🚶 You can help by cleaning trails or moving loose rocks.',
  rules5Line3: '💬 Share good practices with other climbers.',
  rules6Title: '6️⃣ 🚙 Responsible parking 🅿️',
  rules6Line1: '↔️ Park while occupying as little road space as possible.',
  rules6Line2: '🚗 Leave enough room for other vehicles to pass.',
  rules6Line3: '🚜 Keep access clear for residents, services and emergencies.',
  rules6Line4: 'Access depends on respect and good coexistence with neighbors. Parking well is part of taking care of the sector.',
  spiritTitle: '⭐ Spirit of the place',
  spiritBody: 'Potrero Alto is a place built by everyone. Taking care of it is a shared responsibility.',
  zoomedImageLabel: 'Expanded subsector layout image',
  close: 'Close',
  zoomedImageAlt: 'Expanded view of Potrero Alto subsector distribution',
  sectorImageAlt: 'Distribution of subsectors inside Potrero Alto',
  footerMadeWith: 'Made with 💪 for the community ❤️',
  footerGiftBeer: 'Buy me a 🍺',
  goHome: 'Go to home',
  userPreferences: 'User preferences',
  distributionByGrade: 'Route distribution by grade',
  withGrade: 'with grade',
  gradeColorSentence: 'Difficulty color scale in the histogram: green for easier grades, blue for intermediate, red for hard and dark red for the most demanding.',
  viewSubsectorRoutes: 'View routes in subsector',
  subsectorImageAlt: 'Subsector image',
  routeSingle: 'route',
  routePlural: 'routes',
  closeButton: 'Close',
  gradesIn: 'Grades in',
  noRoutesInSubsector: 'No routes registered in this subsector.',
  routeImageAlt: 'Route image',
  ratingAria: 'Rating'
};

const COPY = {
  es: BASE_ES,
  en: BASE_EN,
  de: {
    ...BASE_EN,
    howToGetThere: 'Anfahrt',
    faqGuide: 'FAQ',
    language: 'Sprache',
    gradeSystem: 'Bewertungssystem'
  },
  zh: {
    ...BASE_EN,
    howToGetThere: '如何到达',
    faqGuide: '常见问题',
    language: '语言',
    gradeSystem: '分级系统'
  },
  ru: {
    ...BASE_EN,
    howToGetThere: 'Как добраться',
    faqGuide: 'FAQ',
    language: 'Язык',
    gradeSystem: 'Система категорий'
  },
  fr: {
    ...BASE_EN,
    howToGetThere: 'Comment y aller',
    faqGuide: 'Guide FAQ',
    language: 'Langue',
    gradeSystem: 'Système de cotation'
  },
  pt: {
    ...BASE_EN,
    howToGetThere: 'Como chegar',
    faqGuide: 'FAQ guia',
    language: 'Idioma',
    gradeSystem: 'Sistema de graduação'
  }
};

const GRADE_BUCKET_TO_SYSTEM = {
  '<5a': { french: '<5a', yds: '5.7', uiaa: 'VI-', ewbank: '16' },
  '5a': { french: '5a', yds: '5.8', uiaa: 'VI', ewbank: '17' },
  '5b': { french: '5b', yds: '5.9', uiaa: 'VI+', ewbank: '18' },
  '5c': { french: '5c', yds: '5.10a', uiaa: 'VII-', ewbank: '19' },
  '6a': { french: '6a', yds: '5.10b', uiaa: 'VII', ewbank: '20' },
  '6b': { french: '6b', yds: '5.10c', uiaa: 'VII+', ewbank: '21' },
  '6c': { french: '6c', yds: '5.11a', uiaa: 'VIII-', ewbank: '22' },
  '7a': { french: '7a', yds: '5.11d', uiaa: 'VIII', ewbank: '24' },
  '7b': { french: '7b', yds: '5.12b', uiaa: 'VIII+', ewbank: '25' },
  '7c': { french: '7c', yds: '5.12d', uiaa: 'IX-', ewbank: '27' },
  '8a': { french: '8a', yds: '5.13b', uiaa: 'IX', ewbank: '28' },
  '8b': { french: '8b', yds: '5.13d', uiaa: 'IX+', ewbank: '30' },
  '8c': { french: '8c', yds: '5.14b', uiaa: 'X-', ewbank: '32' },
  '9a': { french: '9a', yds: '5.14d', uiaa: 'X', ewbank: '34' },
  '>9a': { french: '>9a', yds: '5.15a+', uiaa: 'X+', ewbank: '35+' }
};

export function t(locale, key) {
  return COPY[locale]?.[key] ?? COPY.es[key] ?? key;
}

export function detectPreferredLocale() {
  if (typeof window === 'undefined') {
    return 'es';
  }

  const browserLanguages = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
    Intl.DateTimeFormat().resolvedOptions().locale
  ].filter(Boolean);

  for (const languageTag of browserLanguages) {
    const normalized = String(languageTag).toLowerCase();
    const primary = normalized.split('-')[0];

    if (LANGUAGE_OPTIONS.some((option) => option.code === primary)) {
      return primary;
    }
  }

  return 'es';
}

export function normalizeFrenchGrade(grade) {
  if (!grade) return null;
  const cleaned = String(grade).trim().toLowerCase();
  if (!cleaned || cleaned.includes('sin grado') || cleaned.includes('proyecto')) return null;
  const primary = cleaned.split('/')[0]?.trim();
  const match = primary?.match(/(\d)([abc]?)(\+)?/);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  const letter = match[2] || (match[3] ? 'c' : 'a');
  if (n < 5) return '<5a';
  if (n > 9) return '>9a';
  return `${n}${letter}`;
}

export function convertGrade(grade, gradeSystem = 'french') {
  const bucket = normalizeFrenchGrade(grade);
  if (!bucket) return grade;
  return GRADE_BUCKET_TO_SYSTEM[bucket]?.[gradeSystem] ?? GRADE_BUCKET_TO_SYSTEM[bucket]?.french ?? grade;
}

export function getBucketGradeLabel(bucket, gradeSystem = 'french') {
  return GRADE_BUCKET_TO_SYSTEM[bucket]?.[gradeSystem] ?? bucket;
}
