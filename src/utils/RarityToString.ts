export function RarityToString(rarity: number): string {
  switch (rarity) {
    case 1: {
      return "Ordinario";
    }
    case 2: {
      return "Común";
    }
    case 3: {
      return "Raro";
    }
    case 4: {
      return "Legendario";
    }
    case 5: {
      return "Mítico";
    }
    default:
      return "N/E";
  }
}
