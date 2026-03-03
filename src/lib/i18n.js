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
    gradeSystem: 'Bewertungssystem',
    howToGetThereText: 'Potrero Alto liegt in Q8370 San Martín de los Andes, Neuquén. Mit der folgenden Karte findest du den genauen Standort des Sektors.',
    faqRatingBody1: 'In den Suchergebnissen wird die Bewertung jeder Route mit dieser Emoji-Reihenfolge angezeigt:',
    faqRatingBody2: 'Je mehr Symbole, desto besser wurde die Route von der Community bewertet. Wenn keine Emojis angezeigt werden, gibt es noch keine Bewertung.',
    faqDistributionBody: 'Dieses Bild zeigt die Verteilung der Untersektoren im Gebiet Potrero Alto, damit du dich bei der Ankunft schneller orientieren kannst.',
    faqSubsectorBody: 'Jeder Untersektor gruppiert Routen nach Wand oder Bereich. Dort findest du Anzahl der Routen, Schwierigkeitsgrad, Beschreibungen und – wenn verfügbar – Referenzfotos.',
    faqHistogramBody1: 'Das Verteilungsdiagramm hilft dir schnell zu sehen, ob der Sektor mehr leichte, mittlere oder schwere Routen hat. Ideal, um den Tag nach deinem Niveau und dem deiner Seilpartner:innen zu planen.',
    gradeColorSentence: 'Farbskala der Schwierigkeit im Histogramm: Grün für leichtere Grade, Blau für mittlere, Rot für schwere und Dunkelrot für die anspruchsvollsten.',
    faqConversionBody: 'In Potrero Alto nutzen wir hauptsächlich das französische System. Diese Kurzübersicht hilft dir beim Vergleich mit Yosemite (YDS), UIAA und Ewbank (Australien/Neuseeland).',
    conversionNote: 'Hinweis: Umrechnungen zwischen Systemen sind nur Richtwerte und können je nach Kletterstil und Region variieren.',
    faqSearchBody: 'Du kannst den Namen einer Route eingeben und die Suche schlägt ähnliche Treffer vor. Jedes Ergebnis zeigt Untersektor, Grad, Beschreibung und Bewertung.'
  },
  zh: {
    ...BASE_EN,
    howToGetThere: '如何到达',
    faqGuide: '常见问题',
    language: '语言',
    gradeSystem: '分级系统',
    howToGetThereText: 'Potrero Alto 位于内乌肯省圣马丁德洛斯安第斯 Q8370。你可以使用下方地图查看该攀岩区域的准确位置。',
    faqRatingBody1: '在搜索结果中，每条线路的评分会按以下表情顺序显示：',
    faqRatingBody2: '符号越多，表示社区给这条线路的评分越高。如果没有表情，说明该线路暂时还没有评分。',
    faqDistributionBody: '这张图片展示了 Potrero Alto 场地内各子区域的分布，帮助你到达后更快定位。',
    faqSubsectorBody: '每个子区域会按岩壁或区域汇总线路。你可以看到线路数量、难度、描述，以及可用时的参考照片。',
    faqHistogramBody1: '分布图可以帮助你快速判断该区域以简单、中等还是高难线路为主。非常适合根据你和同伴的水平规划当天行程。',
    gradeColorSentence: '柱状图中的难度配色：绿色表示较易级别，蓝色表示中等，红色表示较难，深红色表示最具挑战。',
    faqConversionBody: 'Potrero Alto 主要使用法式分级。此快速对照可帮助你与 Yosemite（YDS）、UIAA 和 Ewbank（澳大利亚/新西兰）进行比较。',
    conversionNote: '注意：不同分级系统之间的换算仅供参考，可能因攀登风格和地区而有所差异。',
    faqSearchBody: '你可以输入线路名称，搜索工具会推荐相近结果。每条结果都会显示子区域、难度、描述和评分。'
  },
  ru: {
    ...BASE_EN,
    howToGetThere: 'Как добраться',
    faqGuide: 'FAQ',
    language: 'Язык',
    gradeSystem: 'Система категорий',
    howToGetThereText: 'Potrero Alto находится по адресу Q8370 San Martín de los Andes, Neuquén. Используйте карту ниже, чтобы увидеть точную точку сектора.',
    faqRatingBody1: 'В результатах поиска рейтинг каждого маршрута показывается в такой последовательности эмодзи:',
    faqRatingBody2: 'Чем больше символов, тем выше оценка маршрута сообществом. Если эмодзи нет, значит оценка ещё не добавлена.',
    faqDistributionBody: 'Это изображение показывает расположение подсекторов внутри Potrero Alto, чтобы вы быстрее сориентировались по прибытии.',
    faqSubsectorBody: 'Каждый подсектор группирует маршруты по стене или зоне. Там вы найдёте количество маршрутов, сложность, описания и, если доступны, фото-ориентиры.',
    faqHistogramBody1: 'График распределения помогает быстро понять, каких маршрутов больше: простых, средних или сложных. Это удобно для планирования дня под ваш уровень и уровень напарника.',
    gradeColorSentence: 'Цветовая шкала сложности на гистограмме: зелёный — более лёгкие категории, синий — средние, красный — сложные, тёмно-красный — самые требовательные.',
    faqConversionBody: 'В Potrero Alto в основном используется французская система, но эта краткая таблица помогает сравнить её с Yosemite (YDS), UIAA и Ewbank (Австралия/Новая Зеландия).',
    conversionNote: 'Примечание: соответствия между системами ориентировочные и могут отличаться в зависимости от стиля лазания и региона.',
    faqSearchBody: 'Вы можете ввести название маршрута, и поиск предложит похожие совпадения. В каждом результате указаны подсектор, категория, описание и рейтинг.'
  },
  fr: {
    ...BASE_EN,
    howToGetThere: 'Comment y aller',
    faqGuide: 'Guide FAQ',
    language: 'Langue',
    gradeSystem: 'Système de cotation',
    howToGetThereText: 'Potrero Alto se trouve à Q8370 San Martín de los Andes, Neuquén. Vous pouvez utiliser la carte ci-dessous pour voir l’emplacement exact du secteur.',
    faqRatingBody1: 'Dans les résultats de recherche, la note de chaque voie apparaît avec cette séquence d’emojis :',
    faqRatingBody2: 'Plus il y a de symboles, meilleure est la note donnée par la communauté. S’il n’y a pas d’emojis, cela signifie qu’aucune note n’a encore été enregistrée.',
    faqDistributionBody: 'Cette image montre la répartition des sous-secteurs dans le site de Potrero Alto afin de vous orienter plus rapidement à l’arrivée.',
    faqSubsectorBody: 'Chaque sous-secteur regroupe les voies par paroi ou zone. Vous y trouverez le nombre de voies, la difficulté, des descriptions et, quand elles sont disponibles, des photos de référence.',
    faqHistogramBody1: 'Le graphique de répartition vous aide à voir rapidement si le secteur comporte surtout des voies faciles, intermédiaires ou dures. Idéal pour planifier la journée selon votre niveau et celui de votre cordée.',
    gradeColorSentence: 'Échelle de couleurs de difficulté dans l’histogramme : vert pour les niveaux plus faciles, bleu pour intermédiaire, rouge pour difficile et rouge foncé pour les plus exigeants.',
    faqConversionBody: 'À Potrero Alto, nous utilisons surtout le système français, mais ce guide rapide permet de comparer avec Yosemite (YDS), UIAA et Ewbank (Australie/Nouvelle-Zélande).',
    conversionNote: 'Remarque : les conversions entre systèmes sont indicatives et peuvent varier selon le style d’escalade et la région.',
    faqSearchBody: 'Vous pouvez saisir le nom d’une voie et la recherche propose des correspondances similaires. Chaque résultat affiche le sous-secteur, la cotation, la description et la note.'
  },
  pt: {
    ...BASE_EN,
    howToGetThere: 'Como chegar',
    faqGuide: 'FAQ guia',
    language: 'Idioma',
    gradeSystem: 'Sistema de graduação',
    howToGetThereText: 'Potrero Alto fica em Q8370 San Martín de los Andes, Neuquén. Você pode usar o mapa abaixo para ver o ponto exato do setor.',
    faqRatingBody1: 'Nos resultados de busca, a avaliação de cada via aparece nesta sequência de emojis:',
    faqRatingBody2: 'Quanto mais símbolos, melhor a via foi avaliada pela comunidade. Se não houver emojis, significa que ainda não há avaliação registrada.',
    faqDistributionBody: 'Esta imagem mostra a distribuição dos subsetores dentro do Potrero Alto para que você se localize mais rápido ao chegar.',
    faqSubsectorBody: 'Cada subsetor agrupa as vias por parede ou área. Ali você encontra quantidade de vias, grau, descrições e, quando disponível, foto de referência.',
    faqHistogramBody1: 'O gráfico de distribuição ajuda você a ver rapidamente se o setor tem mais vias fáceis, intermediárias ou difíceis. É ideal para planejar o dia de acordo com o seu nível e o da sua dupla.',
    gradeColorSentence: 'Escala de cores de dificuldade no histograma: verde para graus mais fáceis, azul para intermediários, vermelho para difíceis e vermelho escuro para os mais exigentes.',
    faqConversionBody: 'Em Potrero Alto usamos principalmente o sistema francês, mas este guia rápido permite comparar com Yosemite (YDS), UIAA e Ewbank (Austrália/Nova Zelândia).',
    conversionNote: 'Observação: as conversões entre sistemas são aproximadas e podem variar conforme o estilo de escalada e a região.',
    faqSearchBody: 'Você pode digitar o nome de uma via e a busca sugere correspondências semelhantes. Em cada resultado você verá subsetor, grau, descrição e avaliação.'
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
