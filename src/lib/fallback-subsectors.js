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
        {
          id: 'pared-este-1',
          name: 'Viento Este',
          grade: '6a+',
          stars: 2,
          type: 'Sport',
          description: 'comparte descuelgue con "oveja negra"',
          lengthMeters: 19,
          quickdraws: 9,
          image: 'https://image.thecrag.com/900x1600/99/1f/991f771cecdd3c54bd69eb340666dafdd7336140',
          equippedBy: 'Pelu Ka',
          equippedDate: '9 May 2025'
        },
        {
          id: 'pared-este-2',
          name: 'Oveja Negra',
          grade: '7a',
          stars: 1,
          type: 'Sport',
          description: 'comparte descuelgue con "viento este"',
          lengthMeters: 20,
          quickdraws: 11,
          image: 'https://image.thecrag.com/900x1600/1d/ea/1dea28823fdd91f74aff205dd45094a03b855f7b',
          equippedBy: 'Pelu Ka',
          equippedDate: '14 May 2025'
        },
        {
          id: 'pared-este-3',
          name: 'Forza Giacomo',
          grade: '6a+',
          stars: 2,
          type: 'Sport',
          description: 'comparte descuelgue con "Luchetti quien te conoce"',
          lengthMeters: 20,
          quickdraws: 10,
          image: 'https://image.thecrag.com/900x1600/1d/ea/1dea28823fdd91f74aff205dd45094a03b855f7b',
          equippedBy: 'Fede Aragno',
          equippedDate: '9 May 2025'
        },
        {
          id: 'pared-este-4',
          name: 'Luchetti quien te conoce',
          grade: '6a+',
          stars: 2,
          type: 'Sport',
          description: 'comparte descuelgue con "Forza Giacomo"',
          lengthMeters: 20,
          quickdraws: 10,
          image: 'https://image.thecrag.com/900x1600/1d/ea/1dea28823fdd91f74aff205dd45094a03b855f7b',
          equippedBy: 'Fede Aragno',
          equippedDate: '14 May 2025'
        },
        {
          id: 'pared-este-5',
          name: 'Eh Japanese!',
          grade: '6b',
          stars: 2,
          type: 'Sport',
          description: 'comparte primeras 3 chapas con "Presto Pronta" y luego hacia la izquierda',
          lengthMeters: 22,
          quickdraws: 12,
          image: 'https://image.thecrag.com/526x1600/98/13/98137902bc6f397f159ce7f76d21f253ddf206bb',
          equippedBy: 'Fede Aragno',
          equippedDate: '22 May 2025'
        },
        {
          id: 'pared-este-6',
          name: 'Presto Pronta',
          grade: '6b',
          stars: 2,
          type: 'Sport',
          description: 'comparte primeras 3 chapas con "Eh Japanese!" y luego hacia la derecha',
          lengthMeters: 15,
          quickdraws: 9,
          image: 'https://image.thecrag.com/981x960/e1/bf/e1bf1371e852f43653297d897899d254c973f779',
          equippedBy: 'Fede Aragno',
          equippedDate: '20 May 2025'
        },
        {
          id: 'pared-este-7',
          name: 'Proyectando Valencia',
          grade: '5+',
          stars: 2,
          type: 'Sport',
          description: 'comparte descuelgue con "Presto Pronta"',
          lengthMeters: 15,
          quickdraws: 9,
          image: 'https://image.thecrag.com/900x1600/30/41/3041dc67cc6fc99e68402ccde2b7a6d65fee5a58',
          equippedBy: 'Pelu Ka',
          equippedDate: '22 May 2025'
        },
        {
          id: 'pared-este-8',
          name: 'Palitos Salados 650',
          grade: '6a',
          stars: 2,
          type: 'Sport',
          image: 'https://image.thecrag.com/745x1600/cd/d8/cdd8ed757d48f2e89fa84416df64aadd8a8481bd',
          lengthMeters: 15,
          quickdraws: 7,
          equippedBy: 'Pelu Ka',
          equippedDate: '20 May 2025'
        }
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
        {
          id: 'tablero-1',
          name: 'Duro al Pedal!',
          grade: '5b',
          stars: 2,
          type: 'Sport',
          image: 'https://image.thecrag.com/900x1600/e0/75/e075c88b4812dd53da3c0b722d2941753af4cddf'
        },
        {
          id: 'tablero-2',
          name: 'La Chaquetuda',
          grade: '5c+',
          stars: 2,
          type: 'Sport',
          image: 'https://image.thecrag.com/900x1600/e0/75/e075c88b4812dd53da3c0b722d2941753af4cddf'
        },
        {
          id: 'tablero-3',
          name: 'Vino & Keterolac',
          grade: '6c/+',
          stars: null,
          type: 'Sport',
          image: 'https://image.thecrag.com/900x1600/08/3e/083e09dcb3a3aa64df555d84c12104ecef1e01de'
        },
        {
          id: 'tablero-4',
          name: 'Biciequipadores',
          grade: '7b/+',
          stars: null,
          type: 'Sport',
          image: 'https://image.thecrag.com/900x1600/08/3e/083e09dcb3a3aa64df555d84c12104ecef1e01de'
        },
        {
          id: 'tablero-5',
          name: 'KuKuruch',
          grade: '6b',
          stars: 3,
          type: 'Sport',
          image: 'https://image.thecrag.com/960x1610/ad/26/ad26db1358a13ee970fac42f8cbf8aa05ee454a0'
        },
        { id: 'tablero-6', name: 'Banquito para dos', grade: '5b', stars: 2, type: 'Sport' },
        { id: 'tablero-7', name: 'el banquito', grade: '6a', stars: null, type: 'Sport' },
        { id: 'tablero-8', name: 'El sheriff', grade: '6a', stars: 4, type: 'Sport' },
        { id: 'tablero-9', name: 'Jägermeister', grade: '6a', stars: null, type: 'Sport' },
        { id: 'tablero-10', name: 'CapricorniaBosh', grade: '6b/b+', stars: 2, type: 'Sport' },
        { id: 'tablero-11', name: 'Las damas primero', grade: '6b', stars: 5, type: 'Sport' },
        {
          id: 'tablero-12',
          name: 'El Peon',
          grade: '6c',
          stars: 2,
          type: 'Sport',
          image: 'https://image.thecrag.com/899x1599/e3/af/e3af4b6502756b857698771db3d5154521edd309'
        },
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

        {
          id: 'derrumbe-1',
          name: 'MatematicamenteposibleChipped',
          grade: '7b+/c',
          stars: 2,
          type: 'Sport',
          description: 'SICADA.',
          lengthMeters: 25,
          quickdraws: 13
        },
        {
          id: 'derrumbe-2',
          name: 'Generación Z',
          grade: '6c/c+',
          stars: 4,
          type: 'Sport',
          lengthMeters: 22,
          quickdraws: 12,
          equippedBy: 'иван & juan Ramon',
          equippedDate: '12 Sep 2026'
        },

        {
          id: 'derrumbe-3',
          name: 'Diamante',
          grade: '7a',
          stars: 4,
          type: 'Sport',
          description: 'En bruto',
          lengthMeters: 20,
          quickdraws: 10,
          equippedBy: 'иван & JP',
          equippedDate: '15 May 2024',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/dc/b2/dcb2b678e32cdbf2601b1d71392acd513206152b'
        },
        {
          id: 'derrumbe-4',
          name: 'Trébol',
          grade: '6b+/c',
          stars: 1,
          type: 'Sport',
          description: 'Es un terremoto(?)',
          lengthMeters: 50,
          quickdraws: 24,
          equippedBy: 'иван & ATMAN',
          equippedDate: '12 Apr 2023'
        },

        {
          id: 'derrumbe-5',
          name: 'Corazón',
          grade: '7a+',
          stars: 2,
          type: 'Sport',
          description: '¡PIM! ¡PAM! ¡PUM! ¡PLAS! ¡BOOM! ¡CRASH! ¡BANG! ¡ZAS! ¡BROOM! ¡CLANK! ¡TAC! ¡FLASH! 🚀',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/ee/ff/eeff0a21f93bc5522a6e2d1d84046068790662d6',
          lengthMeters: 20,
          quickdraws: 11,
          equippedBy: 'иван',
          equippedDate: '25 Feb 2025'
        },
        {
          id: 'derrumbe-6',
          name: 'Grandes Amigos',
          grade: '7c',
          stars: 3,
          type: 'Sport',
          lengthMeters: 18,
          equippedBy: 'Tomy genova',
          equippedDate: '1 Apr 2025',
          firstAscentBy: 'Juan de la Canal',
          firstAscentDate: '10 May 2025'
        }
      ]
    },
    {
      id: 'fallback-chancheria',
      name: 'La Chanchería',
      description: 'Sector con rutas duras y proyectos.',
      routes: [
        {
          id: 'chancheria-1',
          name: 'Motivación Peruana',
          grade: 'Proyecto',
          stars: 5,
          type: 'Sport',
          description: 'Aparque su llama del lado derecho del pie de vía, se recomienda el uso de maca peruana y casco.',
          lengthMeters: 30,
          quickdraws: 22,
          equippedBy: 'иван & Eche',
          equippedDate: '5 Sep 2026'
        },
        {
          id: 'chancheria-2',
          name: 'Amigas y Rivales',
          grade: '7c',
          stars: null,
          type: 'Sport',
          lengthMeters: 17,
          quickdraws: 7,
          equippedBy: 'simon de la Canal & Juan de la Canal',
          equippedDate: '14 Jan 2023'
        },
        {
          id: 'chancheria-3',
          name: 'Trago amargo',
          grade: '7b+',
          stars: null,
          type: 'Sport',
          lengthMeters: 15,
          quickdraws: 7,
          equippedBy: 'Hernán Signorini',
          equippedDate: '15 Jan 2023',
          firstAscentBy: 'simon de la Canal',
          firstAscentDate: '27 Jan 2023'
        },
        {
          id: 'chancheria-4',
          name: 'Ricky in the flow',
          grade: '7b',
          stars: 1,
          type: 'Sport',
          lengthMeters: 15,
          quickdraws: 7,
          equippedBy: 'Juan Pedalino & Lula Tiemroth',
          equippedDate: '27 Jan 2023',
          firstAscentBy: 'simon de la Canal',
          firstAscentDate: '31 Jan 2023'
        },
        {
          id: 'chancheria-5',
          name: 'Carancho come zorzal',
          grade: '7b+',
          stars: null,
          type: 'Sport',
          lengthMeters: 15,
          quickdraws: 7,
          equippedBy: 'Lula Tiemroth & Juan Pedalino',
          equippedDate: '1 May 2021',
          firstAscentBy: 'Juan de la Canal',
          firstAscentDate: '14 Jan 2023'
        },
        {
          id: 'chancheria-6',
          name: 'El despilfarro',
          grade: '7b+',
          stars: null,
          type: 'Sport',
          lengthMeters: 16,
          quickdraws: 11,
          equippedBy: 'Juan Pedalino & Lula Tiemroth',
          equippedDate: '1 Feb 2022',
          firstAscentBy: 'simon de la Canal',
          firstAscentDate: '7 Jan 2023'
        },
        {
          id: 'chancheria-7',
          name: 'Alien contento',
          grade: '7b/b+',
          stars: null,
          type: 'Sport',
          lengthMeters: 17,
          equippedBy: 'Juan Pedalino & Lula Tiemroth',
          equippedDate: '1 May 2022',
          firstAscentBy: 'simon de la Canal',
          firstAscentDate: '10 Jan 2023'
        },
        {
          id: 'chancheria-8',
          name: 'Mamba Negra',
          grade: '7b+',
          stars: 4,
          type: 'Sport',
          lengthMeters: 18,
          quickdraws: 14,
          equippedBy: 'Juan Pedalino & Lula Tiemroth',
          firstAscentBy: 'Juan de la Canal',
          firstAscentDate: '7 Jan 2025'
        },
        {
          id: 'chancheria-9',
          name: 'Libre de pecado',
          grade: '6c',
          stars: 5,
          type: 'Sport',
          description: 'El que este libre de pecado que vaya a pecar. Todavía hay tiempo. Se recomienda uso de casco, piedra devil',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/96/86/9686440c1a6bbdfb0ec31699fd39aeaa4fc89b54',
          lengthMeters: 16,
          quickdraws: 10,
          equippedBy: 'juan Ramon & иван',
          firstAscentBy: 'nadina & Nadina Villa',
          firstAscentDate: '1 Nov 2024'
        }
      ]
    },
    {
      id: 'fallback-arco',
      name: 'El Arco',
      description: 'Área de deportiva junto a La Chanchería.',
      image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1',
      routes: [
        {
          id: 'arco-1',
          name: 'Variante FisuraPreHistorica',
          grade: '6b',
          stars: null,
          type: 'Sport',
          description: 'Variante de "PreHistorica", empieza por la fisura y termina en la reunion de "PreHistorica"',
          lengthMeters: 18,
          quickdraws: 10,
          equippedBy: 'JP',
          equippedDate: '1 Mayo 2025'
        },
        {
          id: 'arco-2',
          name: 'PreHistorica',
          grade: '6a',
          stars: null,
          type: 'Sport',
          description: 'Primer ruta del sector. Ubicada en el margen derecho de la chancheria equipada por el 2000',
          lengthMeters: 18,
          quickdraws: 10
        },
        {
          id: 'arco-3',
          name: 'ESTACIONAMIENTO MEDIDO',
          grade: '6c+/7a',
          stars: 3,
          type: 'Sport',

          description: 'Roca frágil, es recomendable el uso de casco.',
          lengthMeters: 20,
          quickdraws: 15,
          equippedBy: 'ivan & JB',
          equippedDate: '8 Oct 2024',
          firstAscentBy: 'JB',
          firstAscentDate: '17 Oct 2024',
          image: 'https://image.thecrag.com/1280x960/8d/87/8d8736b9168cd854c0339fb5d7f46e2214433c6c'
        },
        {
          id: 'arco-4',
          name: 'Variante - Prohibido estacionar',
          grade: '6b',
          stars: 2,
          type: 'Sport',
          description: 'Variante de "Estacionamiento medido", termina en la reunion de "Musgotopia"',
          lengthMeters: 16
        },

        {
          id: 'arco-5',
          name: 'Musgotopia',
          grade: '6b',
          stars: null,
          type: 'Sport',
          lengthMeters: 18,
          quickdraws: 12,
          equippedBy: 'juan Ramon',
          equippedDate: '2 Abr 2025',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1'

        },
        {
          id: 'arco-6',
          name: 'Sombra chinesca',
          grade: '6b',
          stars: 2,
          type: 'Sport',

          lengthMeters: 11,
          quickdraws: 10,
          equippedBy: 'иван',
          equippedDate: '2 Abr 2025',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1'

        },
        {
          id: 'arco-7',
          name: 'eЯЯeЯЯaЯa',
          grade: '6a',
          stars: 3,
          type: 'Sport',
          lengthMeters: 14,
          quickdraws: 7,
          firstAscentBy: 'Tomas Genova',
          firstAscentDate: '1 Abr 2025',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1'
        },
        {
          id: 'arco-8',
          name: 'EmPotreBro',
          grade: '6b',
          stars: 4,
          type: 'Sport',
          description: 'Placa frontal',
          lengthMeters: 14,
          quickdraws: 7,
          equippedBy: 'juan Ramon, иван & Tommy',
          equippedDate: '31 Mar 2025',
          firstAscentBy: 'иван',
          firstAscentDate: '31 Mar 2025',
          image: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1'

        }
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
          firstAscentDate: '8 Feb 2026',
          equippedBy: 'иван',
          equippedDate: '8 Feb 2026'
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
          equippedDate: '8 Feb 2026'
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
          firstAscentDate: '9 Feb 2026',
          equippedBy: 'juan Ramon',
          equippedDate: '9 Feb 2026'
        }
      ]
    }
  ]
};
