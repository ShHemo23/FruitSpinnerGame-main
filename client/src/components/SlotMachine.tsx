import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { WinAnimation } from './WinAnimation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

class SlotSymbol {
  constructor(
    public symbolName: string,
    public coefficient: number,
    public probability: number
  ) {}
}

const symbols = [
  new SlotSymbol("🍎", 0.4, 0.45), // Apple
  new SlotSymbol("🍊", 0.6, 0.35), // Orange
  new SlotSymbol("🍇", 0.8, 0.15), // Grapes
  new SlotSymbol("🎰", 2.0, 0.05)  // Jackpot
];

const MINIMUM_STAKE = 3;

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  direction: 'top-to-bottom' | 'bottom-to-top';
  index: number;
}

const SlotReel: React.FC<SlotReelProps> = ({ symbol, isSpinning, direction, index }) => {
  const [currentSymbol, setCurrentSymbol] = useState(symbol);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)].symbolName;
        setCurrentSymbol(randomSymbol);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setCurrentSymbol(symbol);
    }
  }, [isSpinning, symbol]);

  return (
    <div className="relative w-24 h-24 bg-gradient-to-b from-purple-600 to-blue-600 rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="w-full h-full flex items-center justify-center text-4xl"
        animate={{
          y: isSpinning ? (direction === 'top-to-bottom' ? [0, 20, 0] : [0, -20, 0]) : 0,
        }}
        transition={{
          duration: 0.2,
          repeat: isSpinning ? Infinity : 0,
          delay: index * 0.1,
        }}
      >
        {currentSymbol || '?'}
      </motion.div>
    </div>
  );
};

const SpinButton: React.FC<{ onClick: () => void; disabled: boolean; isSpinning: boolean }> = ({ onClick, disabled, isSpinning }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
    onClick={onClick}
    disabled={disabled}
  >
    {isSpinning ? (
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, 15, -15, 10, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-2xl">🎲</span>
        <span className="font-bold tracking-wider">SPINNING</span>
        <motion.span
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        >
          ...
        </motion.span>
      </motion.div>
    ) : (
      <motion.div
        animate={{ y: disabled ? 0 : [0, -2, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="flex items-center justify-center gap-2"
      >
        <span className="text-2xl">🎰</span>
        <span className="font-bold tracking-wider">SPIN</span>
      </motion.div>
    )}
  </motion.button>
);

export const SlotMachine: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [stake, setStake] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState(['', '', '']);
  const [winAmount, setWinAmount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  useEffect(() => {
    if (balance <= 0 && !showAddBalance) {
      setShowGameOverDialog(true);
    }
  }, [balance, showAddBalance]);

  const validateDeposit = (amount: number) => {
    if (amount <= 0) {
      setError('Please enter a positive number.');
      return false;
    }
    return true;
  };

  const validateStake = (amount: number) => {
    if (amount < MINIMUM_STAKE) {
      setError(`Minimum stake amount is $${MINIMUM_STAKE}.`);
      return false;
    }
    if (amount > balance) {
      setShowAddBalance(true);
      setError('');  // Clear any existing error since we're showing dialog
      return false;
    }
    return true;
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (validateDeposit(amount)) {
      setBalance(prevBalance => prevBalance + amount);
      setGameStarted(true);
      setError('');
      setShowAddBalance(false);
      setShowGameOverDialog(false);
      setDepositAmount('');
    }
  };

  const handleDepositKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && depositAmount) {
      handleDeposit();
    }
  };

  const handleStakeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isStakeValid) {
      spinReels();
    }
  };

  const spinReels = () => {
    const stakeNum = parseFloat(stake);
    if (!validateStake(stakeNum)) return;

    setIsSpinning(true);
    setBalance(prev => prev - stakeNum);
    setError('');
    setShowWinAnimation(false);
    setShowAddBalance(false);
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
    let win = 0;

    if (uniqueSymbols.size === 1) {
      // If all symbols are the same
      const symbol = symbols.find(s => s.symbolName === spinResults[0])!;
      if (spinResults[0] === "🎰") {
        // Jackpot win
        win = 1000;
      } else {
        // Regular win
        win = stakeAmount * (1 + symbol.coefficient);
      }
      setShowWinAnimation(true);
      // Update balance immediately after win
      setBalance(prev => prev + win);
    }

    setWinAmount(win);
  };

  const isStakeValid = stake && parseFloat(stake) >= MINIMUM_STAKE && parseFloat(stake) <= balance;

  return (
    <Card className="w-full max-w-lg mx-auto relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Lucky Fruits Slot Machine
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
            <div className="text-center mb-2">Enter deposit amount:</div>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              onKeyPress={handleDepositKeyPress}
              className="text-center"
            />
            <Button
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={!depositAmount}
            >
              Start Game
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <WinAnimation show={showWinAnimation} amount={winAmount} />

            <div className="flex justify-center space-x-4">
              {results.map((symbol, idx) => (
                <SlotReel
                  key={idx}
                  symbol={symbol}
                  isSpinning={isSpinning}
                  direction={idx % 2 === 0 ? 'top-to-bottom' : 'bottom-to-top'}
                  index={idx}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                <div className="text-sm opacity-90">Balance</div>
                <div className="text-xl font-bold">${balance.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white">
                <div className="text-sm opacity-90">Win</div>
                <div className="text-xl font-bold">${winAmount.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-white">
                <div className="text-sm opacity-90">Jackpot</div>
                <div className="text-xl font-bold">$1,000.00</div>
              </div>
            </div>

            <AlertDialog open={showAddBalance} onOpenChange={setShowAddBalance}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Insufficient Balance</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your current balance (${balance.toFixed(2)}) is not enough for the stake amount (${stake}).
                    Would you like to add more funds to continue playing?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="p-4 space-y-4">
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    onKeyPress={handleDepositKeyPress}
                    className="text-center"
                    placeholder="Enter amount to add"
                  />
                  <div className="flex justify-between gap-4">
                    <AlertDialogCancel
                      className="flex-1"
                      onClick={() => {
                        setShowAddBalance(false);
                        setDepositAmount('');
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      onClick={handleDeposit}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                      disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                    >
                      Add Balance
                    </Button>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Game Over!</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have run out of money. Would you like to add more funds to continue playing?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="p-4 space-y-4">
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    onKeyPress={handleDepositKeyPress}
                    className="text-center"
                    placeholder="Enter amount to add"
                  />
                  <div className="flex justify-between gap-4">
                    <AlertDialogCancel
                      className="flex-1"
                      onClick={() => {
                        setShowGameOverDialog(false);
                        setDepositAmount('');
                      }}
                    >
                      Exit Game
                    </AlertDialogCancel>
                    <Button
                      onClick={handleDeposit}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                      disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                    >
                      Continue Playing
                    </Button>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <div>
              <div className="text-center mb-2">Enter stake amount (min. ${MINIMUM_STAKE}):</div>
              <Input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                onKeyPress={handleStakeKeyPress}
                className="text-center"
                disabled={isSpinning}
              />
            </div>

            <SpinButton
              onClick={spinReels}
              disabled={!isStakeValid}
              isSpinning={isSpinning}
            />

            {balance <= 0 && !showAddBalance && (
              <Alert variant="destructive">
                <AlertDescription>Game Over! You have run out of money.</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        <Collapsible className="mt-8">
          <CollapsibleTrigger className="w-full p-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-t-lg flex items-center justify-between">
            <span className="text-lg font-bold">Game Rules & Winning Guide</span>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-gradient-to-r from-purple-950/90 to-blue-950/90 text-white p-6 rounded-b-lg space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">How to Play:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Start by depositing money into your balance</li>
                  <li>Enter a stake amount (minimum ${MINIMUM_STAKE})</li>
                  <li>Click SPIN to start the game</li>
                  <li>Match symbols to win prizes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Symbols & Payouts:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold">Regular Symbols:</p>
                    <ul className="text-sm space-y-1">
                      <li>🍎 Apple: 1.4× stake (common)</li>
                      <li>🍊 Orange: 1.6× stake (medium)</li>
                      <li>🍇 Grapes: 1.8× stake (rare)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Special Symbol:</p>
                    <ul className="text-sm space-y-1">
                      <li>🎰 Jackpot: $1,000 fixed prize!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Winning Rules:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Match three identical symbols to win</li>
                  <li>Regular wins = stake × (1 + symbol coefficient)</li>
                  <li>Three 🎰 symbols = Jackpot prize of $1,000</li>
                  <li>Wins are automatically added to your balance</li>
                </ul>
              </div>

              <div className="text-xs opacity-80 mt-4">
                Note: This is a game of chance. Please play responsibly and within your means.
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default SlotMachine;