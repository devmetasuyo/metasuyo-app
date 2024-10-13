import type { Nft } from "@/types";
import {
  BasenameTextRecordKeys,
  getBasename,
  getBasenameAvatar,
  getBasenameTextRecord,
} from "@/apis/basenames";

export async function getNftInfo(contract: any, id: number): Promise<Nft> {
  const info = await contract.nftData(id);
  return {
    collectionId: info.collectionId.toNumber(),
    duplicates: info.duplicates.toNumber(),
    imageUri: info.imagenUri,
    jsonData: info.jsonData,
    name: info.name,
    price: info.price.toNumber(),
    rarity: info.rarity.toNumber(),
  };
}

async function fetchData(address: `0x${string}`) {
  const basename = await getBasename(address);

  if (basename === undefined) throw Error("failed to resolve address to name");

  const avatar = await getBasenameAvatar(basename);

  const description = await getBasenameTextRecord(
    basename,
    BasenameTextRecordKeys.Description
  );

  const twitter = await getBasenameTextRecord(
    basename,
    BasenameTextRecordKeys.Twitter
  );

  return {
    basename,
    avatar,
    description,
    twitter,
  };
}
