
'use client';

import { useState } from 'react';
import { CreditCard, PlusCircle, DollarSign, Tag, Calendar, Banknote, Trash2 } from 'lucide-react';

// Mock data
interface Card {
  id: number;
  name: string;
  bank: string;
  last4: string;
}

interface Transaction {
  id: number;
  cardId: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const initialCards: Card[] = [
  { id: 1, name: 'HDFC Millennia', bank: 'HDFC Bank', last4: '1234' },
  { id: 2, name: 'Amazon Pay ICICI', bank: 'ICICI Bank', last4: '5678' },
];

const initialTransactions: Transaction[] = [
  { id: 1, cardId: 1, description: 'Starbucks Coffee', amount: 8.50, category: 'Food', date: '2024-05-20' },
  { id: 2, cardId: 1, description: 'Netflix Subscription', amount: 15.00, category: 'Entertainment', date: '2024-05-18' },
  { id: 3, cardId: 2, description: 'Amazon Purchase', amount: 125.00, category: 'Shopping', date: '2024-05-19' },
];

export default function Home() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedCard, setSelectedCard] = useState<Card | null>(initialCards[0]);
  const [newCard, setNewCard] = useState({ name: '', bank: '', last4: '' });
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.name && newCard.bank && newCard.last4) {
      const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
      const cardToAdd = { id: newId, ...newCard };
      setCards([...cards, cardToAdd]);
      setNewCard({ name: '', bank: '', last4: '' });
      setShowAddCardForm(false);
      setSelectedCard(cardToAdd);
    }
  };
  
  const openDeleteConfirm = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    setCardToDelete(card);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (cardToDelete) {
      // Filter out the card to be deleted
      const updatedCards = cards.filter(card => card.id !== cardToDelete.id);
      setCards(updatedCards);

      // Filter out transactions for the deleted card
      const updatedTransactions = transactions.filter(t => t.cardId !== cardToDelete.id);
      setTransactions(updatedTransactions);

      // If the deleted card was the selected one, update selectedCard
      if (selectedCard?.id === cardToDelete.id) {
        setSelectedCard(updatedCards.length > 0 ? updatedCards[0] : null);
      }

      // Close the modal and reset cardToDelete
      setShowDeleteConfirm(false);
      setCardToDelete(null);
    }
  };

  const filteredTransactions = transactions.filter(t => t.cardId === selectedCard?.id);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${selectedCard?.id === card.id ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white transform scale-105' : 'bg-white hover:shadow-xl'}`}
            >
              <button
                onClick={(e) => openDeleteConfirm(e, card)}
                className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${selectedCard?.id === card.id ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'}`}
                aria-label="Delete card"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-bold ${selectedCard?.id === card.id ? 'text-white' : 'text-gray-800'}`}>{card.name}</h3>
                  <p className={`text-sm ${selectedCard?.id === card.id ? 'text-blue-100' : 'text-gray-500'}`}>{card.bank}</p>
                </div>
                <Banknote className={`w-8 h-8 ${selectedCard?.id === card.id ? 'text-blue-200' : 'text-indigo-500'}`} />
              </div>
              <div className="mt-6 text-right">
                <p className={`text-lg font-mono tracking-wider ${selectedCard?.id === card.id ? 'text-white' : 'text-gray-700'}`}>
                  **** **** **** {card.last4}
                </p>
              </div>
            </div>
          ))}
          <div
            onClick={() => setShowAddCardForm(true)}
            className="flex flex-col justify-center items-center p-6 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all duration-300"
          >
            <PlusCircle className="w-10 h-10 mb-2" />
            <p className="font-semibold">Add New Card</p>
          </div>
        </div>
      </div>

      {showAddCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add a New Credit Card</h3>
            <form onSubmit={handleAddCard}>
              <div className="space-y-4">
                <input type="text" placeholder="Card Name (e.g., HDFC Millennia)" value={newCard.name} onChange={e => setNewCard({ ...newCard, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Bank Name" value={newCard.bank} onChange={e => setNewCard({ ...newCard, bank: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" placeholder="Last 4 Digits" value={newCard.last4} onChange={e => setNewCard({ ...newCard, last4: e.target.value })} maxLength={4} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => setShowAddCardForm(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 font-semibold">Add Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && cardToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the card "{cardToDelete.name}"? This will also remove all its associated transactions. This action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button>
              <button type="button" onClick={handleConfirmDelete} className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {selectedCard && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions for {selectedCard.name}</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {filteredTransactions.length > 0 ? (
              <ul className="space-y-4">
                {filteredTransactions.map(t => (
                  <li key={t.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                         <DollarSign className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{t.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                             <Tag className="w-4 h-4"/>
                             <span>{t.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                             <Calendar className="w-4 h-4"/>
                            <span>{t.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-gray-800">${t.amount.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="font-semibold">No transactions for this card yet.</p>
                <p className="text-sm">Add a new transaction to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
