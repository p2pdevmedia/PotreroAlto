'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const WalletContext = createContext({
  address: null,
  isConnected: false,
  authError: '',
  connectWallet: async () => false,
  disconnectWallet: () => {}
});

async function syncPrivyUser(user) {
  const response = await fetch('/api/auth/privy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'No se pudo sincronizar usuario con Privy.');
  }
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

function buildWalletPrivyPayload(address) {
  const normalizedAddress = address.toLowerCase();

  return {
    id: `did:privy:wallet:${normalizedAddress}`,
    isGuest: false,
    linkedAccounts: [
      {
        type: 'wallet',
        address: normalizedAddress,
        chainType: 'ethereum',
        walletClient: 'injected'
      }
    ]
  };
}

export default function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const loginWithWallet = async () => {
    try {
      setAuthError('');
      const nextAddress = await connectWithInjectedProvider();
      await syncPrivyUser(buildWalletPrivyPayload(nextAddress));
      setAddress(nextAddress);
      setIsLoginModalOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  };

  const loginWithSocial = (provider) => {
    setAuthError(`Privy ${provider} requiere configurar el SDK cliente para OAuth.`);
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
            <p className="mb-3 text-xs text-slate-400">Elegí cómo querés iniciar sesión con Privy:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={loginWithWallet}
                className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 transition hover:border-sunset"
              >
                Continuar con Wallet
              </button>
              <button
                type="button"
                onClick={() => loginWithSocial('Google')}
                className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 transition hover:border-sunset"
              >
                Continuar con Google
              </button>
              <button
                type="button"
                onClick={() => loginWithSocial('X')}
                className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 transition hover:border-sunset"
              >
                Continuar con X
              </button>
            </div>
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
