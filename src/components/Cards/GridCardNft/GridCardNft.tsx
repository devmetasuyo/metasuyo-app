"use client";
import { useGetNftData } from "@/hooks/useGetNftData";
import { useRouter } from "next/navigation";
import { FaRegEye } from "react-icons/fa";

import Image from "next/image";
import { Spinner } from "@/components/common";

interface GridCardNftProps {
  id: number;
  activeSession: boolean;
  address: `0x${string}`;
}

export const GridCardNft: React.FC<GridCardNftProps> = ({
  id,
  activeSession,
  address,
}) => {
  const { data, isLoading } = useGetNftData(address, id);
  const router = useRouter();

  if (isLoading) return <Spinner />;

  return (
    <div
      style={{
        transform: "translate3d(0px, 0px, 0px)",
        minWidth: "191.5px",
        maxWidth: "191.5px",
        minHeight: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        borderRadius: "10px",
        border: "#F5A602 3px solid",
      }}
    >
      <Image
        alt={"nft" + id}
        width={50}
        height={50}
        style={{
          width: "97%",
          height: "200px",
          objectFit: "cover",
          marginTop: "5px",
          borderRadius: "10px",
        }}
        src={data?.imageUri ? data.imageUri : "/icon.png"}
      />
      {data && (
        <>
          {activeSession && (
            <button
              onClick={() => {
                router.push(`/Article/${id}`);
              }}
              className="button-light carousel-btn"
            >
              <FaRegEye />
            </button>
          )}
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#f5a602",
              marginBottom: "5px",
            }}
          >
            {data.name}
          </p>
        </>
      )}
    </div>
  );
};
