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
  
  // En caso de error, mostrar el NFT para no bloquear la visualización
  if (isError) {
    console.warn(`Error verificando propietario del NFT ${id}:`, error);
    return <>{children}</>;
  }

  onVerify && onVerify(owner!);

  // Si no hay addressCheck o está vacío, mostrar todos los NFTs
  // Si hay addressCheck, verificar que coincida con el propietario
  const shouldShow = !addressCheck || 
                     addressCheck.trim() === "" || 
                     addressCheck.trim().toLowerCase() === owner?.trim().toLowerCase();

  return shouldShow ? <>{children}</> : null;
};
