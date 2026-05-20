'use client';
import { useEffect, useRef } from 'react';

export default function FluidInteractiveBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Dynamic fluid blobs
    const blobs = [
      { x: width * 0.2, y: height * 0.2, vx: 0.6, vy: 0.4, r: Math.min(width, height) * 0.35, color: 'rgba(99, 102, 241, 0.42)' }, // Indigo
      { x: width * 0.8, y: height * 0.3, vx: -0.5, vy: 0.6, r: Math.min(width, height) * 0.4, color: 'rgba(45, 212, 191, 0.35)' }, // Teal
      { x: width * 0.5, y: height * 0.7, vx: 0.4, vy: -0.5, r: Math.min(width, height) * 0.45, color: 'rgba(124, 58, 237, 0.38)' }, // Purple
      { x: width * 0.3, y: height * 0.8, vx: -0.3, vy: -0.4, r: Math.min(width, height) * 0.38, color: 'rgba(0, 71, 255, 0.32)' }   // Electric Blue
    ];

    let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    function handleMouseMove(e) {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    }
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    function draw() {
      time += 0.002;
      ctx.fillStyle = '#f8faff'; // Crisp, clean light base background
      ctx.fillRect(0, 0, width, height);

      // Smoothly interpolate mouse coordinates
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      // Draw subtle background pattern / grid overlay
      ctx.strokeStyle = 'rgba(0, 71, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.save();
      // Enable soft blending
      ctx.globalCompositeOperation = 'multiply';

      // Update and draw each organic fluid blob
      blobs.forEach((b, idx) => {
        // Organic sinusoidal motion additions
        const ox = Math.sin(time * 2 + idx) * 90;
        const oy = Math.cos(time * 1.5 + idx) * 90;

        b.x += b.vx;
        b.y += b.vy;

        // Bounce walls
        if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
        if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;

        // Attract lightly to mouse coordinates
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        b.x += dx * 0.005;
        b.y += dy * 0.005;

        // Create radial gradient for smooth fluid glow
        const grad = ctx.createRadialGradient(
          b.x + ox, b.y + oy, 0,
          b.x + ox, b.y + oy, b.r
        );
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.5, b.color.replace('0.42', '0.15').replace('0.35', '0.12').replace('0.38', '0.12').replace('0.32', '0.1'));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x + ox, b.y + oy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
}
