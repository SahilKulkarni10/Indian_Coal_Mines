
import React from 'react';

interface HeaderProps {
  onCarbonCreditClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCarbonCreditClick }) => {
  return (
    <header className="bg-white shadow-md z-20 border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-900 tracking-wider">
              CoalSight <span className="text-blue-600">AI</span>
            </h1>
        </div>
        <ul className="hidden md:flex items-center space-x-8">
          <li>
            <button
              onClick={onCarbonCreditClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Carbon Credits
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
