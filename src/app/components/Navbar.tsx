import React, { useState } from 'react';
import { client } from '../client';
import { ConnectButton, lightTheme } from 'thirdweb/react';

interface NavbarProps {
  onSearch: (address: string, chainId: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [inputAddress, setInputAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState(1); // Default to Ethereum

  const handleSearch = () => {
    onSearch(inputAddress, selectedChain);
  };

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">NFT Explorer</h1>
          </div>
          <div className="flex-grow max-w-xl mx-4">
            <div className="flex">
              <input
                type="text"
                placeholder="NFT contract address"
                className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedChain}
                onChange={(e) => setSelectedChain(Number(e.target.value))}
              >
                <option value={1}>Ethereum</option>
                <option value={11155111}>Sepolia</option>
              </select>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md transition duration-300"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <ConnectButton 
                client={client}
                theme={lightTheme()}      
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
