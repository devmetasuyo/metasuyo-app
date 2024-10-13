import { Container, ContainerSection, Footer, Header } from "@/components";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container id="metasuyo-content">
      <Header />
      <ContainerSection>{children}</ContainerSection>
      <Footer />
    </Container>
  );
}
