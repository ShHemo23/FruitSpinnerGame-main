import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WinAnimationProps {
  show: boolean;
  amount: number;
}

export const WinAnimation: React.FC<WinAnimationProps> = ({ show, amount }) => {
  React.useEffect(() => {
    if (show) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 },
          colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
        });
      }, 50);

      return () => clearInterval(confettiInterval);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="w-full mb-6 p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-lg text-white shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.div
            className="text-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
            }}
          >
            <div className="text-3xl font-bold mb-1">
              🎉 WIN! 🎉
            </div>
            <div className="text-2xl font-bold">
              ${amount.toFixed(2)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};