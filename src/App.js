import { useMemo, useCallback } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import useWalletNftsWithMeta from "./useWalletNftsWithMeta";

export function Home() {
  const wallet = useWallet();
  const publicAddress = useMemo(
    () => wallet?.publicKey?.toString() || "",
    [wallet]
  );
  const { nfts } = useWalletNftsWithMeta();

  const renderNft = useCallback((nft) => {
    if (nft?.meta?.image) {
      return (
        <img
          alt="nft"
          height="150"
          key={nft.mint}
          src={nft?.meta?.image}
          style={{ background: "#333" }}
          width="150"
        />
      );
    }
    return (
      <div
        key={nft.mint}
        style={{
          background: "#333",
          display: "inline-block",
          height: 150,
          width: 150,
        }}
      />
    );
  }, []);

  return (
    <>
      <div>{publicAddress}</div>
      <hr />
      <div style={{ display: "flex", gridGap: 10, flexWrap: "wrap" }}>
        {nfts.map(renderNft)}
      </div>
    </>
  );
}

export default function App() {
  const wallets = useMemo(() => [getPhantomWallet()], []);
  const endpoint = useMemo(
    () => clusterApiUrl(WalletAdapterNetwork.Devnet),
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={console.error} autoConnect>
        <Home />
      </WalletProvider>
    </ConnectionProvider>
  );
}
