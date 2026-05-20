'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import Link from 'next/link';
import { createWallet, loadWallet, hasLocalWallet, getBalance } from '../../../lib/wallet';
import { getWriteContract, getReadContract } from '../../../lib/contract';
import { EXPLORER_URL, CHAIN_ID, CHAIN_NAME } from '../../../lib/constants';

const SEPOLIA_PARAMS = {
  chainId: '0x' + CHAIN_ID.toString(16),
  chainName: CHAIN_NAME,
  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com', 'https://rpc.sepolia.org'],
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: [EXPLORER_URL],
};

const C = {
  blue:'#0047FF', blueLt:'#EEF2FF', blueHov:'#0035CC',
  bg:'#F8FAFF', surface:'#FFFFFF',
  heading:'#1A1C1E', body:'#474D52', muted:'#8A9099', border:'#E4E9F2',
  green:'#16A34A', greenLt:'#DCFCE7',
  amber:'#D97706', amberLt:'#FEF3C7',
  red:'#DC2626',
};

async function ensureSepolia() {
  if (!window.ethereum) throw new Error('No wallet detected');
  try {
    await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:SEPOLIA_PARAMS.chainId }] });
  } catch (e) {
    if (e.code === 4902 || e.code === -32603 || e.message?.includes('Unrecognized chain')) {
      await window.ethereum.request({ method:'wallet_addEthereumChain', params:[SEPOLIA_PARAMS] });
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:SEPOLIA_PARAMS.chainId }] });
    } else throw e;
  }
}


const card = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'2.25rem', width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(0,71,255,.08)' };

export default function ClaimPage() {
  const params  = useParams();
  const router  = useRouter();
  const claimId = params.claimId;

  const [deposit,     setDeposit]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [wallet,      setWallet]      = useState(null);
  const [walletType,  setWalletType]  = useState(null);
  const [status,      setStatus]      = useState('idle');
  const [error,       setError]       = useState('');
  const [pinInput,    setPinInput]    = useState(['','','','']);
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError,    setPinError]    = useState('');
  const [pinLoading,  setPinLoading]  = useState(false);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const truncate = a => a ? `${a.slice(0,6)}...${a.slice(-4)}` : '';

  const fetchDeposit = useCallback(async () => {
    try {
      const res  = await fetch(`/api/claim/${claimId}`);
      const data = await res.json();
      if (data.found) { setDeposit(data); }
      else {
        try {
          const contract = getReadContract();
          const [depositor, amount, claimed] = await contract.getDeposit(claimId);
          if (amount > 0n) setDeposit({ found:true, amount:ethers.formatEther(amount), claimed, sender:depositor, hasPin:false });
          else setDeposit({ found:false });
        } catch { setDeposit({ found:false }); }
      }
    } catch { setDeposit({ found:false }); }
    finally { setLoading(false); }
  }, [claimId]);

  useEffect(() => { if (claimId) fetchDeposit(); }, [claimId, fetchDeposit]);

  function handlePinChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...pinInput]; next[idx] = val; setPinInput(next);
    if (val && idx < 3) pinRefs[idx+1].current?.focus();
  }
  function handlePinKeyDown(idx, e) {
    if (e.key === 'Backspace' && !pinInput[idx] && idx > 0) pinRefs[idx-1].current?.focus();
  }
  function handlePinPaste(e) {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,4);
    if (p.length === 4) { setPinInput(p.split('')); pinRefs[3].current?.focus(); e.preventDefault(); }
  }

  async function verifyPin() {
    const p = pinInput.join('');
    if (p.length !== 4) { setPinError('Enter all 4 digits.'); return; }
    setPinLoading(true); setPinError('');
    try {
      const res  = await fetch(`/api/claim/${claimId}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ pin:p }) });
      const data = await res.json();
      if (data.valid) setPinVerified(true);
      else setPinError('Incorrect PIN. Try again.');
    } catch { setPinError('Failed to verify PIN.'); }
    finally { setPinLoading(false); }
  }

  async function handleConnectWallet() {
    try {
      setError(''); setStatus('connecting');
      if (!window.ethereum) throw new Error('No wallet detected');
      await ensureSepolia();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const address  = await signer.getAddress();
      setWallet({ signer, address }); setWalletType('metamask'); setStatus('idle');
    } catch (err) { setError(err.message); setStatus('error'); }
  }

  function handleCreateWallet() {
    try {
      setError('');
      const w = hasLocalWallet() ? loadWallet() : createWallet();
      setWallet({ signer:w, address:w.address }); setWalletType('local'); setStatus('idle');
    } catch (err) { setError(err.message); }
  }

  async function handleClaim() {
    if (!wallet) return;
    try {
      setStatus('claiming'); setError('');
      const contract = getWriteContract(wallet.signer);
      const tx       = await contract.claim(claimId, wallet.address);
      const receipt  = await tx.wait();
      const balance  = await getBalance(wallet.address);
      const p = new URLSearchParams({ tx:receipt.hash, balance, amount:deposit.amount, address:wallet.address });
      router.push(`/success?${p.toString()}`);
    } catch (err) { setError(err.reason || err.message || 'Claim failed'); setStatus('error'); }
  }

  const Nav = () => (
    <nav style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'.9rem 5vw', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <Link href="/" style={{ display:'flex', alignItems:'center', gap:'.5rem', fontWeight:800, fontSize:'1.1rem', color:C.heading, textDecoration:'none', letterSpacing:'-.03em' }}>
        <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/> transfr
      </Link>
      <Link href="/send" style={{ background:C.blue, color:'#fff', padding:'.55rem 1.2rem', borderRadius:8, fontWeight:700, fontSize:'.82rem', textDecoration:'none' }}>
        Launch App
      </Link>
    </nav>
  );

  const Wrap = ({ children }) => (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:C.bg, minHeight:'100vh', color:C.heading }}>
      <Nav/>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 65px)', padding:'2rem' }}>
        <div style={card}>{children}</div>
      </div>
    </div>
  );

  if (loading) return (
    <Wrap>
      <div style={{ textAlign:'center', padding:'2rem 0' }}>
        <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.blue, borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 1rem' }}/>
        <p style={{ color:C.muted, fontSize:'.9rem' }}>Loading claim details…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Wrap>
  );

  if (!deposit?.found) return (
    <Wrap>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:56, height:56, borderRadius:14, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
        <img src="/logo2.png" alt="transfr" style={{ height:30, width:'auto', opacity:.4 }}/>
      </div>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'.6rem' }}>Not Found</h1>
        <p style={{ color:C.body, fontSize:'.9rem', lineHeight:1.7, marginBottom:'1.5rem' }}>This claim link is invalid or the deposit has not been confirmed yet.</p>
        <Link href="/" style={{ display:'inline-block', background:C.blue, color:'#fff', padding:'.75rem 1.75rem', borderRadius:8, fontWeight:700, fontSize:'.875rem', textDecoration:'none' }}>Back to Home</Link>
      </div>
    </Wrap>
  );

  if (deposit.claimed) return (
    <Wrap>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:56, height:56, borderRadius:14, background:C.greenLt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', color:C.green, fontSize:'1.5rem', fontWeight:700 }}>✓</div>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'.6rem' }}>Already Claimed</h1>
        <p style={{ color:C.body, fontSize:'.9rem', lineHeight:1.7, marginBottom:'1.5rem' }}>This deposit of {deposit.amount} ETH has already been claimed.</p>
        <Link href="/" style={{ display:'inline-block', background:C.blue, color:'#fff', padding:'.75rem 1.75rem', borderRadius:8, fontWeight:700, fontSize:'.875rem', textDecoration:'none' }}>Back to Home</Link>
      </div>
    </Wrap>
  );

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:C.bg, minHeight:'100vh', color:C.heading }}>
      <Nav/>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 65px)', padding:'2rem' }}>
        <div style={card}>
          <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:C.blueLt, color:C.blue, padding:'.35rem .9rem', borderRadius:99, fontSize:'.72rem', fontWeight:700, letterSpacing:'.06em', marginBottom:'1rem' }}>
              SEPOLIA TESTNET · INCOMING TRANSFER
            </div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.04em', marginBottom:'.4rem' }}>Claim Your ETH</h1>
            <p style={{ color:C.body, fontSize:'.875rem' }}>Someone sent you testnet ETH on Sepolia.</p>
          </div>

          <div style={{ background:`linear-gradient(135deg,${C.blueLt},rgba(0,71,255,.05))`, border:`1px solid rgba(0,71,255,.2)`, borderRadius:14, padding:'1.5rem', textAlign:'center', marginBottom:'1.75rem' }}>
            <div style={{ fontSize:'.7rem', fontWeight:700, color:C.blue, letterSpacing:'.1em', marginBottom:'.4rem' }}>AMOUNT FOR YOU</div>
            <div style={{ fontSize:'3rem', fontWeight:900, letterSpacing:'-.06em', color:C.heading, lineHeight:1.1 }}>{deposit.amount}</div>
            <div style={{ fontSize:'1.1rem', fontWeight:700, color:C.blue, marginTop:'.25rem' }}>ETH</div>
          </div>

          {deposit.hasPin && !pinVerified ? (
            <div>
              <div style={{ background:C.amberLt, border:`1px solid rgba(217,119,6,.25)`, borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1.25rem', fontSize:'.85rem', color:C.amber, lineHeight:1.6 }}>
                This transfer is PIN-protected. Enter the 4-digit PIN the sender shared with you.
              </div>
              <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:C.muted, letterSpacing:'.08em', textAlign:'center', marginBottom:'.75rem' }}>ENTER PIN</label>
              <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', marginBottom:'1rem' }} onPaste={handlePinPaste}>
                {pinInput.map((d,i) => (
                  <input key={i} ref={pinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handlePinChange(i, e.target.value)}
                    onKeyDown={e => handlePinKeyDown(i, e)}
                    id={`claim-pin-${i}`} aria-label={`PIN digit ${i+1}`}
                    style={{ width:60, height:64, background:d ? C.blueLt : C.bg, border:`2px solid ${d ? C.blue : C.border}`, borderRadius:10, color:C.heading, fontSize:'1.5rem', fontWeight:800, textAlign:'center', outline:'none', transition:'all .15s', fontFamily:'inherit' }}/>
                ))}
              </div>
              {pinError && <div style={{ background:'#FEE2E2', color:C.red, borderRadius:10, padding:'.75rem', fontSize:'.85rem', marginBottom:'.75rem', textAlign:'center' }}>{pinError}</div>}
              <button onClick={verifyPin} disabled={pinLoading || pinInput.some(d => !d)} id="verify-pin-btn"
                style={{ width:'100%', background:C.blue, color:'#fff', border:'none', padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:'pointer', opacity: pinInput.some(d => !d) ? .5 : 1 }}>
                {pinLoading ? 'Verifying…' : 'Verify PIN'}
              </button>
            </div>
          ) : !wallet ? (
            <div>
              <button onClick={handleConnectWallet} disabled={status==='connecting'} id="connect-wallet-btn"
                style={{ width:'100%', background:C.blue, color:'#fff', border:'none', padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:'pointer', marginBottom:'1rem', boxShadow:'0 4px 16px rgba(0,71,255,.3)' }}>
                {status==='connecting' ? 'Connecting…' : 'Connect Wallet'}
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', margin:'1rem 0', color:C.muted, fontSize:'.82rem' }}>
                <div style={{ flex:1, height:1, background:C.border }}/> or <div style={{ flex:1, height:1, background:C.border }}/>
              </div>
              <button onClick={handleCreateWallet} id="create-wallet-btn"
                style={{ width:'100%', background:C.surface, color:C.heading, border:`1px solid ${C.border}`, padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
                {hasLocalWallet() ? 'Use Saved Wallet' : 'Create New Wallet'}
              </button>
              {!hasLocalWallet() && <p style={{ color:C.muted, fontSize:'.8rem', textAlign:'center', marginTop:'.75rem' }}>A new wallet will be created and saved in your browser.</p>}
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem', background:C.blueLt, borderRadius:10, padding:'.75rem', marginBottom:'1.25rem' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:C.green, display:'inline-block' }}/>
                <span style={{ color:C.blue, fontWeight:700, fontSize:'.85rem' }}>{truncate(wallet.address)}</span>
                <span style={{ color:C.muted, fontSize:'.75rem' }}>({walletType === 'metamask' ? 'MetaMask' : 'Local'})</span>
              </div>
              <button onClick={handleClaim} disabled={status==='claiming'} id="claim-btn"
                style={{ width:'100%', background:C.green, color:'#fff', border:'none', padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 4px 16px rgba(22,163,74,.3)' }}>
                {status==='claiming' ? 'Claiming…' : `Claim ${deposit.amount} ETH`}
              </button>
              {walletType === 'local' && <p style={{ color:C.muted, fontSize:'.78rem', textAlign:'center', marginTop:'.75rem' }}>Wallet stored locally. Back it up if used for real funds.</p>}
            </div>
          )}

          {error && <div style={{ background:'#FEE2E2', color:C.red, borderRadius:10, padding:'.875rem', fontSize:'.875rem', marginTop:'1rem' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
