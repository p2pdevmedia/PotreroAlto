const FRENCH_TO_YDS = {
  '<5a': '5.6',
  '5a': '5.7',
  '5b': '5.8',
  '5c': '5.9',
  '6a': '5.10a',
  '6a+': '5.10b',
  '6b': '5.10c',
  '6b+': '5.10d',
  '6c': '5.11a',
  '6c+': '5.11c',
  '7a': '5.11d',
  '7a+': '5.12a',
  '7b': '5.12b',
  '7b+': '5.12c',
  '7c': '5.12d',
  '7c+': '5.13a',
  '8a': '5.13b',
  '8a+': '5.13c',
  '8b': '5.13d',
  '8b+': '5.14a',
  '8c': '5.14b',
  '8c+': '5.14c',
  '9a': '5.14d',
  '>9a': '5.15+'
};

const FRENCH_TO_UIAA = {
  '<5a': 'V',
  '5a': 'VI-',
  '5b': 'VI',
  '5c': 'VI+',
  '6a': 'VII-',
  '6a+': 'VII',
  '6b': 'VII+',
  '6b+': 'VIII-',
  '6c': 'VIII',
  '6c+': 'VIII+',
  '7a': 'IX-',
  '7a+': 'IX',
  '7b': 'IX+',
  '7b+': 'X-',
  '7c': 'X',
  '7c+': 'X+',
  '8a': 'XI-',
  '8a+': 'XI',
  '8b': 'XI+',
  '8b+': 'XII-',
  '8c': 'XII',
  '8c+': 'XII+',
  '9a': 'XIII-',
  '>9a': 'XIII+'
};

export const GRADE_SYSTEMS = [
  { code: 'french', label: 'French' },
  { code: 'yds', label: 'YDS' },
  { code: 'uiaa', label: 'UIAA' }
];

export function normalizeFrenchGrade(grade) {
  if (!grade) {
    return null;
  }

  const cleanedGrade = String(grade).trim().toLowerCase();

  if (!cleanedGrade || cleanedGrade.includes('sin grado') || cleanedGrade.includes('proyecto')) {
    return null;
  }

  const primaryGrade = cleanedGrade.split('/')[0]?.trim();
  const match = primaryGrade?.match(/(\d)([abc]?)(\+)?/);

  if (!match) {
    return null;
  }

  const numericGrade = Number.parseInt(match[1], 10);
  const letter = match[2] || (match[3] ? 'c' : 'a');
  const plus = match[3] ? '+' : '';

  if (numericGrade < 5) {
    return '<5a';
  }

  if (numericGrade > 9) {
    return '>9a';
  }

  return `${numericGrade}${letter}${plus}`;
}

export function formatGradeForSystem(rawGrade, gradeSystem = 'french') {
  const normalized = normalizeFrenchGrade(rawGrade);

  if (!normalized) {
    return rawGrade;
  }

  if (gradeSystem === 'yds') {
    return FRENCH_TO_YDS[normalized] ?? rawGrade;
  }

  if (gradeSystem === 'uiaa') {
    return FRENCH_TO_UIAA[normalized] ?? rawGrade;
  }

  return normalized;
}
