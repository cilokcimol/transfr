'use client';
import { useState, useRef } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { getWriteContract, generateClaimId } from '../../lib/contract';
import { EXPLORER_URL, CHAIN_ID, CHAIN_NAME } from '../../lib/constants';

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
  red:'#DC2626', redLt:'#FEE2E2',
};

async function ensureSepoliaNetwork() {
  if (!window.ethereum) throw new Error('No wallet detected. Please install MetaMask or Rabby.');
  try {
    await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:SEPOLIA_PARAMS.chainId }] });
  } catch (err) {
    if (err.code === 4902 || err.code === -32603 || err.message?.includes('Unrecognized chain')) {
      await window.ethereum.request({ method:'wallet_addEthereumChain', params:[SEPOLIA_PARAMS] });
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:SEPOLIA_PARAMS.chainId }] });
    } else throw err;
  }
}


function Avatar({ email }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : '??';
  const colors = ['#0047FF','#7C3AED','#0891B2','#059669','#D97706'];
  const color = colors[email?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div style={{ width:36, height:36, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'.75rem', flexShrink:0 }}>
      {initials}
    </div>
  );
}

const statusStyle = {
  Pending: { bg:C.blueLt, color:C.blue },
  Claimed: { bg:C.greenLt, color:C.green },
  Expired: { bg:'#FEE2E2', color:C.red },
};

export default function SendPage() {
  const [wallet, setWallet]   = useState(null);
  const [status, setStatus]   = useState('idle');
  const [error, setError]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [transfers, setTransfers] = useState([]);

  const [amount, setAmount]   = useState('');
  const [email, setEmail]     = useState('');
  const [pin, setPin]         = useState(['','','','']);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const truncate = a => a ? `${a.slice(0,6)}...${a.slice(-4)}` : '';
  const totalSent = transfers.reduce((s,t) => s + parseFloat(t.amount||0), 0);
  const active    = transfers.filter(t => t.status === 'Pending').length;
  const claimed   = transfers.filter(t => t.status === 'Claimed').length;

  async function handleConnect() {
    try {
      setStatus('connecting'); setError('');
      if (!window.ethereum) throw new Error('Please install MetaMask or Rabby.');
      await ensureSepoliaNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const address  = await signer.getAddress();
      setWallet({ signer, address });
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      setStatus('error');
    }
  }

  function handlePinChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin]; next[idx] = val; setPin(next);
    if (val && idx < 3) pinRefs[idx+1].current?.focus();
  }
  function handlePinKeyDown(idx, e) {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) pinRefs[idx-1].current?.focus();
  }
  function handlePinPaste(e) {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,4);
    if (p.length === 4) { setPin(p.split('')); pinRefs[3].current?.focus(); e.preventDefault(); }
  }

  async function handleSend(e) {
    e.preventDefault();
    const pinStr = pin.join('');
    if (!wallet || !amount || !email || pinStr.length !== 4) {
      setSendError('Please fill all fields and set a 4-digit PIN.'); return;
    }
    try {
      setSending(true); setSendError('');
      const claimId   = generateClaimId();
      const weiAmount = ethers.parseEther(amount);
      const contract  = getWriteContract(wallet.signer);
      const tx        = await contract.deposit(claimId, { value: weiAmount });
      const receipt   = await tx.wait();
      const res = await fetch('/api/deposit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ claimId, amount, recipientEmail:email, txHash:receipt.hash, sender:wallet.address, pin:pinStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setTransfers(prev => [{
        id: claimId, email, amount, date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
        status:'Pending', txHash:receipt.hash, claimUrl:data.claimUrl,
      }, ...prev]);
      setShowForm(false);
      setAmount(''); setEmail(''); setPin(['','','','']);
    } catch (err) {
      setSendError(err.reason || err.message || 'Transaction failed');
    } finally {
      setSending(false);
    }
  }

  if (!wallet) {
    return (
      <div style={{ fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:C.bg, minHeight:'100vh', color:C.heading }}>
        <nav style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'.9rem 5vw', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:'.5rem', fontWeight:800, fontSize:'1.1rem', color:C.heading, textDecoration:'none', letterSpacing:'-.03em' }}>
                      <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/> transfr
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
            <a href="/#how-it-works" style={{ color:C.body, fontSize:'.875rem', fontWeight:500, textDecoration:'none' }}>How it works</a>
          </div>
          <button onClick={handleConnect} disabled={status==='connecting'}
            style={{ background:C.blue, color:'#fff', border:'none', padding:'.6rem 1.4rem', borderRadius:8, fontWeight:700, fontSize:'.875rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'.5rem' }}>
            {status==='connecting' ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </nav>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 65px)', padding:'2rem' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'3rem', maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 8px 40px rgba(0,71,255,.08)' }}>
            <div style={{ width:60, height:60, borderRadius:14, background:C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
              <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/>
            </div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.04em', marginBottom:'.6rem' }}>Send Crypto via Email</h1>
            <p style={{ color:C.body, fontSize:'.95rem', lineHeight:1.7, marginBottom:'2rem' }}>
              Connect your wallet to access the dashboard and send testnet ETH to anyone with just their email address.
            </p>
            {error && (
              <div style={{ background:'#FEE2E2', color:C.red, border:'1px solid #FECACA', borderRadius:10, padding:'.875rem', fontSize:'.875rem', marginBottom:'1.25rem', textAlign:'left' }}>{error}</div>
            )}
            <button onClick={handleConnect} disabled={status==='connecting'}
              style={{ width:'100%', background:C.blue, color:'#fff', border:'none', padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 4px 16px rgba(0,71,255,.3)' }}>
              {status==='connecting' ? 'Connecting…' : 'Connect Wallet'}
            </button>
            <p style={{ color:C.muted, fontSize:'.8rem', marginTop:'1rem' }}>Supports MetaMask, Rabby, and all EVM wallets</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:C.bg, minHeight:'100vh', color:C.heading }}>
      <nav style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'.9rem 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'.5rem', fontWeight:800, fontSize:'1.1rem', color:C.heading, textDecoration:'none', letterSpacing:'-.03em' }}>
                    <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/> transfr
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
          <a href="/#how-it-works" style={{ color:C.body, fontSize:'.875rem', fontWeight:500, textDecoration:'none' }}>How it works</a>
          <span style={{ color:C.blue, fontSize:'.875rem', fontWeight:600, borderBottom:`2px solid ${C.blue}`, paddingBottom:'.1rem' }}>Dashboard</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', background:C.blueLt, border:`1px solid rgba(0,71,255,.2)`, borderRadius:8, padding:'.5rem 1rem' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.green, display:'inline-block' }}/>
          <span style={{ color:C.blue, fontWeight:700, fontSize:'.82rem' }}>{truncate(wallet.address)}</span>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.04em', marginBottom:'.3rem' }}>Transaction Dashboard</h1>
            <p style={{ color:C.body, fontSize:'.9rem' }}>Overview of your recent transfers and statuses.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ background:C.blue, color:'#fff', border:'none', padding:'.75rem 1.5rem', borderRadius:8, fontWeight:700, fontSize:'.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'.5rem', boxShadow:'0 4px 16px rgba(0,71,255,.3)' }}>
            <span style={{ fontSize:'1.1rem' }}>+</span> New Transfer
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', marginBottom:'2rem' }}>
          {[
            { label:'Total Sent', value:`${totalSent.toFixed(4)} ETH`, badge:'All Time', icon:'↑' },
            { label:'Active Transfers', value:String(active), badge: active > 0 ? 'Requires Attention' : 'All clear', warn: active > 0, icon:'⟳' },
            { label:'Claimed Successfully', value:String(claimed), badge:'Completed', icon:'✓' },
          ].map((card,i) => (
            <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:card.warn ? '#FEF3C7' : C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', color:card.warn ? C.amber : C.blue, fontSize:'1rem', fontWeight:700 }}>{card.icon}</div>
                <span style={{ fontSize:'.7rem', fontWeight:600, color:card.warn ? C.amber : C.muted, background:card.warn ? C.amberLt : C.bg, padding:'.2rem .65rem', borderRadius:99 }}>{card.badge}</span>
              </div>
              <div style={{ color:C.muted, fontSize:'.82rem', marginBottom:'.3rem' }}>{card.label}</div>
              <div style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-.04em', color:C.heading }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontSize:'1.05rem', fontWeight:700 }}>Recent Transfers</h2>
          </div>

          {transfers.length === 0 ? (
            <div style={{ padding:'4rem 2rem', textAlign:'center' }}>
              <div style={{ width:52, height:52, borderRadius:12, background:C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                <img src="/logo2.png" alt="transfr" style={{ height:30, width:'auto' }}/>
              </div>
              <p style={{ fontWeight:600, color:C.heading, marginBottom:'.4rem' }}>No transfers yet</p>
              <p style={{ color:C.muted, fontSize:'.875rem', marginBottom:'1.5rem' }}>Click "+ New Transfer" to send your first ETH via email.</p>
              <button onClick={() => setShowForm(true)}
                style={{ background:C.blue, color:'#fff', border:'none', padding:'.7rem 1.5rem', borderRadius:8, fontWeight:700, fontSize:'.875rem', cursor:'pointer' }}>
                Send Now
              </button>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.bg }}>
                  {['Recipient','Amount','Date','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'.75rem 1.5rem', textAlign:'left', fontSize:'.75rem', fontWeight:600, color:C.muted, letterSpacing:'.04em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((t,i) => {
                  const st = statusStyle[t.status] || statusStyle.Pending;
                  return (
                    <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
                        <Avatar email={t.email}/>
                        <div>
                          <div style={{ fontWeight:600, fontSize:'.875rem', color:C.heading }}>{t.email}</div>
                          <div style={{ fontSize:'.75rem', color:C.muted }}>Wallet: {truncate(wallet.address)}</div>
                        </div>
                      </td>
                      <td style={{ padding:'1rem 1.5rem' }}>
                        <div style={{ fontWeight:700, fontSize:'.9rem', color:C.heading }}>{t.amount} ETH</div>
                        <div style={{ fontSize:'.75rem', color:C.muted }}>SepoliaETH</div>
                      </td>
                      <td style={{ padding:'1rem 1.5rem', color:C.body, fontSize:'.875rem' }}>{t.date}</td>
                      <td style={{ padding:'1rem 1.5rem' }}>
                        <span style={{ background:st.bg, color:st.color, padding:'.3rem .75rem', borderRadius:99, fontSize:'.75rem', fontWeight:600 }}>
                          ● {t.status}
                        </span>
                      </td>
                      <td style={{ padding:'1rem 1.5rem' }}>
                        <a href={t.claimUrl} target="_blank" rel="noopener noreferrer"
                          style={{ color:C.blue, fontSize:'.8rem', fontWeight:600, textDecoration:'none' }}>
                          Copy Link
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,17,23,.5)', backdropFilter:'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background:C.surface, borderRadius:20, padding:'2rem', width:'100%', maxWidth:460, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,.2)', border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.25rem', fontWeight:800, letterSpacing:'-.03em' }}>New Transfer</h2>
              <button onClick={() => setShowForm(false)}
                style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:'1.4rem', lineHeight:1, padding:'.25rem' }}>×</button>
            </div>

            <form onSubmit={handleSend}>
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:C.muted, letterSpacing:'.08em', marginBottom:'.5rem' }}>RECIPIENT EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="friend@example.com"
                  style={{ width:'100%', padding:'.875rem 1rem', background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, color:C.heading, fontSize:'.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}/>
                <p style={{ fontSize:'.75rem', color:C.muted, marginTop:'.35rem' }}>They will receive a secure claim link</p>
              </div>

              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:C.muted, letterSpacing:'.08em', marginBottom:'.5rem' }}>AMOUNT (ETH)</label>
                <input type="number" step="0.0001" min="0" value={amount} onChange={e => setAmount(e.target.value)} required
                  placeholder="0.01"
                  style={{ width:'100%', padding:'.875rem 1rem', background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, color:C.heading, fontSize:'.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}/>
                <p style={{ fontSize:'.75rem', color:C.muted, marginTop:'.35rem' }}>Sepolia testnet ETH · Est. gas: ~0.0002 ETH</p>
              </div>

              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:C.muted, letterSpacing:'.08em', marginBottom:'.75rem' }}>SECURITY PIN (4 DIGITS)</label>
                <div style={{ display:'flex', gap:'.75rem', justifyContent:'center' }} onPaste={handlePinPaste}>
                  {pin.map((d,i) => (
                    <input key={i} ref={pinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handlePinChange(i, e.target.value)}
                      onKeyDown={e => handlePinKeyDown(i, e)}
                      id={`pin-digit-${i}`} aria-label={`PIN digit ${i+1}`}
                      style={{ width:60, height:64, background:d ? C.blueLt : C.bg, border:`2px solid ${d ? C.blue : C.border}`, borderRadius:10, color:C.heading, fontSize:'1.5rem', fontWeight:800, textAlign:'center', outline:'none', transition:'all .15s', fontFamily:'inherit' }}/>
                  ))}
                </div>
                <p style={{ fontSize:'.75rem', color:C.muted, textAlign:'center', marginTop:'.75rem' }}>Share this PIN with the recipient separately</p>
              </div>

              {amount && email && pin.every(d => d) && (
                <div style={{ background:C.blueLt, border:`1px solid rgba(0,71,255,.2)`, borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.35rem' }}>
                    <span style={{ fontSize:'.82rem', color:C.body }}>Sending</span>
                    <span style={{ fontWeight:800, color:C.blue }}>{amount} ETH</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'.82rem', color:C.body }}>To</span>
                    <span style={{ fontWeight:600, color:C.heading, fontSize:'.82rem' }}>{email}</span>
                  </div>
                </div>
              )}

              {sendError && (
                <div style={{ background:'#FEE2E2', color:C.red, border:'1px solid #FECACA', borderRadius:10, padding:'.875rem', fontSize:'.875rem', marginBottom:'1rem' }}>{sendError}</div>
              )}

              <button type="submit" disabled={sending}
                style={{ width:'100%', background:sending ? '#93A8E8' : C.blue, color:'#fff', border:'none', padding:'1rem', borderRadius:10, fontWeight:700, fontSize:'1rem', cursor:sending ? 'not-allowed' : 'pointer', boxShadow:'0 4px 16px rgba(0,71,255,.3)', transition:'background .15s' }}>
                {sending ? 'Sending…' : 'Send to Email →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
