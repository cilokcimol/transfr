'use client';
import { useEffect, useRef } from 'react';

export default function AnimatedBg({ style = {} }) {
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
      if (depth <= 0 || alpha < 0.02) return;
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * (Math.hypot(x2-x1,y2-y1) * 0.5);
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * (Math.hypot(x2-x1,y2-y1) * 0.5);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(mx, my);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = depth * 0.8;
      ctx.shadowBlur = 18;
      ctx.shadowColor = color;
      ctx.stroke();

      if (Math.random() > 0.4) {
        const bx = mx + (Math.random() - 0.5) * 180;
        const by = my + Math.random() * 120;
        lightning(mx, my, bx, by, depth - 1, alpha * 0.55, color);
      }
      lightning(x1, y1, mx, my, depth - 1, alpha * 0.75, color);
      lightning(mx, my, x2, y2, depth - 1, alpha * 0.75, color);
    }

    function drawEth(cx, cy, size, angle, glowAlpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const pts = [
        [0, -size],
        [size * 0.58, 0],
        [0, size * 0.38],
        [-size * 0.58, 0],
        [0, -size],
        [0, size * 0.38],
        [size * 0.58, 0],
        [0, size],
        [-size * 0.58, 0],
        [0, size],
      ];

      const grad = ctx.createRadialGradient(0, 0, size * 0.1, 0, 0, size * 2);
      grad.addColorStop(0, `rgba(99,102,241,${glowAlpha * 0.6})`);
      grad.addColorStop(0.4, `rgba(45,212,191,${glowAlpha * 0.2})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.58, 0);
      ctx.lineTo(0, size * 0.38);
      ctx.lineTo(-size * 0.58, 0);
      ctx.closePath();
      const ug = ctx.createLinearGradient(0, -size, 0, size * 0.4);
      ug.addColorStop(0, 'rgba(139,92,246,0.95)');
      ug.addColorStop(1, 'rgba(99,102,241,0.6)');
      ctx.fillStyle = ug;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, size * 0.38);
      ctx.lineTo(size * 0.58, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.58, 0);
      ctx.closePath();
      const lg = ctx.createLinearGradient(0, 0, 0, size);
      lg.addColorStop(0, 'rgba(45,212,191,0.7)');
      lg.addColorStop(1, 'rgba(6,8,15,0.9)');
      ctx.fillStyle = lg;
      ctx.fill();

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#818cf8';
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        i === 0 ? ctx.moveTo(pts[i][0], pts[i][1]) : ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.stroke();

      ctx.restore();
    }

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.3,
      a: Math.random() * 0.7 + 0.1,
      color: Math.random() > 0.5 ? '#6366f1' : '#2dd4bf',
    }));

    function drawParticles() {
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(t * 0.03 + p.x));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    let bolts = [];
    let boltTimer = 0;

    function spawnBolt() {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.42;
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 60;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist * 0.5;
      const ex = cx + Math.cos(angle) * (canvas.width * 0.6);
      const ey = sy + (Math.random() - 0.5) * canvas.height * 0.8;
      const colors = ['rgba(99,102,241,ALPHA)', 'rgba(139,92,246,ALPHA)', 'rgba(45,212,191,ALPHA)', 'rgba(165,180,252,ALPHA)'];
      const col = colors[Math.floor(Math.random() * colors.length)];
      bolts.push({ sx, sy, ex, ey, depth: 4 + Math.floor(Math.random() * 3), alpha: 0.7 + Math.random() * 0.3, life: 6 + Math.floor(Math.random() * 8), color: col });
    }

    function draw() {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      const bg = ctx.createRadialGradient(canvas.width/2, canvas.height*0.4, 0, canvas.width/2, canvas.height/2, canvas.width*0.9);
      bg.addColorStop(0, 'rgba(45,20,90,1)');
      bg.addColorStop(0.35, 'rgba(28,12,65,1)');
      bg.addColorStop(0.7, 'rgba(15,7,40,1)');
      bg.addColorStop(1, 'rgba(6,4,20,1)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const ag = ctx.createRadialGradient(canvas.width/2, canvas.height*0.4, 0, canvas.width/2, canvas.height*0.4, canvas.width*0.6);
      ag.addColorStop(0, `rgba(120,60,220,${0.18 + 0.08 * Math.sin(t * 0.025)})`);
      ag.addColorStop(0.4, `rgba(99,102,241,${0.12 + 0.06 * Math.sin(t * 0.02)})`);
      ag.addColorStop(0.7, `rgba(45,212,191,${0.04 + 0.02 * Math.sin(t * 0.018)})`);
      ag.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      boltTimer++;
      if (boltTimer % 8 === 0) spawnBolt();
      if (bolts.length > 18) bolts = bolts.slice(-18);

      ctx.globalAlpha = 1;
      bolts.forEach((b, idx) => {
        const col = b.color.replace('ALPHA', b.alpha.toFixed(2));
        lightning(b.sx, b.sy, b.ex, b.ey, b.depth, b.alpha, col);
        b.alpha *= 0.82;
        b.life--;
      });
      bolts = bolts.filter(b => b.life > 0 && b.alpha > 0.02);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      const ethSize = Math.min(canvas.width, canvas.height) * 0.22;
      const glowPulse = 0.6 + 0.4 * Math.sin(t * 0.03);
      drawEth(canvas.width / 2, canvas.height * 0.42, ethSize, t * 0.004, glowPulse);

      drawParticles();

      ctx.globalAlpha = 1;
      const fade = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      fade.addColorStop(0, 'rgba(6,4,20,0)');
      fade.addColorStop(1, 'rgba(6,4,20,1)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const lfade = ctx.createLinearGradient(0, 0, canvas.width * 0.5, 0);
      lfade.addColorStop(0, 'rgba(6,4,20,0.75)');
      lfade.addColorStop(1, 'rgba(6,4,20,0)');
      ctx.fillStyle = lfade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'block',
        ...style,
      }}
    />
  );
}
