"use client";

import { Container, ContainerSection, Footer, Header } from "@/components";
import { useAccountEffect } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  useAccountEffect({
    onConnect: async (data) => {
      const response = await fetch(`/api/customers/0?wallet=${data.address}`);
      const dataResponse = await response.json();
      if (dataResponse) {
        if (!dataResponse.customer) {
          const response = await fetch(`/api/customers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: data.address }),
          });
          const dataResponse = await response.json();
          console.log(dataResponse);
        }
      }
    },
  });

  return (
    <Container id="metasuyo-content">
      <Header />
      <ContainerSection>{children}</ContainerSection>
      <Footer />
    </Container>
  );
}
