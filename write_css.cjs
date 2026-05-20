const fs = require('fs');
const imp = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');\n";

const vars = `
:root{
  --bg:#06080f;--bg1:#0d1020;--bg2:#141828;
  --glass:rgba(13,16,32,.7);--glass-lt:rgba(255,255,255,.04);
  --border:rgba(255,255,255,.07);--border-hi:rgba(99,102,241,.4);
  --ink:#f0f2ff;--ink2:#a8b0d0;--ink3:#5a6080;
  --indigo:#6366f1;--indigo-lt:rgba(99,102,241,.12);
  --teal:#2dd4bf;--green:#22c55e;--red:#ef4444;
  --grad:linear-gradient(135deg,#6366f1,#4f46e5);
  --r:1.5rem;--r-lg:2.5rem;
  --shadow:0 24px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);
  --t:300ms cubic-bezier(.32,.72,0,1);
  --font:Outfit,-apple-system,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
`;

const base = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
body{font-family:var(--font);background:var(--bg);color:var(--ink);line-height:1.6;min-height:100vh;overflow-x:hidden;}
body::before{
  content:'';position:fixed;inset:0;z-index:-2;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 20% 10%,rgba(99,102,241,.15) 0%,transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 80%,rgba(45,212,191,.08) 0%,transparent 60%),
    radial-gradient(ellipse 80% 70% at 50% 50%,rgba(79,70,229,.06) 0%,transparent 70%);
}
a{color:var(--indigo);text-decoration:none;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:var(--bg1);}
::-webkit-scrollbar-thumb{background:var(--bg2);border-radius:99px;}
::-webkit-scrollbar-thumb:hover{background:var(--indigo);}
`;

const layout = `
.page-container{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;padding-top:5.5rem;}
.header{position:fixed;top:.75rem;left:50%;transform:translateX(-50%);z-index:100;padding:.7rem 1.5rem;display:flex;align-items:center;gap:2rem;background:rgba(13,16,32,.85);backdrop-filter:blur(24px) saturate(180%);border:1px solid var(--border);border-radius:100px;box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05);}
.brand{display:flex;align-items:center;gap:.5rem;font-weight:800;font-size:1.1rem;letter-spacing:-.04em;color:var(--ink);}
.brand-icon{width:28px;height:28px;border-radius:8px;background:var(--grad);display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(99,102,241,.5);}
.nav-links{display:flex;gap:1.25rem;list-style:none;}
.nav-links a{color:var(--ink3);font-size:.875rem;font-weight:500;transition:color var(--t);}
.nav-links a:hover{color:var(--ink);}
`;

const card = `
.card{
  background:var(--glass);border:1px solid var(--border);border-radius:var(--r-lg);
  padding:2.25rem;width:100%;max-width:490px;
  backdrop-filter:blur(32px) saturate(140%);box-shadow:var(--shadow);
  position:relative;overflow:hidden;transition:border-color var(--t),box-shadow var(--t);
}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,.7),rgba(45,212,191,.5),transparent);}
.card::after{content:'';position:absolute;top:-100px;right:-100px;width:300px;height:300px;background:radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 70%);pointer-events:none;}
.card:hover{border-color:var(--border-hi);box-shadow:var(--shadow),0 0 60px rgba(99,102,241,.12);}
.card-title{font-size:1.75rem;font-weight:800;letter-spacing:-.04em;margin-bottom:.5rem;color:var(--ink);}
.card-subtitle{color:var(--ink2);font-size:.9375rem;margin-bottom:1.25rem;}
`;

const form = `
.form-group{margin-bottom:1.25rem;}
.form-label{display:block;font-size:.7rem;font-weight:700;color:var(--ink3);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.1em;}
.form-input{width:100%;padding:.875rem 1rem;background:var(--glass-lt);border:1px solid var(--border);border-radius:1rem;color:var(--ink);font-family:var(--font);font-size:.9375rem;transition:border-color var(--t),box-shadow var(--t),background var(--t);outline:none;}
.form-input::placeholder{color:var(--ink3);}
.form-input:focus{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.06);box-shadow:0 0 0 3px rgba(99,102,241,.12);}
.form-hint{font-size:.75rem;color:var(--ink3);margin-top:.375rem;}
.pin-group{display:flex;gap:.75rem;justify-content:center;margin:.5rem 0 1rem;}
.pin-digit{width:58px;height:68px;background:var(--glass-lt);border:2px solid var(--border);border-radius:1rem;color:var(--ink);font-family:var(--font);font-size:1.75rem;font-weight:800;text-align:center;outline:none;transition:all var(--t);caret-color:var(--indigo);}
.pin-digit:focus{border-color:var(--indigo);box-shadow:0 0 0 3px rgba(99,102,241,.18),0 0 20px rgba(99,102,241,.25);transform:translateY(-2px) scale(1.04);background:rgba(99,102,241,.08);}
.pin-digit.filled{border-color:rgba(99,102,241,.4);background:rgba(99,102,241,.06);}
.pin-hint{font-size:.8rem;color:var(--ink3);text-align:center;margin-bottom:1rem;}
`;

const btns = `
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem 1.5rem;border-radius:100px;font-family:var(--font);font-size:.9375rem;font-weight:700;border:none;cursor:pointer;transition:all var(--t);text-decoration:none;letter-spacing:-.01em;position:relative;overflow:hidden;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn-primary{background:var(--grad);color:#fff;box-shadow:0 4px 20px rgba(99,102,241,.35),inset 0 1px 0 rgba(255,255,255,.1);}
.btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.015);box-shadow:0 8px 36px rgba(99,102,241,.5),inset 0 1px 0 rgba(255,255,255,.1);}
.btn-primary:active:not(:disabled){transform:scale(.98);}
.btn-secondary{background:var(--glass-lt);color:var(--ink);border:1px solid var(--border);}
.btn-secondary:hover:not(:disabled){background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12);transform:translateY(-1px);}
.btn-success{background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;box-shadow:0 4px 20px rgba(34,197,94,.3);}
.btn-success:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 30px rgba(34,197,94,.45);}
.btn-full{width:100%;}.btn-lg{padding:1.05rem 2rem;font-size:1rem;}
.spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg);}}
`;

const status = `
.status-box{padding:1rem 1.25rem;border-radius:1rem;font-size:.875rem;margin:1rem 0;line-height:1.5;}
.status-success{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:#4ade80;}
.status-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;}
.status-info{background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);color:#a5b4fc;}
.status-warning{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);color:#fbbf24;}
.amount-display{text-align:center;padding:1.5rem 0 2rem;}
.amount-value{font-size:3.5rem;font-weight:900;letter-spacing:-.05em;background:linear-gradient(135deg,#6366f1,#2dd4bf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1;}
.amount-unit{font-size:1.25rem;font-weight:600;color:var(--ink2);margin-left:.3rem;}
.amount-label{font-size:.75rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.12em;margin-top:.625rem;}
`;

const misc = `
.wallet-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.45rem .875rem;background:var(--glass-lt);border:1px solid var(--border);border-radius:100px;font-size:.8rem;color:var(--ink2);font-family:var(--mono);}
.wallet-dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 8px rgba(34,197,94,.5);animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.divider{display:flex;align-items:center;gap:1rem;margin:1.5rem 0;color:var(--ink3);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
.btn-group{display:flex;flex-direction:column;gap:.75rem;margin-top:1.5rem;}
.copy-feedback{font-size:.75rem;color:var(--green);text-align:center;margin-top:.5rem;opacity:0;transition:opacity var(--t);}
.copy-feedback.visible{opacity:1;}
.success-icon{width:84px;height:84px;border-radius:50%;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:2.5rem;animation:scaleIn .5s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 30px rgba(34,197,94,.2);}
@keyframes scaleIn{0%{transform:scale(0);opacity:0;}100%{transform:scale(1);opacity:1;}}
.detail-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--border);font-size:.875rem;}
.detail-row:last-child{border-bottom:none;}
.detail-label{color:var(--ink3);}
.detail-value{font-weight:500;color:var(--ink);font-family:var(--mono);font-size:.8rem;}
.preview-box{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:1rem;padding:1.25rem;margin-bottom:1.5rem;}
.preview-title{font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem;font-weight:600;}
.preview-amount{font-size:1.5rem;font-weight:800;color:var(--indigo);margin-bottom:.25rem;letter-spacing:-.03em;}
.preview-to{font-size:.9375rem;color:var(--ink);margin-bottom:.375rem;}
.preview-note{font-size:.8rem;color:var(--ink3);}
.fade-in{animation:fadeIn .5s ease-out;}
@keyframes fadeIn{0%{opacity:0;transform:translateY(14px);}100%{opacity:1;transform:translateY(0);}}
.claim-link-box{background:var(--glass-lt);border:1px solid var(--border);border-radius:1rem;padding:1rem;word-break:break-all;font-family:var(--mono);font-size:.8rem;color:var(--indigo);cursor:pointer;transition:background var(--t);margin-top:1rem;}
.claim-link-box:hover{background:rgba(99,102,241,.08);}
`;

const landing = `
.landing-page{background:var(--bg);color:var(--ink);min-height:100vh;font-family:var(--font);overflow-x:hidden;display:flex;flex-direction:column;}
.landing-nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 5rem;max-width:1400px;width:100%;margin:0 auto;}
.landing-logo{font-size:1.3rem;font-weight:900;color:var(--ink);text-decoration:none;display:flex;align-items:center;gap:.6rem;letter-spacing:-.05em;}
.landing-signup{background:var(--grad);color:#fff;padding:.65rem 1.5rem;border-radius:100px;font-weight:700;text-decoration:none;font-size:.875rem;box-shadow:0 4px 14px rgba(99,102,241,.35);transition:all var(--t);}
.landing-signup:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,.5);color:#fff;opacity:1;}
.hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);border-radius:100px;padding:.35rem 1rem;font-size:.75rem;color:#a5b4fc;font-weight:600;letter-spacing:.03em;margin-bottom:2rem;}
.hero-h1{font-size:5.5rem;font-weight:900;line-height:.95;letter-spacing:-.05em;color:var(--ink);margin-bottom:1.75rem;}
.hero-h1 em{font-style:normal;background:linear-gradient(135deg,#6366f1,#2dd4bf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-sub{font-size:1.1rem;color:var(--ink2);line-height:1.7;max-width:42ch;margin-bottom:2.5rem;}
.hero-cta-primary{background:var(--grad);color:#fff;padding:.9rem 2rem;border-radius:100px;font-weight:700;font-size:.95rem;text-decoration:none;transition:all var(--t);box-shadow:0 4px 20px rgba(99,102,241,.4);}
.hero-cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,102,241,.55);color:#fff;opacity:1;}
.hero-cta-ghost{color:var(--ink2);font-size:.9rem;font-weight:500;text-decoration:underline;text-underline-offset:4px;}
.process-section{background:rgba(13,16,32,.5);border-top:1px solid var(--border);border-bottom:1px solid var(--border);backdrop-filter:blur(8px);}
.process-inner{max-width:1400px;margin:0 auto;padding:4rem 5rem;display:flex;gap:0;}
.process-sidebar{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);padding-right:2.5rem;flex-shrink:0;}
.process-steps{display:flex;flex:1;gap:0;}
.process-step{flex:1;padding:2rem 2.5rem;border-left:1px solid var(--border);}
.process-num{font-size:.75rem;font-weight:700;color:var(--teal);letter-spacing:.08em;margin-bottom:1rem;font-family:var(--mono);}
.process-label{font-size:1.1rem;font-weight:800;letter-spacing:-.03em;color:var(--ink);margin-bottom:.5rem;}
.process-desc{font-size:.85rem;color:var(--ink2);line-height:1.6;}
.features-section{max-width:1400px;margin:0 auto;padding:6rem 5rem;}
.features-h2{font-size:3rem;font-weight:900;letter-spacing:-.04em;color:var(--ink);max-width:16ch;}
.bento-grid{display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:auto auto;gap:1.25rem;}
.bento-tile{border-radius:var(--r-lg);padding:2.5rem;overflow:hidden;position:relative;transition:transform var(--t),box-shadow var(--t);}
.bento-tile:hover{transform:translateY(-3px);box-shadow:0 20px 60px rgba(0,0,0,.3);}
.bento-dark-tile{background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.15);grid-row:1/3;backdrop-filter:blur(16px);}
.bento-light-tile{background:var(--glass);border:1px solid var(--border);backdrop-filter:blur(16px);}
.bento-tile-label{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:1rem;}
.bento-tile-h3{font-size:1.5rem;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-bottom:.75rem;color:var(--ink);}
.bento-tile-desc{font-size:.875rem;line-height:1.6;color:var(--ink2);}
.statement-section{background:var(--bg1);border-top:1px solid var(--border);padding:8rem 5rem;text-align:center;position:relative;overflow:hidden;}
.statement-oversize{font-size:clamp(6rem,14vw,14rem);font-weight:900;letter-spacing:-.06em;color:rgba(255,255,255,.04);line-height:1;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;white-space:nowrap;}
.statement-inner{position:relative;z-index:1;max-width:700px;margin:0 auto;}
.statement-h2{font-size:3rem;font-weight:900;letter-spacing:-.04em;margin-bottom:2rem;line-height:1.1;color:var(--ink);}
.statement-list{list-style:none;display:flex;flex-direction:column;gap:0;}
.statement-list li{padding:1.1rem 0;border-top:1px solid var(--border);display:flex;align-items:center;gap:1rem;font-size:1.05rem;color:var(--ink2);}
.statement-arrow{color:var(--teal);font-weight:700;}
.statement-cta{margin-top:3rem;display:inline-block;border:1px solid var(--border);color:var(--ink);padding:.875rem 2rem;border-radius:100px;font-weight:600;font-size:.95rem;transition:all var(--t);text-decoration:none;}
.statement-cta:hover{background:var(--glass-lt);color:var(--ink);opacity:1;}
.testimonial-section{max-width:1400px;margin:0 auto;padding:6rem 5rem;}
.testimonial-quote{font-size:2.25rem;font-weight:800;letter-spacing:-.04em;line-height:1.2;color:var(--ink);margin-bottom:2rem;}
.testimonial-avatar{width:48px;height:48px;border-radius:50%;background:var(--indigo-lt);border:2px solid rgba(99,102,241,.2);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--indigo);font-size:1rem;}
.testimonial-name{font-weight:700;font-size:.95rem;color:var(--ink);}
.testimonial-role{font-size:.8rem;color:var(--ink3);}
.cta-section{background:var(--bg1);border-top:1px solid var(--border);}
.cta-inner{max-width:1400px;margin:0 auto;padding:8rem 5rem;display:flex;flex-direction:column;align-items:center;text-align:center;}
.cta-label{font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin-bottom:1.5rem;}
.cta-h2{font-size:4.5rem;font-weight:900;letter-spacing:-.05em;color:var(--ink);line-height:1;margin-bottom:1.5rem;}
.cta-sub{font-size:1.05rem;color:var(--ink2);max-width:44ch;margin-bottom:3rem;line-height:1.7;}
.cta-primary{background:var(--grad);color:#fff;padding:1rem 2.5rem;border-radius:100px;font-weight:700;font-size:1rem;text-decoration:none;transition:all var(--t);box-shadow:0 4px 20px rgba(99,102,241,.4);}
.cta-primary:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(99,102,241,.55);color:#fff;opacity:1;}
.site-footer{text-align:center;padding:2rem 5rem;border-top:1px solid var(--border);font-size:.8rem;color:var(--ink3);}
`;

const resp = `
@media(max-width:900px){
  .hero-h1{font-size:3.5rem;}
  .landing-nav,.process-inner,.features-section,.testimonial-section,.cta-inner,.statement-section,.site-footer{padding-left:1.5rem;padding-right:1.5rem;}
  .process-steps{flex-direction:column;}
  .process-step{border-left:none;border-top:1px solid var(--border);padding:1.5rem 0;}
  .process-sidebar{writing-mode:horizontal-tb;transform:none;padding:0 0 1.5rem;}
  .bento-grid{grid-template-columns:1fr;}
  .bento-dark-tile{grid-row:auto;}
  .cta-h2{font-size:2.75rem;}
  .testimonial-quote{font-size:1.75rem;}
  .statement-h2{font-size:2rem;}
  .header{top:0;left:0;transform:none;width:100%;border-radius:0;}
}
`;

fs.writeFileSync('src/app/globals.css',
  imp+vars+base+layout+card+form+btns+status+misc+landing+resp
);
console.log('CSS written OK');
