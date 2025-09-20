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

export type State = {
  expenses: Expense[];
  card: CreditCard | null;
};

export type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'SET_CARD'; payload: CreditCard }
  | { type: 'DELETE_CARD' };
