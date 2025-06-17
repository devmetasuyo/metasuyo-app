import { Container, ContainerSection, Footer, Header } from "@/components";
import { Wrapper } from "./wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Container id="metasuyo-content">
        <Header />
        <ContainerSection>{children}</ContainerSection>
        <Footer/>
      </Container>
    </Wrapper>
  );
}
