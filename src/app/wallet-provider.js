'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WalletContext = createContext({
  address: null,
  isConnected: false,
  connectWallet: async () => false,
  disconnectWallet: () => {}
});

async function connectWithInjectedProvider() {
  if (typeof window === 'undefined' || !window.ethereum?.request) {
    throw new Error('No injected wallet provider found');
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const primary = Array.isArray(accounts) ? accounts[0] : null;

  if (!primary) {
    throw new Error('No account returned by wallet provider');
  }

  return primary;
}

export default function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum?.request) {
      return undefined;
    }

    let isMounted = true;

    const loadInitialAccount = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const primary = Array.isArray(accounts) ? accounts[0] : null;

        if (isMounted) {
          setAddress(primary ?? null);
        }
      } catch {
        if (isMounted) {
          setAddress(null);
        }
      }
    };

    const handleAccountsChanged = (accounts) => {
      const primary = Array.isArray(accounts) ? accounts[0] : null;
      setAddress(primary ?? null);
    };

    loadInitialAccount();
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);

    return () => {
      isMounted = false;
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const value = useMemo(
    () => ({
      address,
      isConnected: Boolean(address),
      connectWallet: async () => {
        const nextAddress = await connectWithInjectedProvider();
        setAddress(nextAddress);
        return true;
      },
      disconnectWallet: () => {
        setAddress(null);
      }
    }),
    [address]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  return useContext(WalletContext);
}
