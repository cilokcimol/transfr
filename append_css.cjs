const fs = require('fs');
const extra = `
.hero-section-wrap{position:relative;min-height:100vh;display:flex;align-items:flex-end;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background:url('/hero-bg.png') center center/cover no-repeat;z-index:0;}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,7,20,.25) 0%,rgba(5,7,20,.1) 40%,rgba(5,7,20,.75) 80%,rgba(5,7,20,1) 100%),linear-gradient(to right,rgba(5,7,20,.55) 0%,transparent 50%,rgba(5,7,20,.25) 100%);}
.grid-overlay{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);pointer-events:none;}
.page-bg{position:fixed;inset:0;z-index:-3;background:url('/send-bg.png') center center/cover no-repeat;}
.page-bg::after{content:'';position:absolute;inset:0;background:rgba(5,7,20,.75);}
.hero-content{position:relative;z-index:1;width:100%;max-width:1400px;margin:0 auto;padding:0 5rem 10rem;display:flex;align-items:flex-end;gap:4rem;min-height:100vh;}
.hero-text-col{flex:0 0 52%;}
.hero-card-col{flex:0 0 44%;display:flex;align-items:flex-end;justify-content:center;}
.sys-label{font-family:var(--mono);font-size:.7rem;color:var(--indigo);letter-spacing:.08em;margin-bottom:1.25rem;opacity:.8;}
.live-ticker{width:100%;border-top:1px solid rgba(255,255,255,.06);background:rgba(5,7,20,.85);backdrop-filter:blur(20px);display:flex;gap:0;position:relative;z-index:2;}
.ticker-item{flex:1;padding:1.1rem 1.75rem;border-right:1px solid rgba(255,255,255,.06);}
.ticker-item:last-child{border-right:none;}
.ticker-val{font-size:1.6rem;font-weight:800;color:var(--ink);letter-spacing:-.04em;font-variant-numeric:tabular-nums;}
.ticker-label{font-size:.65rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.1em;margin-top:.25rem;}
.ticker-change{font-size:.72rem;font-weight:600;margin-top:.2rem;}
.ticker-up{color:#4ade80;}.ticker-down{color:#f87171;}
.status-bar{position:fixed;bottom:0;left:0;right:0;z-index:50;padding:.45rem 2rem;background:rgba(5,7,20,.92);border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:.62rem;color:var(--ink3);letter-spacing:.08em;}
.status-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);margin-right:.5rem;animation:pulse 2s ease infinite;}
.data-card{background:rgba(13,16,32,.88);border:1px solid rgba(255,255,255,.08);border-radius:1rem;backdrop-filter:blur(24px);overflow:hidden;}
.data-card-header{padding:.75rem 1.25rem;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;font-size:.72rem;color:var(--ink2);font-family:var(--mono);}
.data-card-body{padding:1.25rem;}
@media(max-width:900px){
  .hero-content{flex-direction:column;padding:6rem 1.5rem 5rem;align-items:flex-start;}
  .hero-text-col,.hero-card-col{flex:none;width:100%;}
  .live-ticker,.status-bar{display:none;}
}
`;
fs.appendFileSync('src/app/globals.css', extra);
console.log('Done, total:', fs.readFileSync('src/app/globals.css').length, 'chars');
