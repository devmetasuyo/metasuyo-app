import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const toAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export const GET = async (request: NextRequest) => {
  const blockNumber = await client.getBalance({
    address: toAddress as `0x${string}`,
    blockTag: "latest",
  });

  return NextResponse.json(
    {
      block: Number(blockNumber),
      message: "Hello World",
    },
    {
      status: 200,
    }
  );
};
