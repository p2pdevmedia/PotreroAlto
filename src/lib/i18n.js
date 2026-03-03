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

const COPY = {
  es: {
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
    gradeSystem: 'Sistema de graduación'
  },
  en: {
    howToGetThere: 'How to get there', faqGuide: 'FAQ guide', openMenu: 'Open menu', closeMenu: 'Close menu',
    searchRoute: 'Search route', routeNamePlaceholder: 'Route name...', noPhoto: 'No photo', gradeLabel: 'Grade',
    noGrade: 'No grade', noDescription: 'No description has been uploaded for this route yet.',
    noSimilarRoutes: 'No routes with a similar name were found.', language: 'Language', gradeSystem: 'Grade system'
  },
  de: {
    howToGetThere: 'Anfahrt', faqGuide: 'FAQ', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen',
    searchRoute: 'Route suchen', routeNamePlaceholder: 'Routenname...', noPhoto: 'Kein Foto', gradeLabel: 'Grad',
    noGrade: 'Kein Grad', noDescription: 'Für diese Route gibt es noch keine Beschreibung.',
    noSimilarRoutes: 'Keine ähnlichen Routen gefunden.', language: 'Sprache', gradeSystem: 'Bewertungssystem'
  },
  zh: {
    howToGetThere: '如何到达', faqGuide: '常见问题', openMenu: '打开菜单', closeMenu: '关闭菜单',
    searchRoute: '搜索线路', routeNamePlaceholder: '线路名称...', noPhoto: '无照片', gradeLabel: '等级',
    noGrade: '无等级', noDescription: '该线路暂时没有描述。',
    noSimilarRoutes: '没有找到相似名称的线路。', language: '语言', gradeSystem: '分级系统'
  },
  ru: {
    howToGetThere: 'Как добраться', faqGuide: 'FAQ', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню',
    searchRoute: 'Поиск маршрута', routeNamePlaceholder: 'Название маршрута...', noPhoto: 'Нет фото', gradeLabel: 'Категория',
    noGrade: 'Нет категории', noDescription: 'Для этого маршрута пока нет описания.',
    noSimilarRoutes: 'Похожие маршруты не найдены.', language: 'Язык', gradeSystem: 'Система категорий'
  },
  fr: {
    howToGetThere: 'Comment y aller', faqGuide: 'Guide FAQ', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu',
    searchRoute: 'Rechercher une voie', routeNamePlaceholder: 'Nom de la voie...', noPhoto: 'Sans photo', gradeLabel: 'Cotation',
    noGrade: 'Sans cotation', noDescription: 'Aucune description n’est encore disponible pour cette voie.',
    noSimilarRoutes: 'Aucune voie similaire trouvée.', language: 'Langue', gradeSystem: 'Système de cotation'
  },
  pt: {
    howToGetThere: 'Como chegar', faqGuide: 'FAQ guia', openMenu: 'Abrir menu', closeMenu: 'Fechar menu',
    searchRoute: 'Buscar via', routeNamePlaceholder: 'Nome da via...', noPhoto: 'Sem foto', gradeLabel: 'Grau',
    noGrade: 'Sem grau', noDescription: 'Ainda não há descrição cadastrada para esta via.',
    noSimilarRoutes: 'Não encontramos vias com nome semelhante.', language: 'Idioma', gradeSystem: 'Sistema de graduação'
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
