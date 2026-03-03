'use client';

import Image from 'next/image';

const navItems = [
  { id: 'inicio', label: 'Potrero Alto' },
  { id: 'como-llegar', label: 'Cómo llegar' },
  { id: 'desarrollo-del-sector', label: 'Desarrollo del sector' }
];

export default function Navbar({ activeSection, onSectionChange }) {
  return (
    <nav className="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-700/70 bg-slate-900/95 p-3 shadow-xl shadow-slate-950/50 backdrop-blur">
      <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between">
        <button
          type="button"
          onClick={() => onSectionChange('inicio')}
          className="p-0 transition-opacity hover:opacity-90"
          aria-label="Ir al inicio"
        >
          <Image
            src="/ChatGPT%20Image%20Mar%203,%202026%20at%2002_13_58%20PM.png"
            alt="Logo Potrero Alto"
            width={48}
            height={48}
            className="h-10 w-10 rounded-lg object-cover md:h-12 md:w-12"
            priority
          />
        </button>

        <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-200 md:gap-4 md:text-base">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={`rounded-full px-4 py-2 transition ${
                  activeSection === item.id
                    ? 'bg-slate-200 text-slate-900'
                    : 'hover:bg-slate-800 hover:text-sunset'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
