import Image from "next/image";
import styles from "./zoraList.module.css";

const fetchNftInZora = async (
  address: string
): Promise<{
  items: [
    {
      is_unique: boolean;
      id: string;
      image_url: string;
      meta_data: {
        image_url: string;
        description: string;
        year: number;
      };
    },
  ];
  next_page_params: any | null;
} | null> => {
  try {
    const response = await fetch(
      `https://explorer.zora.energy/api/v2/addresses/${address}/nft`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("zora error: ", e);
    return null;
  }
};

export const ZoraList = async ({ address }: { address: string }) => {
  const data = await fetchNftInZora(address);

  if (!data || !data.items || data.items.length <= 0) {
    return (
      <div className={styles.emptyState}>No se encontraron NFTs en Zora</div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis NFTs en Zora</h2>
      <div className={styles.grid}>
        {data.items.map((nft) => (
          <div key={nft.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={
                  nft.image_url ||
                  nft.meta_data?.image_url ||
                  "/placeholder.png"
                }
                alt={nft.meta_data?.description || "NFT"}
                fill
                className={styles.image}
              />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.nftTitle}>
                {nft.meta_data?.description || "Sin título"}
              </h3>
              <div className={styles.cardFooter}>
                {nft.meta_data?.year && (
                  <span className={styles.year}>{nft.meta_data.year}</span>
                )}
                <span className={styles.id}>#{nft.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
