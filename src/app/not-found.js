import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-6">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-xl shadow-lg">
        <Image
          src="/4044.gif"
          alt="Animación de error 404"
          width={1200}
          height={675}
          priority
          unoptimized
          className="h-auto w-full"
        />

        <div className="absolute inset-x-0 top-0 p-2 sm:p-3">
          <div className="rounded-md bg-black/65 px-3 py-2 text-center text-white backdrop-blur-sm">
            <h1 className="text-xl font-bold sm:text-2xl">404 - Página no encontrada</h1>
            <p className="text-sm sm:text-base">
              La ruta que buscás no existe. Podés volver al inicio desde acá.
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-center p-2 sm:p-3">
          <Link
            href="/"
            className="rounded bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
