export default function Navbar() {
  return (
    <nav className="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-700/70 bg-slate-900/95 p-3 shadow-xl shadow-slate-950/50 backdrop-blur">
      <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-200 md:gap-4 md:text-base">
        <li>
          <a className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-sunset" href="#inicio">
            Potrero Alto
          </a>
        </li>
        <li>
          <a className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-sunset" href="#como-llegar">
            Cómo llegar
          </a>
        </li>
        <li>
          <a
            className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-sunset"
            href="#desarrollo-del-sector"
          >
            Desarrollo del sector
          </a>
        </li>
      </ul>
    </nav>
  );
}
