import { Container, ContainerSection, Footer, Header } from "@/components";
import { Wrapper } from "./wrapper";
import { cookies } from "next/headers";

export default function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();

  return (
    <Wrapper>
      <Container id="metasuyo-content">
        <Header isAdmin={!!cookieStore.get("isAdmin")} />
        <ContainerSection>{children}</ContainerSection>
        <Footer />
      </Container>
    </Wrapper>
  );
}
