import { useGetNftsByCollection } from "@/hooks/useGetNftsByCollection";
import { Spinner } from "@/components";
import { useAccount } from "wagmi";
import { CarouselNftVerifyOwner } from "../Carousels/Carousel";
import { GridCardNft } from "../Cards";

export const GridNftsCollectionWrapper = ({
  idCollection,
  address,
}: {
  idCollection: number;
  address: `0x${string}`;
}) => {
  const { data, isLoading } = useGetNftsByCollection(address, idCollection);
  const { address: userAddress, isConnecting } = useAccount();

  if (isLoading || isConnecting) return <Spinner />;
  if (!userAddress) return <p>Connect your wallet</p>;

  return (
    <>
      {data.map(
        (item) =>
          item.name.trim() !== "" && (
            <CarouselNftVerifyOwner id={item.id} addressCheck={userAddress}>
              <GridCardNft
                key={item.id}
                activeSession={false}
                id={item.id}
                address={address}
              />
            </CarouselNftVerifyOwner>
          )
      )}
    </>
  );
};
