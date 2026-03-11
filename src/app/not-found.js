import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
      <p className="text-lg text-gray-600">
        La ruta que buscás no existe. Podés volver al inicio desde acá.
      </p>
      <Image
        src="/4044.gif"
        alt="Animación de error 404"
        width={1200}
        height={675}
        priority
        unoptimized
        className="h-auto w-full max-w-3xl rounded-lg shadow-lg"
      />
      <Link
        href="/"
        className="rounded bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
