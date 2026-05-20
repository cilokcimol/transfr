'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import FluidInteractiveBg from '../components/FluidInteractiveBg';

const C = {
  blue:    '#0047FF',
  blueLt:  '#EEF2FF',
  blueHov: '#0035CC',
  bg:      '#F8FAFF',
  surface: '#FFFFFF',
  heading: '#1A1C1E',
  body:    '#474D52',
  muted:   '#8A9099',
  border:  '#E4E9F2',
  dark:    '#0F1117',
  darkAlt: '#161B2E',
};

const S = {
  page:    { fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:C.bg, color:C.heading, minHeight:'100vh', lineHeight:1.6 },
  nav:     { position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(248,250,255,0.92)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.border}`, padding:'.85rem 5vw', display:'flex', alignItems:'center', justifyContent:'space-between' },
  navLogo: { display:'flex', alignItems:'center', gap:'.5rem', fontWeight:800, fontSize:'1.1rem', letterSpacing:'-.04em', color:C.heading, textDecoration:'none' },
  navLink: { color:C.body, fontSize:'.875rem', fontWeight:500, textDecoration:'none', transition:'color .15s' },
  navBtn:  { background:C.blue, color:'#fff', padding:'.55rem 1.3rem', borderRadius:8, fontWeight:700, fontSize:'.85rem', textDecoration:'none', transition:'background .15s' },
};


const steps = [
  { n:'01', t:'Connect Wallet', d:'Link any EVM wallet. Transfr auto-adds Sepolia RPC if not configured.' },
  { n:'02', t:'Enter Email + PIN', d:'Set recipient email and a 4-digit PIN. No wallet address needed from them.' },
  { n:'03', t:'Claim Anytime', d:'Recipient gets a secure link. They enter the PIN and ETH is released instantly.' },
];

const features = [
  { t:'Smart Contract Escrow', d:'Funds lock the moment you send. Fully trustless, no custody by Transfr.' },
  { t:'4-Digit PIN Lock', d:'PIN verified onchain. Zero centralization. You control access end-to-end.' },
  { t:'Instant Email Delivery', d:'Claim link arrives in seconds. No wallet or setup required to receive.' },
  { t:'Any EVM Wallet', d:'MetaMask, Rabby, or any EVM wallet. Sepolia RPC added automatically.' },
];

const usecases = [
  { t:'Pay Freelancers', d:'Send to designers or devs without collecting wallet addresses.' },
  { t:'Developer Testing', d:'QA teams move tokens without wallet coordination during dApp testing.' },
  { t:'Onboard Newcomers', d:'They claim ETH before even setting up a wallet. True Web3 onboarding.' },
  { t:'Gift Crypto', d:'Send ETH as a gift. Claim at any pace with the PIN you share.' },
  { t:'Split Bills', d:'Settle shared expenses in ETH with nothing but an email address.' },
  { t:'Hackathon Prizes', d:'Distribute prizes to winners in seconds, no wallet list needed.' },
];

const stats = [
  { val:'0', label:'Wallets required by recipient' },
  { val:'4', label:'Digit PIN, onchain verified' },
  { val:'<10s', label:'Average send time' },
  { val:'100%', label:'Non-custodial escrow' },
  { val:'Free', label:'Testnet transfers on Sepolia' },
  { val:'256-bit', label:'Entropy per claim ID' },
];

export default function Page() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-text, .reveal-card, .reveal-scale');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ ...S.page, background: 'transparent' }}>
      <FluidInteractiveBg />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"/>

      <nav style={S.nav}>
        <Link href="/" style={S.navLogo}>
          <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/>
          transfr
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
          {[['How it Works','#how-it-works'],['Features','#features'],['Use Cases','#use-cases'],['About','#about']].map(([l,h]) => (
            <a key={l} href={h} style={S.navLink}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.body}>{l}</a>
          ))}
        </div>
        <Link href="/send" style={S.navBtn}
          onMouseEnter={e => e.currentTarget.style.background = C.blueHov}
          onMouseLeave={e => e.currentTarget.style.background = C.blue}>
          Launch App
        </Link>
      </nav>

      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'7rem 5vw 5rem', position:'relative', overflow:'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}>
          <source src="/tf.mp4" type="video/mp4"/>
        </video>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)', zIndex:1 }}/>
        <div style={{ maxWidth:680, width:'100%', textAlign:'center', position:'relative', zIndex:2 }}>
          <div className="hero-anim-1" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)', padding:'.35rem .9rem', borderRadius:99, fontSize:'.75rem', fontWeight:700, letterSpacing:'.06em', marginBottom:'1.5rem' }}>
            SEPOLIA TESTNET LIVE
          </div>
          <h1 className="hero-anim-2" style={{ fontSize:'clamp(2.6rem,5vw,4.2rem)', fontWeight:800, lineHeight:1.08, letterSpacing:'-.04em', color:'#FFFFFF', marginBottom:'1.25rem', textShadow:'0 2px 20px rgba(0,0,0,0.3)' }}>
            Send Crypto to<br/>
            <span className="shimmer-text">Any Email.</span>
          </h1>
          <p className="hero-anim-3" style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.82)', lineHeight:1.75, marginBottom:'2.25rem', maxWidth:500, margin:'0 auto 2.25rem' }}>
            Transfer testnet ETH to anyone using just their email address. Funds lock in a smart contract until they claim with a 4 digit PIN. No recipient wallet needed.
          </p>
          <div className="hero-anim-4" style={{ display:'flex', gap:'1rem', alignItems:'center', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/send" style={{ background:C.blue, color:'#fff', padding:'.9rem 2rem', borderRadius:10, fontWeight:700, fontSize:'1rem', textDecoration:'none', boxShadow:'0 4px 24px rgba(0,71,255,.5)', transition:'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blueHov; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = 'none'; }}>
              Launch App
            </Link>
            <a href="#how-it-works" style={{ color:'rgba(255,255,255,0.85)', fontSize:'.9rem', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'.4rem' }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      <section style={{ background:'rgba(255, 255, 255, 0.4)', backdropFilter:'blur(20px)', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'2rem 5vw', overflowX:'auto' }}>
        <div style={{ display:'flex', gap:0, minWidth:'max-content', maxWidth:1200, margin:'0 auto', width:'100%' }}>
          {stats.map((s,i) => (
            <div key={i} style={{ flex:'0 0 auto', padding:'0 2.5rem', borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none', textAlign:'center' }}>
              <div style={{ fontSize:'1.75rem', fontWeight:800, color:C.blue, letterSpacing:'-.04em', lineHeight:1.1 }}>{s.val}</div>
              <div style={{ fontSize:'.72rem', color:C.muted, marginTop:'.3rem', letterSpacing:'.04em' }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding:'7rem 5vw', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(20px)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="reveal-text" style={{ textAlign:'center', marginBottom:'4rem' }}>
            <div style={{ display:'inline-block', background:C.blueLt, color:C.blue, padding:'.35rem .9rem', borderRadius:99, fontSize:'.72rem', fontWeight:700, letterSpacing:'.08em', marginBottom:'1rem' }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:800, letterSpacing:'-.04em', color:C.heading, lineHeight:1.15 }}>Three steps. That is all.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {steps.map((s,i) => (
              <div key={i} className={`card-lift reveal-card stagger-${i+1}`} style={{ background:'rgba(255, 255, 255, 0.65)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:16, padding:'2rem', position:'relative', overflow:'hidden', transition:'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 32px rgba(0,71,255,.1)`; e.currentTarget.style.borderColor=`rgba(0,71,255,.3)`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=C.border; }}>
                <div style={{ position:'absolute', top:'1.5rem', right:'1.5rem', fontSize:'2.5rem', fontWeight:900, color:'rgba(0,71,255,.06)', letterSpacing:'-.06em' }}>{s.n}</div>
                <div style={{ width:40, height:40, borderRadius:10, background:C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                  <span style={{ color:C.blue, fontWeight:800, fontSize:'.9rem' }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:C.heading, marginBottom:'.6rem' }}>{s.t}</h3>
                <p style={{ fontSize:'.875rem', color:C.body, lineHeight:1.7 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={{ padding:'7rem 5vw', background:'transparent' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', marginBottom:'4rem' }}>
            <div className="reveal-text">
              <div style={{ display:'inline-block', background:C.blueLt, color:C.blue, padding:'.35rem .9rem', borderRadius:99, fontSize:'.72rem', fontWeight:700, letterSpacing:'.08em', marginBottom:'1rem' }}>FEATURES</div>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:800, letterSpacing:'-.04em', color:C.heading, lineHeight:1.15 }}>Built for real security, zero friction.</h2>
            </div>
            <p className="reveal-text stagger-2" style={{ fontSize:'1rem', color:C.body, lineHeight:1.8 }}>Transfr uses an onchain escrow smart contract and a 4-digit PIN you share separately. No custodian, no middleman. Funds move directly from smart contract to recipient wallet.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.25rem' }}>
            {features.map((f,i) => (
              <div key={i} className={`card-lift reveal-card stagger-${i+1}`} style={{ background:'rgba(255, 255, 255, 0.65)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:14, padding:'1.75rem', display:'flex', gap:'1.25rem', alignItems:'flex-start', transition:'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`rgba(0,71,255,.3)`; e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,71,255,.08)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width:36, height:36, borderRadius:8, background:C.blueLt, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:C.blue, fontWeight:800, fontSize:'.85rem' }}>{String(i+1).padStart(2,'0')}</span>
                </div>
                <div>
                  <h3 style={{ fontSize:'.95rem', fontWeight:700, color:C.heading, marginBottom:'.4rem' }}>{f.t}</h3>
                  <p style={{ fontSize:'.85rem', color:C.body, lineHeight:1.65 }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" style={{ padding:'7rem 5vw', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(20px)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="reveal-text" style={{ textAlign:'center', marginBottom:'4rem' }}>
            <div style={{ display:'inline-block', background:C.blueLt, color:C.blue, padding:'.35rem .9rem', borderRadius:99, fontSize:'.72rem', fontWeight:700, letterSpacing:'.08em', marginBottom:'1rem' }}>USE CASES</div>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:800, letterSpacing:'-.04em', color:C.heading }}>Who uses Transfr?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
            {usecases.map((u,i) => (
              <div key={i} className={`card-lift reveal-card stagger-${(i%3)+1}`} style={{ background:'rgba(255, 255, 255, 0.65)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:14, padding:'1.5rem', transition:'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=`rgba(0,71,255,.3)`}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                <h3 style={{ fontSize:'.95rem', fontWeight:700, color:C.heading, marginBottom:'.4rem' }}>{u.t}</h3>
                <p style={{ fontSize:'.85rem', color:C.body, lineHeight:1.65 }}>{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'rgba(238, 242, 255, 0.45)', backdropFilter:'blur(20px)', padding:'7rem 5vw', position:'relative', overflow:'hidden', borderTop:`1px solid ${C.border}` }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(0,71,255,.08) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div className="reveal-card" style={{ maxWidth:900, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', background:C.surface, color:C.blue, border:`1px solid rgba(0,71,255,.2)`, padding:'.35rem .9rem', borderRadius:99, fontSize:'.72rem', fontWeight:700, letterSpacing:'.08em', marginBottom:'1.5rem' }}>FRICTIONLESS VALUE TRANSFER</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, letterSpacing:'-.04em', color:C.heading, lineHeight:1.15, marginBottom:'1.25rem' }}>
            Send your first ETH.<br/>No wallet needed on their end.
          </h2>
          <p style={{ color:C.body, fontSize:'1.05rem', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:560, margin:'0 auto 2.5rem' }}>
            Ethereum Sepolia testnet. Free to use. Connect any EVM wallet and transfer to anyone via email in under 10 seconds.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/send" style={{ background:C.blue, color:'#fff', padding:'.9rem 2rem', borderRadius:10, fontWeight:700, fontSize:'.95rem', textDecoration:'none', boxShadow:'0 4px 20px rgba(0,71,255,.3)', transition:'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blueHov; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = 'none'; }}>
              Launch App
            </Link>
            <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" style={{ background:C.surface, color:C.body, border:`1px solid ${C.border}`, padding:'.9rem 2rem', borderRadius:10, fontWeight:600, fontSize:'.95rem', textDecoration:'none', transition:'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,71,255,.3)'; e.currentTarget.style.color=C.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.body; }}>
              View on Etherscan
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding:'4rem 5vw', background:'transparent', textAlign:'center', borderTop:`1px solid ${C.border}` }}>
        <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', color:C.muted, marginBottom:'1.25rem' }}>CREATED BY</div>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'2.5rem', flexWrap:'wrap' }}>
          {[{name:'Vika Joestar',url:'https://x.com/cryptocymol'},{name:'Kiw Joestar',url:'https://x.com/notkiws'},{name:'Bekbek Joestar',url:'https://x.com/0xVBekbek'}].map(c => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ color:C.heading, fontWeight:700, fontSize:'1.05rem', textDecoration:'none', transition:'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.heading}>{c.name}</a>
          ))}
        </div>
      </section>

      <footer id="about" style={{ padding:'3rem 5vw 4rem', background:'rgba(255, 255, 255, 0.4)', backdropFilter:'blur(20px)', borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 2fr 1fr', gap:'3rem', alignItems:'start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.75rem' }}>
              <img src="/logo2.png" alt="transfr" style={{ height:36, width:'auto', display:'block' }}/>
              <span style={{ fontWeight:800, fontSize:'1rem', letterSpacing:'-.04em', color:C.heading }}>transfr</span>
            </div>
            <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.08em', color:C.muted }}>PROTOCOL v1.0</div>
          </div>
          <div>
            <h3 style={{ fontSize:'.65rem', fontWeight:700, color:C.muted, letterSpacing:'.1em', marginBottom:'.75rem' }}>ABOUT THIS PROJECT</h3>
            <p style={{ fontSize:'.875rem', color:C.body, lineHeight:1.75 }}>
              Transfr is an onchain escrow protocol for sending testnet ETH to anyone via email, secured by a 4-digit PIN and the Ethereum Sepolia network. No recipient wallet required. Funds remain locked in a trustless smart contract until claimed.
            </p>
          </div>
          <div style={{ textAlign:'left', mdTextAlign:'right' }}>
            <h3 style={{ fontSize:'.65rem', fontWeight:700, color:C.muted, letterSpacing:'.1rem', marginBottom:'.85rem', textTransform:'uppercase' }}>CONNECT</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'.65rem', alignItems:'flex-start', mdAlignItems:'flex-end' }}>
              {[
                {
                  l: 'Etherscan Sepolia',
                  u: 'https://sepolia.etherscan.io',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s' }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  ),
                  bg: 'rgba(0, 71, 255, 0.04)',
                  border: 'rgba(0, 71, 255, 0.15)'
                },
                {
                  l: 'Vika on X',
                  u: 'https://x.com/cryptocymol',
                  icon: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'transform 0.3s' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                  bg: 'rgba(15, 17, 23, 0.04)',
                  border: 'rgba(15, 17, 23, 0.1)'
                },
                {
                  l: 'Kiw on X',
                  u: 'https://x.com/notkiws',
                  icon: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'transform 0.3s' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                  bg: 'rgba(15, 17, 23, 0.04)',
                  border: 'rgba(15, 17, 23, 0.1)'
                },
                {
                  l: 'Bekbek on X',
                  u: 'https://x.com/0xVBekbek',
                  icon: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'transform 0.3s' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                  bg: 'rgba(15, 17, 23, 0.04)',
                  border: 'rgba(15, 17, 23, 0.1)'
                }
              ].map(({l, u, icon, bg, border}) => (
                <a key={l} href={u} target="_blank" rel="noopener noreferrer"
                  className="card-lift"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.6rem',
                    padding: '.5rem .85rem',
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    fontSize: '.85rem',
                    color: C.heading,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.blue;
                    e.currentTarget.style.background = C.blueLt;
                    e.currentTarget.style.color = C.blue;
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.style.transform = 'translateX(2px) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.background = bg;
                    e.currentTarget.style.color = C.heading;
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.style.transform = 'none';
                  }}>
                  {icon}
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:'2.5rem auto 0', paddingTop:'1.5rem', borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'.75rem' }}>
          <span style={{ fontSize:'.8rem', color:C.muted }}>© 2026 transfr. Built on Ethereum Sepolia.</span>
          <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 6px rgba(34,197,94,.6)' }}/>
            <span style={{ fontSize:'.75rem', color:C.muted, fontWeight:600 }}>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
