import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { coinbaseWallet, metamaskWallet, phantomWallet, ThirdwebProvider, walletConnect } from '@thirdweb-dev/react';

const customTheme = {
  colors: {
    primaryButtonBg: "#00b2f2",
    primaryButtonText: "#fff",
    connectedButtonBgHover: "#f0f0f0",
  },
  theme: "light"
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain={'sepolia'}
      theme={customTheme}
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
        phantomWallet({
          recommended: true,
        }),
      ]}
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>,
);