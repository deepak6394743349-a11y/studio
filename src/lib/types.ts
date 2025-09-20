export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  category: string;
}

export interface CreditCard {
  number: string;
  expiry: string;
  name: string;
}
