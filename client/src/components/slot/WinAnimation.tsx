import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinAnimationProps {
  show: boolean;
  amount: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ show, amount }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.div
              className="text-6xl font-bold text-yellow-400 drop-shadow-glow"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
                color: [
                  '#FFD700',
                  '#FFA500',
                  '#FF8C00',
                  '#FFD700'
                ]
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
                ease: "easeInOut"
              }}
            >
              WIN!
            </motion.div>
            <motion.div
              className="text-4xl font-bold text-white mt-2"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
                ease: "easeInOut"
              }}
            >
              ${amount.toFixed(2)}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinAnimation;
