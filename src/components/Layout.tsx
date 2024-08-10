import React, { ReactNode } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-lg font-semibold">Casino of Life</div>
        <WalletMultiButton />
      </nav>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
