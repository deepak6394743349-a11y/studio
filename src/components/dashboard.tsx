'use client';

import { useReducer, useEffect, Dispatch } from 'react';
import type { Expense, CreditCard, Action } from '@/lib/types';
import { Icons } from '@/components/icons';
import { CreditCardDisplay } from '@/components/credit-card-display';
import { AddExpenseForm } from '@/components/add-expense-form';
import { ExpenseList } from '@/components/expense-list';
import { ExpenseChart } from '@/components/expense-chart';

type State = {
  expenses: Expense[];
  card: CreditCard | null;
};

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_EXPENSE': {
      const newExpense: Expense = {
        ...action.payload,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      return { ...state, expenses: [newExpense, ...state.expenses] };
    }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload.id),
      };
    case 'SET_CARD':
      return { ...state, card: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  expenses: [],
  card: null,
};

const STORAGE_KEY = 'cc-expense-app-state';

export default function Dashboard() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Basic validation
        if (parsedState && typeof parsedState === 'object') {
          dispatch({ type: 'SET_STATE', payload: { ...initialState, ...parsedState } });
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage', error);
    }
  }, [state]);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Icons.Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground">
            CC Expense
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 md:p-8 grid gap-8 lg:grid-cols-5">
          <aside className="lg:col-span-2 flex flex-col gap-8">
            <CreditCardDisplay card={state.card} dispatch={dispatch} />
            <AddExpenseForm dispatch={dispatch} expenses={state.expenses} />
          </aside>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <ExpenseChart expenses={state.expenses} />
            <ExpenseList expenses={state.expenses} dispatch={dispatch} />
          </div>
        </div>
      </main>
    </div>
  );
}
