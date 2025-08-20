import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import SlotReel from '@/components/slot/SlotReel';
import WinAnimation from '@/components/slot/WinAnimation';
import confetti from 'canvas-confetti';

class SlotSymbol {
  constructor(public symbolName: string, public coefficient: number, public probability: number) {}
}

const symbols = [
  new SlotSymbol("🍎", 0.4, 0.45), // Apple
  new SlotSymbol("🍊", 0.6, 0.35), // Orange
  new SlotSymbol("🍇", 0.8, 0.15), // Grapes
  new SlotSymbol("🎰", 1.0, 0.05)  // Jackpot
];

const SlotMachine = () => {
  const [balance, setBalance] = useState(0);
  const [stake, setStake] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState(['', '', '']);
  const [winAmount, setWinAmount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const validateDeposit = (amount: number) => {
    if (amount <= 0) {
      setError('Please enter a positive number.');
      return false;
    }
    return true;
  };

  const validateStake = (amount: number) => {
    if (amount <= 0) {
      setError('Please enter a positive stake amount.');
      return false;
    }
    if (amount > balance) {
      setError('Stake amount cannot be greater than your balance.');
      return false;
    }
    return true;
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (validateDeposit(amount)) {
      setBalance(amount);
      setGameStarted(true);
      setError('');
    }
  };

  const spinReels = () => {
    const stakeNum = parseFloat(stake);
    if (!validateStake(stakeNum)) return;
    
    setIsSpinning(true);
    setBalance(prev => prev - stakeNum);
    setError('');
    setShowWinAnimation(false);
    setWinAmount(0);

    setTimeout(() => {
      const randomResults = Array(3).fill(0).map(() => {
        const rand = Math.random();
        let cumProb = 0;
        return symbols.find(s => {
          cumProb += s.probability;
          return rand <= cumProb;
        })!.symbolName;
      });
      
      setResults(randomResults);
      setIsSpinning(false);
      calculateWin(randomResults, stakeNum);
    }, 2000);
  };

  const calculateWin = (spinResults: string[], stakeAmount: number) => {
    const uniqueSymbols = new Set(spinResults);
    
    if (uniqueSymbols.size === 1) {
      const symbol = symbols.find(s => s.symbolName === spinResults[0])!;
      let win = spinResults[0] === "🎰" ? 1000 : stakeAmount * (1 + symbol.coefficient);
      
      setWinAmount(win);
      setBalance(prev => prev + win);
      setShowWinAnimation(true);
      triggerConfetti();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto relative overflow-hidden bg-white/10 backdrop-blur-lg border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Lucky Fruit Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!gameStarted ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-2 text-white">Enter deposit amount:</div>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="text-center bg-white/20 text-white placeholder:text-white/50"
                placeholder="Enter amount"
              />
              <Button 
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold"
                disabled={!depositAmount}
              >
                Start Game
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                {[0, 1, 2].map((idx) => (
                  <SlotReel 
                    key={idx} 
                    symbol={results[idx]} 
                    isSpinning={isSpinning}
                    direction={idx === 1 ? 'bottom-top' : 'top-bottom'}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/20 rounded-lg backdrop-blur">
                  <div className="text-sm text-white/70">Balance</div>
                  <div className="text-xl font-bold text-white">${balance.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-white/20 rounded-lg backdrop-blur">
                  <div className="text-sm text-white/70">Win</div>
                  <div className="text-xl font-bold text-white">${winAmount.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <div className="text-center mb-2 text-white">Enter stake amount:</div>
                <Input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="text-center bg-white/20 text-white placeholder:text-white/50"
                  disabled={isSpinning}
                  placeholder="Enter stake"
                />
              </div>

              <Button 
                onClick={spinReels}
                className="w-full h-16 text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold transform hover:scale-105 transition-transform"
                disabled={isSpinning || !stake || parseFloat(stake) <= 0 || parseFloat(stake) > balance}
              >
                {isSpinning ? (
                  <motion.div
                    className="flex items-center justify-center space-x-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <span>🎲</span>
                    <span>Spinning...</span>
                  </motion.div>
                ) : (
                  'SPIN'
                )}
              </Button>

              <WinAnimation show={showWinAnimation} amount={winAmount} />

              {balance <= 0 && (
                <Alert variant="destructive">
                  <AlertDescription>Game Over! You have run out of money.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotMachine;
