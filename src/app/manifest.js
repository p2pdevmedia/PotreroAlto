export default function manifest() {
  return {
    name: 'Potrero Alto',
    short_name: 'Potrero Alto',
    description:
      'Guía del sector de escalada deportiva Potrero Alto en San Martín de los Andes, Neuquén, Argentina.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    lang: 'es-AR',
    icons: [
      {
        src: '/potrero-alto-carabiner-orange-large.ico',
        sizes: '192x192',
        type: 'image/x-icon'
      },
      {
        src: '/potrero-alto-carabiner-orange-large.ico',
        sizes: '512x512',
        type: 'image/x-icon'
      }
    ]
  };
}
