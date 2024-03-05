import { router } from "expo-router";
import { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useSwitchNetwork } from "wagmi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { address } = useAccount();
  const { chains, switchNetwork } = useSwitchNetwork();

//   useEffect(() => {
//     // Assuming the correct chain ID is stored in a variable named `correctChainId`
//     const correctChainId = 97; // Example chain ID for Ethereum Mainnet

//     // Check if the current chain is not the correct one
//     if (chains.find((chain) => chain.id === correctChainId) === undefined) {
//       // If not, prompt the user to switch to the correct network
//       alert("Please switch to the correct network to continue.");
//       // Optionally, you can automatically switch the network if you know the correct chain ID
//       // switchNetwork(correctChainId);
//     }
//   }, [chains, switchNetwork]);

//   useEffect(() => {
//     if (address) {
//       router.replace("/(tabs)");
//     } else {
//       router.replace("/");
//     }
//   });
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
