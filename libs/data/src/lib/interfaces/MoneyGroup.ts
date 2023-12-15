import { TypePrice } from './TypePrice';

export interface MoneyGroup {
  period: string;
  // TODO: use Partial if userId not need
  userId?: string;
  typePrices: TypePrice[];
  sum?: number;
}
