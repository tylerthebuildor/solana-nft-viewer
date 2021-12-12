import { useEffect, useCallback, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletNfts } from "@nfteyez/sol-rayz-react";

export default function useWalletNftsWithMeta() {
  const wallet = useWallet();
  const publicAddress = wallet?.publicKey?.toString() || "";
  const { connection } = useConnection();
  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress,
    connection,
  });

  const [metaMap, setMetaMap] = useState();
  const nftsWithMeta = nfts?.map((nft) => ({
    ...nft,
    meta: metaMap[nft.mint],
  }));

  const getMeta = useCallback(async () => {
    const nextMetaMap = {};
    for (const nft of nfts) {
      const response = await fetch(nft?.data?.uri);
      const meta = await response.json();
      nextMetaMap[nft.mint] = meta;
    }
    setMetaMap(nextMetaMap);
  }, [nfts]);

  useEffect(() => {
    getMeta();
  }, [getMeta]);

  return { nfts: nftsWithMeta, isLoading, error };
}
