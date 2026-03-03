export const POTRERO_ALTO_FALLBACK_DATA = {
  id: '6574670919',
  name: 'Potrero Alto',
  location: 'San Luis, Argentina',
  description:
    'Datos de respaldo locales para subsectores y vías. Se usan cuando la API de theCrag no está disponible.',
  subsectors: [
    {
      id: 'fallback-pared-este',
      name: 'Cheto / Pared Este',
      description: 'Sector de deportiva con 8 vías equipadas.',
      routes: [
        { id: 'pared-este-1', name: 'Viento Este', grade: '6a+', stars: 2, type: 'Sport' },
        { id: 'pared-este-2', name: 'Oveja Negra', grade: '7a', stars: 1, type: 'Sport' },
        { id: 'pared-este-3', name: 'Forza Giacomo', grade: '6a+', stars: 2, type: 'Sport' },
        { id: 'pared-este-4', name: 'Lucheti quien te conoce', grade: '6a+', stars: 2, type: 'Sport' },
        { id: 'pared-este-5', name: 'Eh Japanesse!', grade: '6b', stars: 2, type: 'Sport' },
        { id: 'pared-este-6', name: 'Presto Pronta', grade: '6b', stars: 2, type: 'Sport' },
        { id: 'pared-este-7', name: 'Proyectando Valencia', grade: '5+', stars: 2, type: 'Sport' },
        { id: 'pared-este-8', name: 'Palitos Salados 650', grade: '6a', stars: 2, type: 'Sport' }
      ]
    },
    {
      id: 'fallback-canadon',
      name: 'Cañadón',
      description: 'Área deportiva corta con dos líneas.',
      routes: [
        { id: 'canadon-1', name: '3 hermanos', grade: '6b', stars: null, type: 'Sport' },
        { id: 'canadon-2', name: 'Monopoly', grade: '6b', stars: null, type: 'Sport' }
      ]
    },
    {
      id: 'fallback-tablero',
      name: 'El Tablero',
      description: 'Sector principal con vías de deportiva variadas.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chess_board_with_chess_set_in_opening_position_2012_PD_03.jpg/250px-Chess_board_with_chess_set_in_opening_position_2012_PD_03.jpg',
      routes: [
        { id: 'tablero-1', name: 'Duro al Pedal!', grade: '5b', stars: 2, type: 'Sport' },
        { id: 'tablero-2', name: 'La Chaquetuda', grade: '5c+', stars: 2, type: 'Sport' },
        { id: 'tablero-3', name: 'Vino & Keterolac', grade: '6c/c+', stars: null, type: 'Sport' },
        { id: 'tablero-4', name: 'Biciequipadores', grade: '7b', stars: null, type: 'Sport' },
        { id: 'tablero-5', name: 'KuKuruch', grade: '6b', stars: 3, type: 'Sport' },
        { id: 'tablero-6', name: 'Banquito para dos', grade: '5b', stars: 2, type: 'Sport' },
        { id: 'tablero-7', name: 'el banquito', grade: '6a', stars: null, type: 'Sport' },
        { id: 'tablero-8', name: 'El sheriff', grade: '6a', stars: 4, type: 'Sport' },
        { id: 'tablero-9', name: 'Jägermeister', grade: '6a', stars: null, type: 'Sport' },
        { id: 'tablero-10', name: 'CapricorniaBosh', grade: '6b/b+', stars: 2, type: 'Sport' },
        { id: 'tablero-11', name: 'Las damas primero', grade: '6b', stars: 5, type: 'Sport' },
        { id: 'tablero-12', name: 'El Peon', grade: '6c', stars: 2, type: 'Sport' },
        { id: 'tablero-13', name: 'Enroque', grade: '7a+', stars: 1, type: 'Sport' },
        { id: 'tablero-14', name: 'Alfil', grade: '7b+/c', stars: null, type: 'Sport' },
        { id: 'tablero-15', name: 'Caballo', grade: '7b', stars: 3, type: 'Sport' },
        { id: 'tablero-16', name: 'Reina', grade: '7a', stars: 5, type: 'Sport' },
        { id: 'tablero-17', name: 'Enroque Largo', grade: '7b/b+', stars: 3, type: 'Sport' },
        { id: 'tablero-18', name: 'Jaque Permanente', grade: '7a', stars: 3, type: 'Sport' }
      ]
    },
    {
      id: 'fallback-derrumbe',
      name: 'El Derrumbe',
      description: 'Sector deportivo con desplome y vías largas.',
      routes: [
        { id: 'derrumbe-1', name: 'MatematicamenteposibleChipped', grade: '7b+/c', stars: null, type: 'Sport' },
        { id: 'derrumbe-2', name: 'Generación Z', grade: '6c/c+', stars: 5, type: 'Sport' },
        { id: 'derrumbe-3', name: 'Diamante', grade: '7a', stars: 5, type: 'Sport' },
        { id: 'derrumbe-4', name: 'Trébol', grade: '6b+/c', stars: null, type: 'Sport' },
        {
          id: 'derrumbe-5',
          name: 'Corazón',
          grade: '7a+',
          stars: 5,
          type: 'Sport',
          description: 'Línea de 5 estrellas con agujeros y bidedos sostenidos.',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/ee/ff/eeff0a21f93bc5522a6e2d1d84046068790662d6'
        },
        { id: 'derrumbe-6', name: 'Grandes Amigos', grade: '7c', stars: 5, type: 'Sport' }
      ]
    },
    {
      id: 'fallback-chancheria',
      name: 'La Chanchería',
      description: 'Sector con rutas duras y proyectos.',
      routes: [
        { id: 'chancheria-1', name: 'Motivación Peruana', grade: 'Proyecto', stars: 5, type: 'Sport' },
        { id: 'chancheria-2', name: 'Amigas y Rivales', grade: '7c', stars: null, type: 'Sport' },
        { id: 'chancheria-3', name: 'Trago amargo', grade: '7b+', stars: null, type: 'Sport' },
        { id: 'chancheria-4', name: 'Ricky in the flow', grade: '7b', stars: 1, type: 'Sport' },
        { id: 'chancheria-5', name: 'Carancho come zorzal', grade: '7b+', stars: null, type: 'Sport' },
        { id: 'chancheria-6', name: 'El despilfarro', grade: '7b+', stars: null, type: 'Sport' },
        { id: 'chancheria-7', name: 'Alien contento', grade: '7b/b+', stars: null, type: 'Sport' },
        { id: 'chancheria-8', name: 'Mamba Negra', grade: '7b+', stars: 4, type: 'Sport' },
        {
          id: 'chancheria-9',
          name: 'Libre de pecado',
          grade: '6c',
          stars: 5,
          type: 'Sport',
          description:
            'Dulfer técnico que arranca sostenido y termina con un semi desplome exigente en la salida.',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/96/86/9686440c1a6bbdfb0ec31699fd39aeaa4fc89b54'
        }
      ]
    },
    {
      id: 'fallback-arco',
      name: 'El Arco',
      description: 'Área de deportiva junto a La Chanchería.',
      image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1',
      routes: [
        { id: 'arco-1', name: 'Variante FisuraPreHistorica', grade: '6b', stars: null, type: 'Sport' },
        { id: 'arco-2', name: 'PreHistorica', grade: '6a', stars: null, type: 'Sport' },
        { id: 'arco-3', name: 'ESTACIONAMIENTO MEDIDO', grade: '6c+/7a', stars: 3, type: 'Sport' },
        { id: 'arco-4', name: 'Variante - Prohibido estacionar', grade: '6b', stars: 2, type: 'Sport' },
        { id: 'arco-5', name: 'Musgotopia', grade: '6b', stars: null, type: 'Sport' },
        { id: 'arco-6', name: 'Sombra chinesca', grade: '6b', stars: 2, type: 'Sport' },
        { id: 'arco-7', name: 'eЯЯeЯЯaЯa', grade: '6a', stars: 3, type: 'Sport' },
        { id: 'arco-8', name: 'EmPotreBro', grade: '6b', stars: 4, type: 'Sport' }
      ]
    },
    {
      id: 'fallback-croto',
      name: 'Croto',
      description: 'Subsector en desarrollo con líneas nuevas.',
      routes: [
        { id: 'croto-1', name: 'sin terminar', grade: 'Sin grado', stars: null, type: 'Sport' },
        {
          id: 'croto-2',
          name: 'Aliento de chancho',
          grade: '8?',
          stars: null,
          type: 'Sport',
          lengthMeters: 22,
          quickdraws: 12
        },
        {
          id: 'croto-3',
          name: 'Patada de chancho',
          grade: '6c',
          stars: 5,
          type: 'Sport',
          lengthMeters: 14,
          quickdraws: 11,
          firstAscentBy: 'Eche & e',
          firstAscentDate: '8 Feb',
          equippedBy: 'иван',
          equippedDate: '8 Feb'
        },
        {
          id: 'croto-4',
          name: 'Mariscal the campo',
          grade: 'Sin grado',
          stars: null,
          type: 'Sport',
          lengthMeters: 25,
          quickdraws: 13
        },
        {
          id: 'croto-5',
          name: 'Se vienen cositas',
          grade: '6b',
          stars: 5,
          type: 'Sport',
          lengthMeters: 18,
          quickdraws: 11,
          equippedBy: 'Cata Pinel',
          equippedDate: '8 Feb'
        },
        {
          id: 'croto-6',
          name: 'Municipales',
          grade: '6a+',
          stars: 3,
          type: 'Sport',
          lengthMeters: 13,
          quickdraws: 9,
          firstAscentBy: 'juan Ramon',
          firstAscentDate: '9 Feb',
          equippedBy: 'juan Ramon',
          equippedDate: '9 Feb'
        }
      ]
    }
  ]
};
