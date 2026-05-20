// Network configuration
export const CHAIN_ID = 11155111; // Sepolia
export const CHAIN_NAME = 'Sepolia';
export const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://rpc.sepolia.org';
export const EXPLORER_URL = 'https://sepolia.etherscan.io';

// Contract (update after deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// App
export const APP_NAME = 'transfr';
export const APP_DESCRIPTION = 'Send testnet tokens to anyone via email';
