export const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' }
];

export const GRADE_SYSTEMS = [
  { code: 'es', labelKey: 'gradeSystemSpanish' },
  { code: 'en', labelKey: 'gradeSystemEnglish' },
  { code: 'de', labelKey: 'gradeSystemGerman' },
  { code: 'zh', labelKey: 'gradeSystemChinese' },
  { code: 'ru', labelKey: 'gradeSystemRussian' },
  { code: 'fr', labelKey: 'gradeSystemFrench' },
  { code: 'pt', labelKey: 'gradeSystemPortuguese' }
];

export const translations = {
  es: {
    howToGet: 'Cómo llegar',
    faqGuide: 'FAQ guía',
    searchRoute: 'Buscar vía',
    searchPlaceholder: 'Ej: La Chiva, Sol de otoño, etc.',
    noResults: 'No encontramos coincidencias para “{term}”.',
    suggestedRoutes: 'Vías sugeridas',
    language: 'Idioma',
    gradingSystem: 'Sistema de graduación',
    userMenu: 'Opciones de idioma y graduación',
    gradeSystemSpanish: 'Español',
    gradeSystemEnglish: 'Inglés',
    gradeSystemGerman: 'Alemán (UIAA)',
    gradeSystemChinese: 'Chino',
    gradeSystemRussian: 'Ruso',
    gradeSystemFrench: 'Francés',
    gradeSystemPortuguese: 'Portugués',
    routeGradeAria: 'Grado {grade} ({system})',
    distributionByGrade: 'Distribución de vías por grado',
    withGrade: '{count} con grado',
    routesInGrade: '{count} vías en grado {grade}',
    mapTitle: 'Cómo llegar',
    mapDescription:
      'Potrero Alto está ubicado en Q8370 San Martín de los Andes, Neuquén. Podés usar el siguiente mapa para ver el punto exacto del sector.'
  },
  en: {
    howToGet: 'How to get there',
    faqGuide: 'FAQ guide',
    searchRoute: 'Search route',
    searchPlaceholder: 'Ex: La Chiva, Sol de otoño, etc.',
    noResults: 'No matches found for “{term}”.',
    suggestedRoutes: 'Suggested routes',
    language: 'Language',
    gradingSystem: 'Grading system',
    userMenu: 'Language and grade options',
    gradeSystemSpanish: 'Spanish',
    gradeSystemEnglish: 'English',
    gradeSystemGerman: 'German (UIAA)',
    gradeSystemChinese: 'Chinese',
    gradeSystemRussian: 'Russian',
    gradeSystemFrench: 'French',
    gradeSystemPortuguese: 'Portuguese',
    routeGradeAria: 'Grade {grade} ({system})',
    distributionByGrade: 'Route distribution by grade',
    withGrade: '{count} with grade',
    routesInGrade: '{count} routes in grade {grade}',
    mapTitle: 'How to get there',
    mapDescription:
      'Potrero Alto is located in Q8370 San Martín de los Andes, Neuquén. Use the map below to find the exact location.'
  },
  de: {
    howToGet: 'Anfahrt', faqGuide: 'FAQ-Leitfaden', searchRoute: 'Route suchen',
    searchPlaceholder: 'Z. B.: La Chiva, Sol de otoño...', noResults: 'Keine Treffer für „{term}“.', suggestedRoutes: 'Vorgeschlagene Routen',
    language: 'Sprache', gradingSystem: 'Bewertungssystem', userMenu: 'Sprach- und Grad-Optionen',
    gradeSystemSpanish: 'Spanisch', gradeSystemEnglish: 'Englisch', gradeSystemGerman: 'Deutsch (UIAA)', gradeSystemChinese: 'Chinesisch', gradeSystemRussian: 'Russisch', gradeSystemFrench: 'Französisch', gradeSystemPortuguese: 'Portugiesisch',
    routeGradeAria: 'Grad {grade} ({system})', distributionByGrade: 'Routenverteilung nach Grad', withGrade: '{count} mit Grad', routesInGrade: '{count} Routen im Grad {grade}',
    mapTitle: 'Anfahrt', mapDescription: 'Potrero Alto liegt in Q8370 San Martín de los Andes, Neuquén. Verwende die Karte unten für den genauen Standort.'
  },
  zh: {
    howToGet: '如何到达', faqGuide: '常见问题', searchRoute: '搜索线路', searchPlaceholder: '例如：La Chiva, Sol de otoño...',
    noResults: '未找到“{term}”的结果。', suggestedRoutes: '推荐线路', language: '语言', gradingSystem: '难度系统', userMenu: '语言和难度设置',
    gradeSystemSpanish: '西班牙', gradeSystemEnglish: '英语', gradeSystemGerman: '德语 (UIAA)', gradeSystemChinese: '中文', gradeSystemRussian: '俄语', gradeSystemFrench: '法语', gradeSystemPortuguese: '葡萄牙语',
    routeGradeAria: '难度 {grade} ({system})', distributionByGrade: '按难度分布', withGrade: '{count} 条有难度', routesInGrade: '{count} 条线路，难度 {grade}',
    mapTitle: '如何到达', mapDescription: 'Potrero Alto 位于 Q8370 San Martín de los Andes, Neuquén。可使用下方地图查看准确位置。'
  },
  ru: {
    howToGet: 'Как добраться', faqGuide: 'FAQ', searchRoute: 'Поиск маршрута', searchPlaceholder: 'Напр.: La Chiva, Sol de otoño...',
    noResults: 'Совпадений для «{term}» не найдено.', suggestedRoutes: 'Рекомендуемые маршруты', language: 'Язык', gradingSystem: 'Система категорий', userMenu: 'Язык и система категорий',
    gradeSystemSpanish: 'Испанская', gradeSystemEnglish: 'Английская', gradeSystemGerman: 'Немецкая (UIAA)', gradeSystemChinese: 'Китайская', gradeSystemRussian: 'Русская', gradeSystemFrench: 'Французская', gradeSystemPortuguese: 'Португальская',
    routeGradeAria: 'Категория {grade} ({system})', distributionByGrade: 'Распределение по категориям', withGrade: '{count} с категорией', routesInGrade: '{count} маршрутов категории {grade}',
    mapTitle: 'Как добраться', mapDescription: 'Potrero Alto находится в Q8370 San Martín de los Andes, Neuquén. Используйте карту ниже для точной точки.'
  },
  fr: {
    howToGet: 'Comment y aller', faqGuide: 'Guide FAQ', searchRoute: 'Rechercher une voie', searchPlaceholder: 'Ex : La Chiva, Sol de otoño...',
    noResults: 'Aucun résultat pour « {term} ».', suggestedRoutes: 'Voies suggérées', language: 'Langue', gradingSystem: 'Système de cotation', userMenu: 'Options langue et cotation',
    gradeSystemSpanish: 'Espagnol', gradeSystemEnglish: 'Anglais', gradeSystemGerman: 'Allemand (UIAA)', gradeSystemChinese: 'Chinois', gradeSystemRussian: 'Russe', gradeSystemFrench: 'Français', gradeSystemPortuguese: 'Portugais',
    routeGradeAria: 'Cotation {grade} ({system})', distributionByGrade: 'Répartition des voies par cotation', withGrade: '{count} avec cotation', routesInGrade: '{count} voies en {grade}',
    mapTitle: 'Comment y aller', mapDescription: 'Potrero Alto est situé à Q8370 San Martín de los Andes, Neuquén. Utilisez la carte pour voir le point exact.'
  },
  pt: {
    howToGet: 'Como chegar', faqGuide: 'Guia FAQ', searchRoute: 'Buscar via', searchPlaceholder: 'Ex: La Chiva, Sol de otoño...',
    noResults: 'Nenhum resultado para “{term}”.', suggestedRoutes: 'Vias sugeridas', language: 'Idioma', gradingSystem: 'Sistema de graduação', userMenu: 'Opções de idioma e graduação',
    gradeSystemSpanish: 'Espanhol', gradeSystemEnglish: 'Inglês', gradeSystemGerman: 'Alemão (UIAA)', gradeSystemChinese: 'Chinês', gradeSystemRussian: 'Russo', gradeSystemFrench: 'Francês', gradeSystemPortuguese: 'Português',
    routeGradeAria: 'Grau {grade} ({system})', distributionByGrade: 'Distribuição de vias por grau', withGrade: '{count} com grau', routesInGrade: '{count} vias no grau {grade}',
    mapTitle: 'Como chegar', mapDescription: 'Potrero Alto fica em Q8370 San Martín de los Andes, Neuquén. Use o mapa abaixo para ver o ponto exato.'
  }
};

const GRADE_CONVERSION = {
  '5a': { en: '5.8', de: 'V', zh: '5.8', ru: '5a', fr: '5a', pt: 'IVsup' },
  '5b': { en: '5.9', de: 'V+', zh: '5.9', ru: '5b', fr: '5b', pt: 'V' },
  '5c': { en: '5.9+', de: 'VI-', zh: '5.9+', ru: '5c', fr: '5c', pt: 'Vsup' },
  '6a': { en: '5.10a', de: 'VI+', zh: '5.10a', ru: '6a', fr: '6a', pt: '6º' },
  '6a+': { en: '5.10b', de: 'VII-', zh: '5.10b', ru: '6a+', fr: '6a+', pt: '6º sup' },
  '6b': { en: '5.10c', de: 'VII', zh: '5.10c', ru: '6b', fr: '6b', pt: '7ºa' },
  '6b+': { en: '5.10d', de: 'VII+', zh: '5.10d', ru: '6b+', fr: '6b+', pt: '7ºb' },
  '6c': { en: '5.11a', de: 'VIII-', zh: '5.11a', ru: '6c', fr: '6c', pt: '7ºc' },
  '6c+': { en: '5.11c', de: 'VIII+', zh: '5.11c', ru: '6c+', fr: '6c+', pt: '8ºa' },
  '7a': { en: '5.11d', de: 'IX-', zh: '5.11d', ru: '7a', fr: '7a', pt: '8ºb' },
  '7a+': { en: '5.12a', de: 'IX', zh: '5.12a', ru: '7a+', fr: '7a+', pt: '8ºc' },
  '7b': { en: '5.12b', de: 'IX+', zh: '5.12b', ru: '7b', fr: '7b', pt: '9ºa' },
  '7b+': { en: '5.12c', de: 'X-', zh: '5.12c', ru: '7b+', fr: '7b+', pt: '9ºb' },
  '7c': { en: '5.12d', de: 'X', zh: '5.12d', ru: '7c', fr: '7c', pt: '9ºc' },
  '7c+': { en: '5.13a', de: 'X+', zh: '5.13a', ru: '7c+', fr: '7c+', pt: '10ºa' },
  '8a': { en: '5.13b', de: 'XI-', zh: '5.13b', ru: '8a', fr: '8a', pt: '10ºb' },
  '8a+': { en: '5.13c', de: 'XI', zh: '5.13c', ru: '8a+', fr: '8a+', pt: '10ºc' },
  '8b': { en: '5.13d', de: 'XI+', zh: '5.13d', ru: '8b', fr: '8b', pt: '11ºa' },
  '8b+': { en: '5.14a', de: 'XII-', zh: '5.14a', ru: '8b+', fr: '8b+', pt: '11ºb' },
  '8c': { en: '5.14b', de: 'XII', zh: '5.14b', ru: '8c', fr: '8c', pt: '11ºc' },
  '8c+': { en: '5.14c', de: 'XII+', zh: '5.14c', ru: '8c+', fr: '8c+', pt: '12ºa' },
  '9a': { en: '5.14d', de: 'XIII-', zh: '5.14d', ru: '9a', fr: '9a', pt: '12ºb' },
  '9a+': { en: '5.15a', de: 'XIII', zh: '5.15a', ru: '9a+', fr: '9a+', pt: '12ºc' },
  '9b': { en: '5.15b', de: 'XIII+', zh: '5.15b', ru: '9b', fr: '9b', pt: '13ºa' },
  '9b+': { en: '5.15c', de: 'XIV-', zh: '5.15c', ru: '9b+', fr: '9b+', pt: '13ºb' },
  '9c': { en: '5.15d', de: 'XIV', zh: '5.15d', ru: '9c', fr: '9c', pt: '13ºc' }
};

export function makeTranslator(language) {
  const locale = translations[language] ?? translations.es;
  return function t(key, vars = {}) {
    const template = locale[key] ?? translations.es[key] ?? key;
    return Object.entries(vars).reduce((acc, [varName, value]) => acc.replaceAll(`{${varName}}`, String(value)), template);
  };
}

export function convertGrade(rawGrade, gradeSystem) {
  if (!rawGrade) {
    return rawGrade;
  }

  if (gradeSystem === 'fr' || gradeSystem === 'es') {
    return rawGrade;
  }

  const normalized = String(rawGrade).trim().toLowerCase().replace(/\s+/g, '');
  const canonical = normalized.split('/')[0];
  const converted = GRADE_CONVERSION[canonical]?.[gradeSystem];

  return converted ?? rawGrade;
}
