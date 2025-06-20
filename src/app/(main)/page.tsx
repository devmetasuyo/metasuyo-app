"use client";

import { Banner, Title, Degradado, TextBody } from "@/components";
import { CarouselMainWalletSafe } from "@/components";
import textos from "@/utils/text.json";
import { usePrivySession } from "@/hooks/usePrivySession";

function Page() {
  const { session } = usePrivySession();
  return (
    <>
      <Banner
        title={textos.landing.banner.title}
        subtitle={textos.landing.banner.subTitle}
        icon={true}
        imageUrl="/fondo.jpg"
        session={session ? true : false}
      />
      <Degradado />
      <TextBody>{textos.landing.text_1}</TextBody>
      <Title title={textos.landing.title} />
      <CarouselMainWalletSafe />
    </>
  );
}

export default Page;
