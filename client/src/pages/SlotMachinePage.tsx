import React from 'react';
import { SlotMachine } from '@/components/SlotMachine';

const SlotMachinePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900">
      <div className="w-full max-w-lg">
        <SlotMachine />
      </div>
    </div>
  );
};

export default SlotMachinePage;
