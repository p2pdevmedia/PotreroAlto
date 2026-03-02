import './globals.css';

export const metadata = {
  title: 'Potrero Alto | Guía de Escalada',
  description: 'Información del sector Potrero Alto, subsectores y vías desde theCrag.',
  icons: {
    icon: '/potrero-alto-favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
