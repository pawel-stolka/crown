export interface Money {
  id: string;
  userId: string;
  type?: string;
  price: number;
  fromWho: string;
  createdAt: Date;
  details?: string;
  extra?: string;
}
