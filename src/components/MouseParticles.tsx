import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

// Void, Arc, then an occasional Solar. Alpha stays 0.6 so the draw loop can fade it.
const COLORS = [
  'rgba(176, 132, 255, 0.6)',
  'rgba(79, 185, 255, 0.6)',
  'rgba(176, 132, 255, 0.6)',
  'rgba(79, 185, 255, 0.6)',
  'rgba(255, 150, 0, 0.6)',
];

function particleAllowed() {
  if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData !== true;
}

export function MouseParticles() {
  const [allowed] = useState(particleAllowed);
  if (!allowed) return null;
  return <ParticleCanvas />;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastMoveTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cssWidth = 0;
    let cssHeight = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // The canvas width attribute is a presentational hint, so inset: 0 does not stretch it.
      cssWidth = document.documentElement.clientWidth;
      cssHeight = window.innerHeight;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.max(1, Math.round(cssWidth * dpr));
      canvas.height = Math.max(1, Math.round(cssHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pointerOnCanvas = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    let running = false;

    const animate = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      if (Date.now() - lastMoveTimeRef.current > 100) {
        mouseRef.current.moving = false;
      }

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05;
        particle.life++;

        const alpha = 1 - (particle.life / particle.maxLife);

        if (alpha > 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fillStyle = particle.color.replace('0.6', String(alpha * 0.6));
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 5;
          ctx.fillStyle = particle.color.replace('0.6', String(alpha * 0.9));
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();

          return true;
        }
        return false;
      });

      if (mouseRef.current.moving && particlesRef.current.length < 200) {
        const trailColor = COLORS[Math.floor(Date.now() / 200) % COLORS.length];
        ctx.shadowBlur = 20;
        ctx.shadowColor = trailColor;
        ctx.fillStyle = trailColor;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      if (mouseRef.current.moving || particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const point = pointerOnCanvas(e);
      mouseRef.current = { x: point.x, y: point.y, moving: true };
      lastMoveTimeRef.current = Date.now();

      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: point.x,
          y: point.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          size: 2 + Math.random() * 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
      kick();
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
