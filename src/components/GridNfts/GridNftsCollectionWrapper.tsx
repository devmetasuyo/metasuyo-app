import { useGetNftsByCollection } from "@/hooks/useGetNftsByCollection";
import { Spinner } from "@/components";
import { usePrivySession } from "@/hooks/usePrivySession";
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
  const { session, loading } = usePrivySession();

  if (isLoading || loading) return <Spinner />;
  if (!session) return <p>Connect your wallet</p>;

  return (
    <>
      {data.map(
        (item) =>
          item.name.trim() !== "" && (
            <CarouselNftVerifyOwner id={item.id} addressCheck={session?.wallet as string}>
              <GridCardNft
                key={item.id}
                activeSession={false}
                id={item.id}
                address={session?.wallet as `0x${string}`}
              />
            </CarouselNftVerifyOwner>
          )
      )}
    </>
  );
};
