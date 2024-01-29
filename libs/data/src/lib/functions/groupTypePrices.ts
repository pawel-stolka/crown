import { MoneyGroup, TypePrice } from "@crown/data";
import { fixNumber } from "../tools";

export function groupTypePrices(moneyGroups: (MoneyGroup | null)[]) {
  if (moneyGroups) {
    const flatTypePrices = moneyGroups.map((x: any) => x.typePrices).flat();
    const groups = flatTypePrices.reduce((acc, item: TypePrice) => {
      // Initialize the price with 0
      if (!acc[item.type]) {
        acc[item.type] = 0;
      }
      acc[item.type] += item.price;
      return acc;
    }, {} as Record<string, number>);

    // Convert the object into an array of objects
    const typePrices: TypePrice[] = Object.keys(groups).map((type) => ({
      type,
      price: fixNumber(groups[type]),
    }));

    return typePrices;
  }
  return [];
}
