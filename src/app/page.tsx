'use client';

import { useState } from "react";
import { defineChain, getContract } from "thirdweb";
import { client } from "./client";
import { Suspense } from "react";
import { NFT, useReadContract } from "thirdweb/react";
import { getNFTs, nextTokenIdToMint } from "thirdweb/extensions/erc721";

export interface HomeProps {
  contractAddress: string;
  chainId: number;
}

const NFTCardSkeleton = () => (
  <div className="card bg-gray-200 shadow-xl p-4 rounded-lg animate-pulse">
    <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

export default function Home({ contractAddress, chainId }: HomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const nftsPerPage = 20;

  const nftContract = getContract({
    client: client,
    chain: defineChain(chainId || 11155111),
    address: contractAddress || "0xBb1d78c8799b33c5791ED6e49B84429c7106759E"
  });

  const { data: nfts, isLoading } = useReadContract(
    getNFTs,
    {
      contract: nftContract,
      start: (currentPage - 1) * nftsPerPage,
      count: nftsPerPage
    }
  );

  const { data: totalSupply } = useReadContract(
    nextTokenIdToMint,
    {
      contract: nftContract
    }
  );

  const totalPages = totalSupply ? Math.ceil(Number(totalSupply) / nftsPerPage) : 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!isLoading && nfts && nfts
          .filter((nft, index) => {
            if (index === 0) {
              // Check if the first NFT (token ID 0) has data
              return nft.metadata && Object.keys(nft.metadata).length > 3;
            }
            return true; // Include all other NFTs
          })
          .map((nft) => (
            <NFT key={nft.id} contract={nftContract} tokenId={nft.id}>
              <Suspense fallback={<NFTCardSkeleton />}>
                <div className="card bg-gray-50 shadow-xl p-4 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 group">
                  <figure><NFT.Media /></figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-left font-bold group-hover:text-white"><NFT.Name /></h2>
                  </div>
                </div>
              </Suspense>
            </NFT>
          ))}
      </div>
      
      {nfts && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button 
              className="join-item btn btn-outline bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l-lg"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              className="join-item btn btn-outline bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-4"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="join-item btn btn-ghost pointer-events-none">
              Page <span className="font-extrabold mx-1">{currentPage}</span> of <span className="font-extrabold mx-1">{totalPages}</span>
            </span>
            <button 
              className="join-item btn btn-outline bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 ml-4"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button 
              className="join-item btn btn-outline bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </main>
  );
}