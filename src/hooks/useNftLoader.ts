// import { ethers } from 'ethers';
// import { useEffect, useState } from 'react';
// interface NftLoaderProps {
//   id: number;
//   contract: ethers.Contract;
// }
// const NftLoader: React.FC<NftLoaderProps> = ({ id, contract }) => {
//   const [nft, setNft] = useState<NFT | null>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const loadNft = async () => {
//       const info = await contract.nftData(id);
//       setNft({
//         collectionId: info.collectionId.toNumber(),
//         duplicates: info.duplicates.toNumber(),
//         imageUri: info.uri,
//         jsonData: info.jsonData,
//         name: info.name,
//         price: info.price.toNumber(),
//         rarity: info.rarity.toNumber(),
//         uri: info.uri,
//       });
//       setLoading(false);
//     };
//     loadNft();
//   }, [id, contract]);
//   return { nft, loading };
// };
// export default NftLoader;
