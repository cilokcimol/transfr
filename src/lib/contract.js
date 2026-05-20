import { ethers } from 'ethers';
import EscrowArtifact from '../../contracts/Escrow.json';
import { CONTRACT_ADDRESS, RPC_URL } from './constants';

/**
 * Get a read-only contract instance.
 */
export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, EscrowArtifact.abi, provider);
}

/**
 * Get a contract instance connected to a signer (for writes).
 */
export function getWriteContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, EscrowArtifact.abi, signer);
}

/**
 * Generate a unique claim ID (bytes32).
 */
export function generateClaimId() {
  return ethers.hexlify(ethers.randomBytes(32));
}
