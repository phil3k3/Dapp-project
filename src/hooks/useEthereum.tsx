// Import ethers.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface EthereumHook {
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
    address: string | null;
    isConnected: boolean;
}

function useEthereum(): EthereumHook {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const initializeEthereum = async () => {
            try {
                // Check if the Ethereum provider is available
                if (typeof window.ethereum === "undefined") {
                    console.error("MetaMask is not installed!");
                    return;
                }

                // Request accounts from the user
                const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("Connected accounts: ", accounts);

                if (accounts.length > 0) {
                    console.log("Setting up first account: ", accounts[0]);
                    setAddress(accounts[0]); // Set the first account as 'from'
                    setIsConnected(true);

                    // Initialize ethers provider and signer
                    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
                    const ethersSigner = ethersProvider.getSigner();

                    setProvider(ethersProvider);
                    setSigner(ethersSigner);
                } else {
                    console.error("No accounts available.");
                }
            } catch (error) {
                console.error("Error initializing Ethereum:", error);
            }
        };

        initializeEthereum();
    }, []); // Run only once on component mount

    return { provider, signer, address, isConnected };
}

export default useEthereum;
