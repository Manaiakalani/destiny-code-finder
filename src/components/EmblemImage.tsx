import { cn } from '@/lib/utils';

interface EmblemImageProps {
  code: string;
  emblemName?: string;
  className?: string;
  fallbackClassName?: string;
}

// Generate a unique gradient color based on the emblem name
function generateEmblemGradient(name: string): { from: string; to: string; accent: string } {
  const themes = [
    { from: '#7c3aed', to: '#4c1d95', accent: '#a78bfa' }, // Void Purple
    { from: '#06b6d4', to: '#0284c7', accent: '#67e8f9' }, // Arc Blue
    { from: '#f97316', to: '#dc2626', accent: '#fdba74' }, // Solar Orange
    { from: '#3b82f6', to: '#06b6d4', accent: '#93c5fd' }, // Stasis Blue
    { from: '#22c55e', to: '#059669', accent: '#86efac' }, // Strand Green
    { from: '#ec4899', to: '#9333ea', accent: '#f9a8d4' }, // Prismatic Pink
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return themes[Math.abs(hash) % themes.length];
}

// Generate initials from emblem name
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate a decorative pattern based on the code
function getPattern(code: string): string {
  const patterns = ['◇', '⬡', '◈', '✦', '⬢', '◆'];
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return patterns[Math.abs(hash) % patterns.length];
}

export function EmblemImage({ code, emblemName, className, fallbackClassName }: EmblemImageProps) {
  const displayName = emblemName || code;
  const gradient = generateEmblemGradient(displayName);
  const initials = getInitials(displayName);
  const pattern = getPattern(code);

  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center relative overflow-hidden",
        className,
        fallbackClassName
      )}
      style={{
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
      }}
    >
      {/* Decorative background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }}
      />
      
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${gradient.accent} 0%, transparent 50%)`
        }}
      />
      
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <span className="text-white/40 text-xs mb-0.5">{pattern}</span>
        <span className="text-white font-bold text-sm tracking-wide drop-shadow-lg">
          {initials}
        </span>
      </div>
      
      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: gradient.accent }}
      />
    </div>
  );
}

export default EmblemImage;
