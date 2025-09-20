import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white shadow-inner">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Card Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
