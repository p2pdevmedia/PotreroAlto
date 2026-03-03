'use client';

import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { id: 'inicio', label: 'Potrero Alto' },
  { id: 'como-llegar', label: 'Cómo llegar' },
  { id: 'desarrollo-del-sector', label: 'Desarrollo del sector' }
];

export default function Navbar({ activeSection, onSectionChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-700/70 bg-slate-900/95 p-3 shadow-xl shadow-slate-950/50 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleSectionChange('inicio')}
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

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:bg-slate-800 md:hidden"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navbar-menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">{isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="text-xl leading-none">☰</span>
        </button>

        <ul className="hidden items-center justify-center gap-2 text-sm font-semibold text-slate-200 md:flex md:gap-4 md:text-base">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSectionChange(item.id)}
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

      {isMobileMenuOpen && (
        <ul
          id="mobile-navbar-menu"
          className="mt-3 flex flex-col gap-2 text-sm font-semibold text-slate-200 md:hidden"
        >
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSectionChange(item.id)}
                className={`w-full rounded-full px-4 py-2 text-left transition ${
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
      )}
    </nav>
  );
}
