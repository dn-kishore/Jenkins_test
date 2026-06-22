import { useEffect, useRef } from 'react';

export const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
      const width = window.innerWidth;
      const height = Math.min(window.innerHeight, 1000); // Limit height
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 150);
    };
    window.addEventListener('resize', handleResize);

    // Metaball/Liquid blob class with organic movement
    class MetaBall {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      color: { r: number; g: number; b: number };
      phase: number;
      pulseSpeed: number;

      constructor(x: number, y: number, radius: number, color: { r: number; g: number; b: number }) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.001 + Math.random() * 0.001;
      }

      update(time: number, width: number, height: number) {
        // Organic floating movement
        const drift = 60;
        this.x = this.baseX + Math.sin(time * 0.0003 + this.phase) * drift;
        this.y = this.baseY + Math.cos(time * 0.0002 + this.phase) * drift;

        // Pulsing effect
        const pulse = Math.sin(time * this.pulseSpeed) * 0.1;
        this.radius = this.radius * (1 + pulse);
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.35)`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.15)`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const width = window.innerWidth;
    const height = Math.min(window.innerHeight, 1000);

    // Create fewer metaballs for better performance
    const metaballs: MetaBall[] = [
      new MetaBall(width * 0.2, height * 0.3, 250, { r: 66, g: 133, b: 244 }), // Google Blue
      new MetaBall(width * 0.8, height * 0.4, 280, { r: 52, g: 168, b: 83 }), // Google Green
      new MetaBall(width * 0.5, height * 0.7, 220, { r: 251, g: 188, b: 5 }), // Google Yellow
    ];

    let startTime = Date.now();
    let animationFrameId: number;
    let lastFrameTime = startTime;
    const targetFPS = 30; // Reduce FPS for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);
        const time = currentTime - startTime;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Apply blur for liquid effect
        ctx.filter = 'blur(40px)';
        ctx.globalCompositeOperation = 'lighter';

        // Update and draw metaballs
        metaballs.forEach((ball) => {
          ball.update(time, width, height);
          ball.draw(ctx);
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
