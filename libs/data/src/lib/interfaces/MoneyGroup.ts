import { TypePrice } from './TypePrice';

export interface MoneyGroup {
  period: string;
  userId: string;
  typePrices: TypePrice[];
  sum?: number;
}
