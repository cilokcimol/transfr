'use client';

import { ethers } from 'ethers';
import { RPC_URL } from './constants';

const WALLET_KEY = 'transfr_wallet_pk';

/**
 * Get an ethers provider for the configured network.
 */
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(RPC_URL);
}

/**
 * Create a new random wallet and persist the private key in localStorage.
 * Returns the wallet connected to a provider.
 */
export function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  if (typeof window !== 'undefined') {
    localStorage.setItem(WALLET_KEY, wallet.privateKey);
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return wallet.connect(provider);
}

/**
 * Load a previously created wallet from localStorage.
 * Returns null if none found.
 */
export function loadWallet() {
  if (typeof window === 'undefined') return null;
  const pk = localStorage.getItem(WALLET_KEY);
  if (!pk) return null;
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Wallet(pk, provider);
}

/**
 * Check if a locally stored wallet exists.
 */
export function hasLocalWallet() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(WALLET_KEY);
}

/**
 * Connect MetaMask / injected wallet.
 * Returns { signer, address }.
 */
export async function connectMetaMask() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { signer, address, provider };
}

/**
 * Get balance of an address in ETH.
 */
export async function getBalance(address) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}
