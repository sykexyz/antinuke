import React, { useEffect, useRef } from 'react';

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Matrix rain
    const chars = '01'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    let frame = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 15, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'; // Very subtle
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frame++;
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#050f05]" />
      
      {/* Matrix rain canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />
      
      {/* Pixel grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.2) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline opacity-20" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050f05_100%)]" />
    </div>
  );
}
