import * as React from 'react';

export const RealisticCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 20"
    fill="none"
    {...props}
  >
    <rect width="28" height="20" rx="3" fill="currentColor" />
    <rect x="3" y="14" width="8" height="2" rx="1" fill="white" fillOpacity="0.7" />
    <rect x="3" y="4" width="5" height="4" rx="1" fill="#fde400" />
    <line x1="3.5" y1="6.5" x2="7.5" y2="6.5" stroke="#4a4a4a" strokeWidth="0.5" strokeLinecap="round" />
     <line x1="3.5" y1="5.5" x2="7.5" y2="5.5" stroke="#4a4a4a" strokeWidth="0.5" strokeLinecap="round" />
  </svg>
);
