"use client";

import { useState } from 'react';
import Navbar from './components/Navbar';
import Home, { HomeProps } from './page';

const AppWrapper = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState(1); // Default to Ethereum

  const handleSearch = (address: string, selectedChainId: number) => {
    setContractAddress(address);
    setChainId(selectedChainId);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <Home contractAddress={contractAddress} chainId={chainId} />
    </>
  );
};

export default AppWrapper;