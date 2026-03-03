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
  { code: 'french', label: 'Français' },
  { code: 'yds', label: 'YDS' },
  { code: 'uiaa', label: 'UIAA' },
  { code: 'ewbank', label: 'Ewbank' }
];

export const COPY = {
  es: {
    home: 'Inicio',
    howToGetThere: 'Cómo llegar',
    faqGuide: 'FAQ guía',
    searchRoute: 'Buscar vía',
    routePlaceholder: 'Nombre de la vía...',
    noPhoto: 'Sin foto',
    grade: 'Grado',
    noGrade: 'Sin grado',
    noDescription: 'Todavía no hay una descripción cargada para esta vía.',
    noMatches: 'No encontramos vías con un nombre similar.',
    routesByGrade: 'Distribución de vías por grado',
    withGrade: 'con grado',
    seeSubsectorRoutes: 'Ver rutas del subsector',
    route: 'ruta',
    routes: 'rutas',
    close: 'Cerrar',
    noRoutesInSubsector: 'Sin vías registradas en este subsector.',
    madeForCommunity: 'Hecho con 💪 para la comunidad ❤️',
    buyBeer: 'Regalame una 🍺',
    language: 'Idioma',
    gradeSystem: 'Sistema de graduación'
  },
  en: {
    home: 'Home', howToGetThere: 'How to get there', faqGuide: 'FAQ guide', searchRoute: 'Search route',
    routePlaceholder: 'Route name...', noPhoto: 'No photo', grade: 'Grade', noGrade: 'No grade',
    noDescription: 'There is no description for this route yet.', noMatches: 'No similar route names were found.',
    routesByGrade: 'Route distribution by grade', withGrade: 'with grade', seeSubsectorRoutes: 'View subsector routes',
    route: 'route', routes: 'routes', close: 'Close', noRoutesInSubsector: 'No routes registered in this subsector.',
    madeForCommunity: 'Made with 💪 for the community ❤️', buyBeer: 'Buy me a 🍺', language: 'Language', gradeSystem: 'Grading system'
  },
  de: {
    home: 'Start', howToGetThere: 'Anfahrt', faqGuide: 'FAQ', searchRoute: 'Route suchen', routePlaceholder: 'Routenname...',
    noPhoto: 'Kein Foto', grade: 'Grad', noGrade: 'Kein Grad', noDescription: 'Für diese Route gibt es noch keine Beschreibung.',
    noMatches: 'Keine ähnlichen Routennamen gefunden.', routesByGrade: 'Routenverteilung nach Grad', withGrade: 'mit Grad',
    seeSubsectorRoutes: 'Routen des Sektors anzeigen', route: 'Route', routes: 'Routen', close: 'Schließen',
    noRoutesInSubsector: 'Keine Routen in diesem Sektor.', madeForCommunity: 'Mit 💪 für die Community gemacht ❤️',
    buyBeer: 'Spendier mir ein 🍺', language: 'Sprache', gradeSystem: 'Bewertungssystem'
  },
  zh: {
    home: '首页', howToGetThere: '如何到达', faqGuide: '常见问题', searchRoute: '搜索路线', routePlaceholder: '路线名称...', noPhoto: '无照片',
    grade: '难度', noGrade: '无难度', noDescription: '该路线暂无描述。', noMatches: '未找到相似路线名称。',
    routesByGrade: '按难度的路线分布', withGrade: '有难度', seeSubsectorRoutes: '查看分区路线', route: '路线', routes: '路线', close: '关闭',
    noRoutesInSubsector: '该分区暂无路线。', madeForCommunity: '为社群用💪打造❤️', buyBeer: '请我喝一杯🍺', language: '语言', gradeSystem: '难度系统'
  },
  ru: {
    home: 'Главная', howToGetThere: 'Как добраться', faqGuide: 'FAQ', searchRoute: 'Поиск маршрута', routePlaceholder: 'Название маршрута...',
    noPhoto: 'Нет фото', grade: 'Категория', noGrade: 'Без категории', noDescription: 'Для этого маршрута пока нет описания.',
    noMatches: 'Похожих названий маршрутов не найдено.', routesByGrade: 'Распределение маршрутов по категориям', withGrade: 'с категорией',
    seeSubsectorRoutes: 'Показать маршруты сектора', route: 'маршрут', routes: 'маршрутов', close: 'Закрыть',
    noRoutesInSubsector: 'В этом секторе нет маршрутов.', madeForCommunity: 'Сделано с 💪 для сообщества ❤️', buyBeer: 'Угости меня 🍺',
    language: 'Язык', gradeSystem: 'Система категорий'
  },
  fr: {
    home: 'Accueil', howToGetThere: 'Comment y aller', faqGuide: 'Guide FAQ', searchRoute: 'Rechercher une voie', routePlaceholder: 'Nom de la voie...',
    noPhoto: 'Sans photo', grade: 'Cotation', noGrade: 'Sans cotation', noDescription: "Aucune description n'est disponible pour cette voie.",
    noMatches: "Aucune voie similaire trouvée.", routesByGrade: 'Répartition des voies par cotation', withGrade: 'avec cotation',
    seeSubsectorRoutes: 'Voir les voies du sous-secteur', route: 'voie', routes: 'voies', close: 'Fermer', noRoutesInSubsector: 'Aucune voie dans ce sous-secteur.',
    madeForCommunity: 'Fait avec 💪 pour la communauté ❤️', buyBeer: 'Offre-moi une 🍺', language: 'Langue', gradeSystem: 'Système de cotation'
  },
  pt: {
    home: 'Início', howToGetThere: 'Como chegar', faqGuide: 'FAQ guia', searchRoute: 'Buscar via', routePlaceholder: 'Nome da via...',
    noPhoto: 'Sem foto', grade: 'Grau', noGrade: 'Sem grau', noDescription: 'Ainda não há descrição para esta via.',
    noMatches: 'Não encontramos vias com nome parecido.', routesByGrade: 'Distribuição de vias por grau', withGrade: 'com grau',
    seeSubsectorRoutes: 'Ver vias do subsetor', route: 'via', routes: 'vias', close: 'Fechar', noRoutesInSubsector: 'Sem vias registradas neste subsetor.',
    madeForCommunity: 'Feito com 💪 para a comunidade ❤️', buyBeer: 'Me paga uma 🍺', language: 'Idioma', gradeSystem: 'Sistema de graduação'
  }
};

export function t(lang, key) {
  return COPY[lang]?.[key] ?? COPY.es[key] ?? key;
}
