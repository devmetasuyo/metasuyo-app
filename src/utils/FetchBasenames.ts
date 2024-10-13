import {
  BasenameTextRecordKeys,
  getBasename,
  getBasenameAvatar,
  getBasenameTextRecord,
} from "@/apis/basenames";
import { BasenameInfo } from "@/types/basenameInfo";
import { isAddress } from "viem";

export async function fetchData(
  address: string
): Promise<BasenameInfo | undefined> {
  const addressFormatted = address.toLocaleLowerCase();

  if (!isAddress(addressFormatted)) throw Error("invalid address");

  const basename = await getBasename(addressFormatted);

  if (basename === undefined) return undefined;

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
  };
}
