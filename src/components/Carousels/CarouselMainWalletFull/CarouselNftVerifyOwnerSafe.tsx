import { useGetNftOwner } from "@/hooks/useGetNftOwner";
import { Spinner, Alert } from "../../common";

interface Props extends React.PropsWithChildren {
  id: number;
  addressCheck: string;
  onVerify?: (owner: string) => void;
}

export const CarouselNftVerifyOwnerSafe = ({
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
  
  if (isError) {
    console.warn(`Error verifying owner for NFT ${id}:`, error);
    // En caso de error, mostrar el NFT de todas formas para no bloquear la visualización
    return <>{children}</>;
  }

  onVerify && onVerify(owner!);

  // Si addressCheck está vacío, mostrar todos los NFTs
  // Si coincide con el owner, mostrar el NFT
  // En caso de duda, mostrar el NFT para no bloquear la visualización
  const shouldShow = !addressCheck || 
                     addressCheck.trim() === "" || 
                     addressCheck.trim().toLowerCase() === owner?.trim().toLowerCase();

  return shouldShow ? <>{children}</> : null;
}; 