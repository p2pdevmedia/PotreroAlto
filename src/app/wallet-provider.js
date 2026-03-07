'use client';

import { createContext, useContext, useMemo } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const WalletContext = createContext({
  address: null,
  isConnected: false,
  connectWallet: async () => false,
  disconnectWallet: async () => {}
});

function pickConnectedWalletAddress(wallets) {
  if (!Array.isArray(wallets) || wallets.length === 0) {
    return null;
  }

  const readyWallet = wallets.find((wallet) => wallet.walletClientType !== 'unknown') ?? wallets[0];

  return readyWallet?.address ?? null;
}

export default function WalletProvider({ children }) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const address = pickConnectedWalletAddress(wallets);
  const isConnected = authenticated && Boolean(address);

  const value = useMemo(
    () => ({
      address,
      isConnected,
      connectWallet: async () => {
        if (!ready) {
          throw new Error('Privy auth is not ready');
        }

        await login();
        return true;
      },
      disconnectWallet: async () => {
        if (!authenticated) {
          return;
        }

        await logout();
      }
    }),
    [address, authenticated, isConnected, login, logout, ready]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  return useContext(WalletContext);
}
