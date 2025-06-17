import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nft } from "@/types/nft";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { Input, Select } from "@/components";
import { z } from "zod";

const nftSchema = z.object({
  name: z.string().min(1, "El título es requerido"),
  collectionId: z.number().min(1, "La colección es requerida"),
  jsonData: z.string().min(1, "La descripción es requerida"),
  rarity: z.number().min(1, "La rareza es requerida"),
});

type NFTFormData = z.infer<typeof nftSchema>;

interface NFTDetailsProps {
  data: Nft;
  onSubmit: (data: NFTFormData) => void;
}

export function NFTDetails({
  data,

  onSubmit,
}: NFTDetailsProps) {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { collectionNames, isLoading } = useGetCollectionNames(address);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NFTFormData>({
    resolver: zodResolver(nftSchema),
    defaultValues: {
      name: data.name,
      collectionId: data.collectionId,
      jsonData: data.jsonData,
      rarity: data.rarity,
    },
  });

  const rarityOptions = [
    { value: "1", label: "Ordinario" },
    { value: "2", label: "Común" },
    { value: "3", label: "Raro" },
    { value: "4", label: "Legendario" },
    { value: "5", label: "Mítico" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit((data) => {
          onSubmit(data);
        });
      }}
    >
      <Input
        disabled={true}
        label="Titulo"
        type="text"
        {...register("name")}
        errors={errors.name?.message}
      />

      <Select label="Colección" {...register("collectionId")}>
        {collectionNames?.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </Select>
      <Input
        label="Descripción"
        {...register("jsonData")}
        errors={errors.jsonData?.message}
      />
      <Select label="Rareza" {...register("rarity")}>
        {rarityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </form>
  );
}
