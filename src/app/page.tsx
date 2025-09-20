
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
  { id: 4, cardId: 1, description: 'Groceries', amount: 75.20, category: 'Shopping', date: '2024-05-21' },
  { id: 5, cardId: 1, description: 'Movie Tickets', amount: 22.00, category: 'Entertainment', date: '2024-05-22' },
  { id: 6, cardId: 2, description: 'Dinner Out', amount: 60.00, category: 'Food', date: '2024-05-23' },

];

export default function Home() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedCard, setSelectedCard] = useState<Card | null>(initialCards[0]);
  const [newCard, setNewCard] = useState({ name: '', bank: '', last4: '' });
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showDeleteCardConfirm, setShowDeleteCardConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [showDeleteTransactionConfirm, setShowDeleteTransactionConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

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
  
  const openDeleteCardConfirm = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    setCardToDelete(card);
    setShowDeleteCardConfirm(true);
  };

  const handleConfirmDeleteCard = () => {
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
      setShowDeleteCardConfirm(false);
      setCardToDelete(null);
    }
  };

  const openDeleteTransactionConfirm = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteTransactionConfirm(true);
  };

  const handleConfirmDeleteTransaction = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
      setShowDeleteTransactionConfirm(false);
      setTransactionToDelete(null);
    }
  };


  const filteredTransactions = transactions.filter(t => t.cardId === selectedCard?.id);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                selectedCard?.id === card.id ? 'bg-gradient-to-br from-gray-800 to-black text-white ring-2 ring-blue-400' : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
              }`}
            >
               <button
                onClick={(e) => openDeleteCardConfirm(e, card)}
                className="absolute top-3 right-3 p-1 rounded-full text-white/50 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Delete card"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-md flex justify-center items-center">
                    <div className="w-10 h-6 bg-yellow-200/50 rounded-sm border border-yellow-600/50"></div>
                </div>
                <span className="text-lg font-semibold">{card.bank}</span>
              </div>

              <div className="mb-6">
                  <p className="text-2xl font-mono tracking-widest">
                    **** **** **** {card.last4}
                  </p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase text-gray-300">Card Holder</p>
                  <p className="font-medium tracking-wider">{card.name}</p>
                </div>
                 <Banknote className={`w-8 h-8 opacity-70`} />
              </div>

            </div>
          ))}
          <div
            onClick={() => setShowAddCardForm(true)}
            className="flex flex-col justify-center items-center p-6 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 bg-white hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all duration-300"
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

      {showDeleteCardConfirm && cardToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the card "{cardToDelete.name}"? This will also remove all its associated transactions. This action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button type="button" onClick={() => setShowDeleteCardConfirm(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button>
              <button type="button" onClick={handleConfirmDeleteCard} className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteTransactionConfirm && transactionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm m-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the transaction "{transactionToDelete.description}"?
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button type="button" onClick={() => setShowDeleteTransactionConfirm(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button>
              <button type="button" onClick={handleConfirmDeleteTransaction} className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {selectedCard && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions for {selectedCard.name}</h2>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {filteredTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredTransactions.map(t => (
                  <li key={t.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                      <div className="p-3 bg-gray-100 rounded-full flex-shrink-0">
                         <DollarSign className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-semibold text-gray-800 truncate">{t.description}</p>
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
                    <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                        <p className="font-bold text-lg text-gray-800">${t.amount.toFixed(2)}</p>
                        <button onClick={() => openDeleteTransactionConfirm(t)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
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
