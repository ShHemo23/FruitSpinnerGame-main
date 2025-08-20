import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  direction: 'top-bottom' | 'bottom-top';
}

const SlotReel: React.FC<SlotReelProps> = ({ symbol, isSpinning, direction }) => {
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const symbols = ["🍎", "🍊", "🍇", "🎰"];
  
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        setCurrentSymbol(randomSymbol);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setCurrentSymbol(symbol);
    }
  }, [isSpinning, symbol]);

  const animationVariants = {
    spinning: {
      y: direction === 'top-bottom' ? [0, 20] : [0, -20],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    stopped: {
      y: 0
    }
  };

  return (
    <div className="relative w-24 h-24 bg-gradient-to-b from-purple-600/50 to-blue-600/50 rounded-lg overflow-hidden shadow-xl backdrop-blur border border-white/20">
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="w-full h-full flex items-center justify-center text-4xl"
        animate={isSpinning ? "spinning" : "stopped"}
        variants={animationVariants}
      >
        {currentSymbol || '❓'}
      </motion.div>
    </div>
  );
};

export default SlotReel;
