import axios from "axios";

const PINATA_KEY = process.env.NEXT_PUBLIC_PINATA_KEY as string;

export async function uploadImage(
  imageFile: File,
  name: string
): Promise<string> {
  const formDataResized = new FormData();
  formDataResized.append("imagen", imageFile);

  const responseConvert = await fetch("/api/upload/image", {
    method: "POST",
    body: formDataResized,
  });

  const blob = await responseConvert.blob();
  const fileUpload = new File([blob], name, {
    type: "image/webp",
  });

  const formData = new FormData();
  formData.append("file", fileUpload);

  const pinataMetadata = JSON.stringify({ name });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 0 });
  formData.append("pinataOptions", pinataOptions);

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

  if (!response.data.IpfsHash) {
    throw new Error("Error al subir la imagen");
  }

  return `https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
}
