import { CreditCard } from 'lucide-react';
import React from 'react';

const Header = () => {
  return (
    <header className="p-4 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center space-x-4">
        <CreditCard className="w-7 h-7" />
        <h1 className="text-xl font-bold tracking-tight">Card Manager</h1>
      </div>
    </header>
  );
};

export default Header;
