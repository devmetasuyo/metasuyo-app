export function ContainerSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="metasuyo-container-section"
      style={{ background: "#040200" }}
    >
      {children}
    </section>
  );
}
