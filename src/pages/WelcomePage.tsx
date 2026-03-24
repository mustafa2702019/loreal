import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface WelcomePageProps {
  onComplete: () => void;
}

export default function WelcomePage({ onComplete }: WelcomePageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            initial={{ 
              x: Math.random() * 430, 
              y: Math.random() * 932,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Logo Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-6"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(212, 175, 55, 0.2)',
              '0 0 40px rgba(212, 175, 55, 0.4)',
              '0 0 20px rgba(212, 175, 55, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full border-2 border-amber-400/50 flex items-center justify-center"
        >
          <span className="text-4xl font-serif gold-text">L</span>
        </motion.div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl font-serif text-white mb-2"
      >
        Laya'
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-amber-400/80 text-sm tracking-widest uppercase mb-8"
      >
        Parisian Luxury Fragrance System
      </motion.p>

      {/* Real Bottle Image */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
        className="relative"
      >
        {/* Bottle glow effect */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
        />
        
        {/* Bottle image with animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-48 h-72"
        >
          <img 
            src="/bottle.png" 
            alt="Laya Fragrance Bottle" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Tap to continue hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-20 text-slate-400 text-sm"
      >
        Tap anywhere to continue
      </motion.p>

      {/* Click handler */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onComplete}
      />
    </div>
  );
}
