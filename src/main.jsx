import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { coinbaseWallet, metamaskWallet, phantomWallet, ThirdwebProvider, walletConnect } from '@thirdweb-dev/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain={'sepolia'}
      theme={"light"}
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