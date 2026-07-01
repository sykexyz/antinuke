import React, { useEffect, useRef } from 'react';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; alpha: number }[] = [];
    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      particles.push({ x: mouseX, y: mouseY, alpha: 1 });
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, 4, 4); // Pixel trail
        p.alpha -= 0.05;
      }
      
      while (particles.length > 0 && particles[0].alpha <= 0) {
        particles.shift();
      }
      
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
}
