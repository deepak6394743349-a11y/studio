import { CreditCard } from 'lucide-react';
import React from 'react';

const Header = () => {
  return (
    <header className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex items-center space-x-3">
        <CreditCard className="w-8 h-8" />
      </div>
    </header>
  );
};

export default Header;
