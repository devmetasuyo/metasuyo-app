import axios from "axios";

const PINATA_KEY = process.env.NEXT_PUBLIC_PINATA_KEY as string;
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET as string;

export async function uploadImageToPinata(
  imageFile: File,
  title: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pinataMetadata", JSON.stringify({ name: title }));
  formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: PINATA_KEY,
      },
    }
  );

  const data = await response.data.IpfsHash;

  return data;
}

export async function uploadMetadataToPinata(
  title: string,
  description: string,
  imageHash: string,
  rarity: number,
  collectionId: number
): Promise<string> {
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: { name: `${title}.json` },
      pinataContent: {
        description: description,
        name: title,
        image:
          "https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/" + imageHash,
        attributes: [
          { trait_type: "Rarity", value: rarity },
          {
            trait_type: "Collection",
            value: [collectionId],
          },
          { trait_type: "date", value: Date.now() },
        ],
      },
    },
    {
      headers: {
        Authorization: PINATA_KEY,
      },
    }
  );

  return response.data.IpfsHash;
}
