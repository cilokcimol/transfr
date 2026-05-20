'use client';
import { useEffect, useRef } from 'react';

export default function PageAnimatedBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function lightning(x1, y1, x2, y2, depth, alpha, color) {
      if (depth <= 0 || alpha < 0.015) return;
      const d = Math.hypot(x2-x1, y2-y1);
      const mx = (x1+x2)/2 + (Math.random()-.5)*d*0.45;
      const my = (y1+y2)/2 + (Math.random()-.5)*d*0.45;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my); ctx.lineTo(x2,y2);
      ctx.strokeStyle = color; ctx.globalAlpha = alpha;
      ctx.lineWidth = depth*0.6; ctx.shadowBlur = 14; ctx.shadowColor = color;
      ctx.stroke();
      if (Math.random()>.5) {
        const bx = mx+(Math.random()-.5)*120, by = my+Math.random()*80;
        lightning(mx,my,bx,by,depth-1,alpha*.5,color);
      }
      lightning(x1,y1,mx,my,depth-1,alpha*.72,color);
      lightning(mx,my,x2,y2,depth-1,alpha*.72,color);
    }

    function drawEth(cx, cy, size, angle) {
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
      const pulse = 0.7 + 0.3*Math.sin(t*0.025);

      // glow
      const g = ctx.createRadialGradient(0,0,size*.1,0,0,size*2.2);
      g.addColorStop(0,`rgba(99,102,241,${pulse*0.5})`);
      g.addColorStop(.5,`rgba(45,212,191,${pulse*0.15})`);
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalAlpha=1; ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(0,0,size*2.2,0,Math.PI*2); ctx.fill();

      // upper
      ctx.globalAlpha=0.82; ctx.shadowBlur=35; ctx.shadowColor='#6366f1';
      ctx.beginPath(); ctx.moveTo(0,-size); ctx.lineTo(size*.58,0); ctx.lineTo(0,size*.38); ctx.lineTo(-size*.58,0); ctx.closePath();
      const ug=ctx.createLinearGradient(0,-size,0,size*.4);
      ug.addColorStop(0,'rgba(139,92,246,0.95)'); ug.addColorStop(1,'rgba(99,102,241,0.55)');
      ctx.fillStyle=ug; ctx.fill();

      // lower
      ctx.beginPath(); ctx.moveTo(0,size*.38); ctx.lineTo(size*.58,0); ctx.lineTo(0,size); ctx.lineTo(-size*.58,0); ctx.closePath();
      const lg=ctx.createLinearGradient(0,0,0,size);
      lg.addColorStop(0,'rgba(45,212,191,0.65)'); lg.addColorStop(1,'rgba(6,8,15,0.85)');
      ctx.fillStyle=lg; ctx.fill();

      // edges
      ctx.strokeStyle='#a5b4fc'; ctx.lineWidth=1.5; ctx.shadowBlur=18; ctx.shadowColor='#818cf8';
      const pts=[[0,-size],[size*.58,0],[0,size*.38],[-size*.58,0],[0,-size],[0,size*.38],[size*.58,0],[0,size],[-size*.58,0],[0,size]];
      ctx.beginPath();
      pts.forEach((p,i)=>i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]));
      ctx.stroke();

      ctx.restore();
    }

    const particles = Array.from({length:80},()=>({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.5+.3, a:Math.random()*.6+.1,
      color:Math.random()>.5?'#6366f1':'#2dd4bf',
    }));

    let bolts=[],boltTimer=0;
    function spawnBolt(){
      const cx=canvas.width*.75, cy=canvas.height*.5;
      const angle=Math.random()*Math.PI*2;
      const sx=cx+Math.cos(angle)*60, sy=cy+Math.sin(angle)*60;
      const ex=cx+Math.cos(angle)*canvas.width*.45;
      const ey=sy+(Math.random()-.5)*canvas.height*.6;
      const cols=['rgba(99,102,241,A)','rgba(139,92,246,A)','rgba(45,212,191,A)'];
      bolts.push({sx,sy,ex,ey,depth:3+Math.floor(Math.random()*2),alpha:.6+Math.random()*.3,life:5+Math.floor(Math.random()*6),color:cols[Math.floor(Math.random()*cols.length)]});
    }

    function draw(){
      t++;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // bg
      const bg=ctx.createRadialGradient(canvas.width*.75,canvas.height*.5,0,canvas.width*.75,canvas.height*.5,canvas.width*.7);
      bg.addColorStop(0,'rgba(18,14,45,1)'); bg.addColorStop(.5,'rgba(8,10,28,1)'); bg.addColorStop(1,'rgba(4,5,15,1)');
      ctx.globalAlpha=1; ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

      // ambient
      const ag=ctx.createRadialGradient(canvas.width*.75,canvas.height*.5,0,canvas.width*.75,canvas.height*.5,canvas.width*.5);
      ag.addColorStop(0,`rgba(99,102,241,${.1+.05*Math.sin(t*.02)})`);
      ag.addColorStop(.6,`rgba(45,212,191,${.03+.02*Math.sin(t*.015)})`);
      ag.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ag; ctx.fillRect(0,0,canvas.width,canvas.height);

      boltTimer++;
      if(boltTimer%10===0) spawnBolt();
      if(bolts.length>12) bolts=bolts.slice(-12);

      bolts.forEach(b=>{
        const col=b.color.replace('A',b.alpha.toFixed(2));
        lightning(b.sx,b.sy,b.ex,b.ey,b.depth,b.alpha,col);
        b.alpha*=.8; b.life--;
      });
      bolts=bolts.filter(b=>b.life>0&&b.alpha>.015);

      // ETH
      ctx.globalAlpha=1; ctx.shadowBlur=0;
      const sz=Math.min(canvas.width,canvas.height)*.28;
      drawEth(canvas.width*.75, canvas.height*.5, sz, t*.005);

      // particles
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
        ctx.globalAlpha=p.a*(.5+.5*Math.sin(t*.03+p.x));
        ctx.fillStyle=p.color; ctx.shadowBlur=6; ctx.shadowColor=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });

      // left overlay for form readability
      ctx.globalAlpha=1;
      const lf=ctx.createLinearGradient(0,0,canvas.width*.6,0);
      lf.addColorStop(0,'rgba(4,5,15,.85)'); lf.addColorStop(1,'rgba(4,5,15,0)');
      ctx.fillStyle=lf; ctx.fillRect(0,0,canvas.width,canvas.height);

      animId=requestAnimationFrame(draw);
    }
    draw();
    return()=>{ cancelAnimationFrame(animId); window.removeEventListener('resize',resize); };
  },[]);

  return(
    <canvas ref={canvasRef} style={{position:'fixed',inset:0,width:'100%',height:'100%',zIndex:-3,display:'block'}}/>
  );
}
