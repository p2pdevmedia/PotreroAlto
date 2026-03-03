const GRADE_MAP = {
  '5.9': { french: 'V+', yds: '5.9', uiaa: 'VI-', ewbank: '17' },
  '6a': { french: '6a', yds: '5.10a', uiaa: 'VI+', ewbank: '18' },
  '6a+': { french: '6a+', yds: '5.10b', uiaa: 'VII-', ewbank: '19' },
  '6b': { french: '6b', yds: '5.10c', uiaa: 'VII', ewbank: '20' },
  '6b+': { french: '6b+', yds: '5.10d', uiaa: 'VII+', ewbank: '21' },
  '6c': { french: '6c', yds: '5.11a', uiaa: 'VIII-', ewbank: '22' },
  '6c/+': { french: '6c/+', yds: '5.11b', uiaa: 'VIII', ewbank: '23' },
  '6c+': { french: '6c+', yds: '5.11c', uiaa: 'VIII+', ewbank: '24' },
  '7a': { french: '7a', yds: '5.11d', uiaa: 'IX-', ewbank: '25' },
  '7a+': { french: '7a+', yds: '5.12a', uiaa: 'IX', ewbank: '26' },
  '7b': { french: '7b', yds: '5.12b', uiaa: 'IX+', ewbank: '27' },
  '7b+': { french: '7b+', yds: '5.12c', uiaa: 'X-', ewbank: '28' },
  '7c': { french: '7c', yds: '5.12d', uiaa: 'X', ewbank: '29' },
  '7c+': { french: '7c+', yds: '5.13a', uiaa: 'X+', ewbank: '30' },
  '8a': { french: '8a', yds: '5.13b', uiaa: 'XI-', ewbank: '31' },
  '8a+': { french: '8a+', yds: '5.13c', uiaa: 'XI', ewbank: '32' },
  '8b': { french: '8b', yds: '5.13d', uiaa: 'XI+', ewbank: '33' },
  '8b+': { french: '8b+', yds: '5.14a', uiaa: 'XII-', ewbank: '34' },
  '8c': { french: '8c', yds: '5.14b', uiaa: 'XII', ewbank: '35' },
  '8c+': { french: '8c+', yds: '5.14c', uiaa: 'XII+', ewbank: '36' },
  '9a': { french: '9a', yds: '5.14d', uiaa: 'XIII-', ewbank: '37' },
  '9a+': { french: '9a+', yds: '5.15a', uiaa: 'XIII', ewbank: '38' },
  '9b': { french: '9b', yds: '5.15b', uiaa: 'XIII+', ewbank: '39' },
  '9b+': { french: '9b+', yds: '5.15c', uiaa: 'XIV-', ewbank: '40' },
  '9c': { french: '9c', yds: '5.15d', uiaa: 'XIV', ewbank: '41' }
};

export function convertGrade(grade, system = 'french') {
  if (!grade) {
    return grade;
  }

  const normalized = String(grade).trim();
  const exact = GRADE_MAP[normalized];
  if (exact?.[system]) {
    return exact[system];
  }

  const prefix = normalized.split('/')[0];
  if (GRADE_MAP[prefix]?.[system]) {
    return GRADE_MAP[prefix][system];
  }

  return normalized;
}
