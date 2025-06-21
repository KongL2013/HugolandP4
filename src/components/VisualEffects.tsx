import React, { useEffect, useState } from 'react';

interface FloatingTextProps {
  text: string;
  color: string;
  onComplete: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ text, color, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce`}
      style={{
        animation: 'floatUp 2s ease-out forwards'
      }}
    >
      <div className={`text-2xl font-bold ${color} drop-shadow-lg`}>
        {text}
      </div>
    </div>
  );
};

interface ParticleEffectProps {
  trigger: boolean;
  onComplete: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['text-yellow-400', 'text-purple-400', 'text-blue-400', 'text-green-400'][Math.floor(Math.random() * 4)]
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!trigger || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl ${particle.color} animate-ping`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: '1.5s'
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

interface ScreenShakeProps {
  trigger: boolean;
  onComplete: () => void;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ trigger, onComplete }) => {
  useEffect(() => {
    if (trigger) {
      document.body.style.animation = 'shake 0.5s ease-in-out';
      const timer = setTimeout(() => {
        document.body.style.animation = '';
        onComplete();
      }, 500);
      return () => {
        clearTimeout(timer);
        document.body.style.animation = '';
      };
    }
  }, [trigger, onComplete]);

  return null;
};

// Add CSS animations to the global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) translateY(0px) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) translateY(-100px) scale(1.2);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
`;
document.head.appendChild(style);