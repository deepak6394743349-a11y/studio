'use client';

import { useReducer, useEffect, useMemo } from 'react';
import type { Expense, CreditCard, Action } from '@/lib/types';
import { Icons } from '@/components/icons';
import { CreditCardDisplay } from '@/components/credit-card-display';
import { AddExpenseForm } from '@/components/add-expense-form';
import { ExpenseList } from '@/components/expense-list';
import { ExpenseChart } from '@/components/expense-chart';

type State = {
  expenses: Expense[];
  cards: CreditCard[];
  selectedCardId: string | null;
};

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_EXPENSE': {
      if (!state.selectedCardId) return state; // Don't add expense if no card is selected
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
    case 'ADD_CARD': {
      const newCard: CreditCard = { ...action.payload, id: crypto.randomUUID() };
      const newCards = [...state.cards, newCard];
      return {
        ...state,
        cards: newCards,
        selectedCardId: state.selectedCardId ?? newCard.id,
      };
    }
    case 'UPDATE_CARD': {
      const newCards = state.cards.map(c => c.id === action.payload.id ? action.payload : c);
      return { ...state, cards: newCards };
    }
    case 'DELETE_CARD': {
      const cardIdToDelete = action.payload.id;
      const newCards = state.cards.filter(c => c.id !== cardIdToDelete);
      const newExpenses = state.expenses.filter(e => e.cardId !== cardIdToDelete);
      let newSelectedId = state.selectedCardId;
      if (state.selectedCardId === cardIdToDelete) {
        newSelectedId = newCards.length > 0 ? newCards[0].id : null;
      }
      return { ...state, cards: newCards, expenses: newExpenses, selectedCardId: newSelectedId };
    }
    case 'SELECT_CARD': {
      return { ...state, selectedCardId: action.payload.id };
    }
    default:
      return state;
  }
};

const initialState: State = {
  expenses: [],
  cards: [],
  selectedCardId: null,
};

const STORAGE_KEY = 'cc-expense-app-state';

export default function Dashboard() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState && typeof parsedState === 'object') {
           const mergedState = {
            ...initialState,
            ...parsedState,
            cards: parsedState.cards || [],
            selectedCardId: parsedState.selectedCardId !== undefined ? parsedState.selectedCardId : (parsedState.cards?.[0]?.id || null),
           };
           // Handle legacy single card state
           if (parsedState.card && !parsedState.cards) {
              const legacyCard: CreditCard = { ...parsedState.card, id: crypto.randomUUID() };
              mergedState.cards = [legacyCard];
              mergedState.selectedCardId = legacyCard.id;
              delete (mergedState as any).card;
           }
          dispatch({ type: 'SET_STATE', payload: mergedState });
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
  
  const displayedExpenses = useMemo(() => {
    if (!state.selectedCardId) return [];
    return state.expenses.filter(expense => expense.cardId === state.selectedCardId);
  }, [state.expenses, state.selectedCardId]);

  const allCategories = useMemo(() => {
    return Array.from(new Set(state.expenses.map(e => e.category)));
  }, [state.expenses]);


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
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-5">
          <aside className="xl:col-span-2 flex flex-col gap-8">
            <CreditCardDisplay
              cards={state.cards}
              selectedCardId={state.selectedCardId}
              dispatch={dispatch}
            />
            <AddExpenseForm 
              dispatch={dispatch} 
              allCategories={allCategories}
              cardId={state.selectedCardId} 
            />
          </aside>
          <div className="xl:col-span-3 flex flex-col gap-8">
            <ExpenseChart expenses={displayedExpenses} />
            <ExpenseList expenses={displayedExpenses} dispatch={dispatch} />
          </div>
        </div>
      </main>
    </div>
  );
}
