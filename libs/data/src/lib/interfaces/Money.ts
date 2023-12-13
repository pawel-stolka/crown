export interface Money {
  id: string;
  userId: string;
  type?: string;
  price: number;
  fromWho: string;
  createdAt: Date;
  isVat?: boolean;
  isDeleted?: boolean;
  details?: string;
  extra?: string;
}
