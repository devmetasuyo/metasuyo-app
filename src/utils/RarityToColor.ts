export function RarityToColor(rarity: number): string {
  switch (rarity) {
    case 1: {
      return "gray";
    }
    case 2: {
      return "white";
    }
    case 3: {
      return "blue";
    }
    case 4: {
      return "yellow";
    }
    case 5: {
      return "#702670";
    }
    default:
      return "N/E";
  }
}
