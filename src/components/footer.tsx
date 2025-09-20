import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Card Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
