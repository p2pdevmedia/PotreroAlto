'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const WalletContext = createContext({
  address: null,
  isConnected: false,
  authError: '',
  connectWallet: async () => false,
  disconnectWallet: () => {}
});

async function authRequest(payload) {
  const response = await fetch('/api/auth/native', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'No se pudo completar la autenticación.');
  }

  return data;
}

async function connectWithInjectedProvider() {
  if (typeof window === 'undefined' || !window.ethereum?.request) {
    throw new Error('No hay una wallet instalada en este navegador.');
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const primary = Array.isArray(accounts) ? accounts[0] : null;

  if (!primary) {
    throw new Error('No se recibió una cuenta desde la wallet.');
  }

  return primary;
}

function AuthOptionButton({ icon, label, onClick, disabled = false, rightSlot = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-3 text-left text-sm text-slate-100 transition hover:border-sunset hover:bg-slate-900 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900/40 disabled:text-slate-500"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-500/60 bg-slate-800 text-slate-100">{icon}</span>
      <span className="flex-1">{label}</span>
      {rightSlot}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.6 3.2 14.5 2.3 12 2.3 6.8 2.3 2.6 6.5 2.6 11.7S6.8 21.1 12 21.1c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.8-.1-1.2H12z" />
      <path fill="#34A853" d="M3.8 7.7l3.2 2.3c.9-1.8 2.8-3 5-3 1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.6 3.2 14.5 2.3 12 2.3c-3.6 0-6.7 2-8.2 5.4z" opacity=".9" />
      <path fill="#4285F4" d="M12 21.1c2.5 0 4.6-.8 6.2-2.3l-3-2.4c-.8.6-1.9 1-3.2 1-2.5 0-4.6-1.7-5.3-4.1l-3.1 2.4c1.5 3.4 4.6 5.4 8.2 5.4z" opacity=".9" />
      <path fill="#FBBC05" d="M6.7 13.3c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6L3.6 7.7C3 8.9 2.6 10.2 2.6 11.7c0 1.5.4 2.8 1 4l3.1-2.4z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M19.6 5.7a16.8 16.8 0 0 0-4.2-1.3l-.2.4-.6 1.3a15.2 15.2 0 0 0-4.6 0l-.6-1.3-.2-.4a16.8 16.8 0 0 0-4.2 1.3C2.4 9 1.6 12.1 1.9 15.1a17 17 0 0 0 5.1 2.6l1.1-1.8a11 11 0 0 1-1.8-.9l.5-.4c3.5 1.6 7.4 1.6 10.8 0l.5.4c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.1-2.6c.4-3.5-.7-6.6-2.9-9.4ZM9.1 13.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2c1.1 0 1.9.9 1.8 2 0 1.1-.8 2-1.8 2Zm5.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2c1.1 0 1.9.9 1.8 2 0 1.1-.8 2-1.8 2Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M16.4 12.7c0-2.2 1.8-3.2 1.9-3.2-1.1-1.7-2.8-2-3.4-2-1.5-.2-2.9.9-3.6.9s-1.8-.9-3-.8c-1.6 0-3 .9-3.9 2.3-1.7 3.1-.4 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.6 0 0-2.5-1-2.5-4.8Zm-2.4-7c.7-.9 1.2-2.1 1-3.4-1 .1-2.2.7-2.9 1.6-.6.7-1.2 2-1 3.2 1.1.1 2.2-.5 2.9-1.4Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a3 3 0 0 1 3 3v1h-6.5A2.5 2.5 0 0 0 12 12.5v1A2.5 2.5 0 0 0 14.5 16H21v1a3 3 0 0 1-3 3H5.5A2.5 2.5 0 0 1 3 17.5v-9Z" />
      <path d="M21 11.8v2.4h-6.5a1.2 1.2 0 0 1 0-2.4H21Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export default function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authMode, setAuthMode] = useState('login');

  const loginWithWallet = async () => {
    try {
      setAuthError('');
      const nextAddress = await connectWithInjectedProvider();
      await authRequest({ action: 'wallet', walletAddress: nextAddress });
      setAddress(nextAddress);
      setIsLoginModalOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  };

  const submitEmailAuth = async () => {
    try {
      setAuthError('');
      const payload = { action: authMode, email, password, displayName };
      const data = await authRequest(payload);
      if (authMode === 'recover') {
        setAuthError(data?.message || 'Si el email existe, enviamos instrucciones.');
        return;
      }

      setAddress(data?.user?.walletAddress || `mail:${email.toLowerCase()}`);
      setIsLoginModalOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  };

  const value = useMemo(
    () => ({
      address,
      isConnected: Boolean(address),
      authError,
      connectWallet: async () => {
        setAuthError('');
        setIsLoginModalOpen(true);
        return true;
      },
      disconnectWallet: () => {
        setAuthError('');
        setAddress(null);
      }
    }),
    [address, authError]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
      {isLoginModalOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Login / Sign up</h2>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300"
              >
                Cerrar
              </button>
            </div>
            <p className="mb-3 text-xs text-slate-400">Elegí cómo querés iniciar sesión:</p>
            <div className="space-y-2">
              <AuthOptionButton
                icon={<MailIcon />}
                label="Email y password"
                onClick={() => setAuthMode('login')}
                rightSlot={<span className="text-xs font-medium text-sunset">Activo</span>}
              />
              <AuthOptionButton icon={<GoogleIcon />} label="Google" disabled />
              <AuthOptionButton icon={<DiscordIcon />} label="Discord" disabled />
              <AuthOptionButton icon={<AppleIcon />} label="Apple" disabled />
              <AuthOptionButton icon={<WalletIcon />} label="Continue with a wallet" onClick={loginWithWallet} />
            </div>

            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/60 p-3">
              <div className="mb-2 flex gap-2 text-xs">
                {['login', 'signup', 'recover'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className={`rounded px-2 py-1 uppercase ${authMode === mode ? 'bg-slate-700 text-slate-100' : 'text-slate-400'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {authMode === 'signup' ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Nombre (opcional)"
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-100"
                  />
                ) : null}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-100"
                />
                {authMode !== 'recover' ? (
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-100"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={submitEmailAuth}
                  disabled={!email || (authMode !== 'recover' && !password)}
                  className="w-full rounded border border-slate-600 px-3 py-2 text-xs text-slate-100 disabled:opacity-40"
                >
                  {authMode === 'login' ? 'Iniciar sesión' : authMode === 'signup' ? 'Crear cuenta' : 'Recuperar password'}
                </button>
              </div>
            </div>

            <button type="button" disabled className="mx-auto mt-4 block text-xs font-medium text-slate-500">
              I have a passkey
            </button>
            {authError ? <p className="mt-3 text-xs text-red-300">{authError}</p> : null}
          </div>
        </div>
      ) : null}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
