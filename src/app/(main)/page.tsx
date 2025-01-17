"use client";

import { Banner, Title, Degradado, TextBody } from "@/components";
import { CarouselMainWallet } from "@/components";
import textos from "@/utils/text.json";
import { useConnect } from "wagmi";

function Page() {
  const { data } = useConnect();
  return (
    <>
      <Banner
        title={textos.landing.banner.title}
        subtitle={textos.landing.banner.subTitle}
        icon={true}
        imageUrl="/fondo.jpg"
        session={data ? true : false}
      />
      <Degradado />
      <TextBody>{textos.landing.text_1}</TextBody>
      <Title title={textos.landing.title} />
      <CarouselMainWallet />
    </>
  );
}

export default Page;
