import { useGetNftOwner } from "@/hooks/useGetNftOwner";
import { Spinner } from "../../common";

interface Props extends React.PropsWithChildren {
  id: number;
  addressCheck: string;
  onVerify?: (owner: string) => void;
}

export const CarouselNftVerifyOwner = ({
  id,
  children,
  addressCheck,
  onVerify,
}: Props) => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: owner,
    isLoading,
    isError,
    error,
  } = useGetNftOwner(contractAddress, id);

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error {error?.message}</div>;

  onVerify && onVerify(owner!);

  return (
    <>
      {addressCheck.trim() === "" || addressCheck.trim() === owner?.trim()
        ? children
        : null}
    </>
  );
};
