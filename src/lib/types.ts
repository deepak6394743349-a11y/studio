export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  category: string;
}

export interface CreditCard {
  id: string;
  number: string;
  expiry: string;
  name: string;
}

export type State = {
  expenses: Expense[];
  cards: CreditCard[];
  selectedCardId: string | null;
};

export type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'ADD_CARD'; payload: Omit<CreditCard, 'id'> }
  | { type: 'UPDATE_CARD'; payload: CreditCard }
  | { type: 'DELETE_CARD'; payload: { id: string } }
  | { type: 'SELECT_CARD'; payload: { id: string | null } };
