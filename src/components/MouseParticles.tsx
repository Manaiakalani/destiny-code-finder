import { useEffect, useRef } from 'react';

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

const COLORS = [
  'rgba(124, 58, 237, 0.6)',   // Void purple
  'rgba(6, 182, 212, 0.6)',     // Arc cyan
  'rgba(249, 115, 22, 0.6)',    // Solar orange
  'rgba(34, 197, 94, 0.6)',     // Strand green
  'rgba(59, 130, 246, 0.6)',    // Stasis blue
];

export function MouseParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const lastMoveTime = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, moving: true };
      lastMoveTime.current = Date.now();

      // Create particles on move
      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          size: 2 + Math.random() * 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    };

    // Check if mouse stopped moving
    const checkMouseMovement = () => {
      if (Date.now() - lastMoveTime.current > 100) {
        mouseRef.current.moving = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      checkMouseMovement();

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05; // Gravity
        particle.life++;

        const alpha = 1 - (particle.life / particle.maxLife);
        
        if (alpha > 0) {
          // Draw particle with glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fillStyle = particle.color.replace('0.6', String(alpha * 0.6));
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw inner glow
          ctx.shadowBlur = 5;
          ctx.fillStyle = particle.color.replace('0.6', String(alpha * 0.9));
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });

      // Draw trail behind mouse
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
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

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
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
