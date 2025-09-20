'use client';

import { useState, type Dispatch, useEffect } from 'react';
import Image from 'next/image';
import type { Action, CreditCard } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CreditCardForm } from '@/components/credit-card-form';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisaLogo } from '@/components/visa-logo';


const HDFCDesign = ({ card }: { card: CreditCard }) => {
  const chipImage = PlaceHolderImages.find(img => img.id === 'credit-card-chip');
  return (
    <div 
      className="aspect-[1.586] w-full rounded-xl p-6 flex flex-col justify-between text-white shadow-lg relative overflow-hidden bg-[#003D7A]"
    >
       <div 
        className="absolute inset-0 w-full h-full opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle at top left, #00A3E0, transparent 40%), radial-gradient(circle at bottom right, #C71F2D, transparent 40%)',
        }}
      />
      <div 
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white/5"
      />
       <div 
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-white/5"
      />

      <div className="relative z-10 flex justify-between items-start">
         <svg viewBox="0 0 130 30" className="w-24 h-auto">
            <rect width="130" height="30" fill="#003D7A"/>
            <path d="M12 5 H18 V12 H25 V18 H18 V25 H12 V18 H5 V12 H12 Z" fill="white"/>
            <text x="35" y="21" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">HDFC BANK</text>
        </svg>
        <div className="flex flex-col items-end gap-2">
            {chipImage && (
              <Image
                src={chipImage.imageUrl}
                alt={chipImage.description}
                width={48}
                height={38}
                className="rounded-md"
                data-ai-hint={chipImage.imageHint}
              />
            )}
            <VisaLogo className="w-16 h-auto" />
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col gap-2 text-white">
        <span className="text-2xl font-mono tracking-widest">{`**** **** **** ${card.number.slice(-4)}`}</span>
        <div className="flex justify-between items-end">
          <span className="uppercase text-base font-sans">{card.name}</span>
          <div className="flex flex-col items-end">
            <span className="text-xs">VALID THRU</span>
            <span className="text-base font-mono">{card.expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const AxisBankDesign = ({ card }: { card: CreditCard }) => {
  const chipImage = PlaceHolderImages.find(img => img.id === 'credit-card-chip');

  return (
    <div className="aspect-[1.586] w-full rounded-xl p-6 flex flex-col justify-between text-white shadow-lg relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" viewBox="0 0 338 213" preserveAspectRatio="none">
          <defs>
            <linearGradient id="axisGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#2F5AF5" />
              <stop offset="40%" stopColor="#2F5AF5" />
              <stop offset="60%" stopColor="#C81B7B" />
              <stop offset="100%" stopColor="#C81B7B" />
            </linearGradient>
          </defs>
          <path
            d="M-10,150 Q50,50 169,120 T350,80"
            stroke="url(#axisGradient)"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className='flex items-center gap-2'>
            <span className="font-bold text-lg">Flipkart</span>
            <div className="bg-[#fde400] p-1 rounded-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <svg viewBox="0 0 100 30" className="w-24 h-auto">
                <path d="M10 0 L0 15 L10 30 H20 L30 15 L20 0 Z" fill="#6a1b9a"/>
                <text x="35" y="21" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">AXIS BANK</text>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4.6 4.6a12.6 12.6 0 0 1 14.8 0"/><path d="M7.1 7.1a8.4 8.4 0 0 1 9.8 0"/><path d="M9.5 9.5a4.2 4.2 0 0 1 5 0"/><path d="M12 12a.2.2 0 0 1 .2.2v-.4a.2.2 0 0 1-.2.2Z"/></svg>
        </div>
      </div>
      
      <div className="relative z-10 flex justify-between items-end">
        <div>
          {chipImage && (
            <Image
              src={chipImage.imageUrl}
              alt={chipImage.description}
              width={48}
              height={38}
              className="rounded-md mb-2"
              data-ai-hint={chipImage.imageHint}
            />
          )}
          <span className="uppercase text-lg font-sans">{card.name}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-2xl font-mono tracking-widest">{`**** **** **** ${card.number.slice(-4)}`}</span>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="text-xs block">VALID THRU</span>
                    <span className="text-base font-mono">{card.expiry}</span>
                </div>
                 <VisaLogo className="w-16 h-auto" />
            </div>
        </div>
      </div>
    </div>
  );
};


const GenericDesign = ({ card, index }: { card: CreditCard, index: number }) => {
  const chipImage = PlaceHolderImages.find(img => img.id === 'credit-card-chip');
  const getCardStyle = (): React.CSSProperties => {
    const styles = [
      { background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)', color: 'white' },
      { background: 'linear-gradient(135deg, #000000 0%, #434343 100%)', color: 'white' },
      { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' },
      { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' },
      { background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'black' },
      { background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: 'white' },
    ];
    return styles[index % styles.length];
  };

  return (
    <div 
      className="aspect-[1.586] w-full rounded-lg p-6 flex flex-col justify-between text-primary-foreground shadow-lg"
      style={getCardStyle()}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-xl">{card.bankName}</span>
        {chipImage && (
          <Image
            src={chipImage.imageUrl}
            alt={chipImage.description}
            width={64}
            height={40}
            className="rounded-md"
            data-ai-hint={chipImage.imageHint}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-2xl font-mono tracking-widest">{`**** **** **** ${card.number.slice(-4)}`}</span>
        <div className="flex justify-between items-end">
          <span className="uppercase text-lg">{card.name}</span>
          <span className="text-lg">{card.expiry}</span>
        </div>
      </div>
    </div>
  );
};


export function CreditCardDisplay({ cards, selectedCardId, dispatch }: { cards: CreditCard[]; selectedCardId: string | null; dispatch: Dispatch<Action>}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formOpen, setFormOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);

  const selectedCard = cards.find(c => c.id === selectedCardId) ?? null;

  useEffect(() => {
    if (!carouselApi) return;
    const selectedIndex = cards.findIndex(c => c.id === selectedCardId);
    if (selectedIndex !== -1 && selectedIndex !== carouselApi.selectedScrollSnap()) {
      carouselApi.scrollTo(selectedIndex);
    }
  }, [selectedCardId, cards, carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      const selectedCardInCarousel = cards[carouselApi.selectedScrollSnap()];
      if (selectedCardInCarousel && selectedCardInCarousel.id !== selectedCardId) {
        dispatch({ type: 'SELECT_CARD', payload: { id: selectedCardInCarousel.id } });
      }
    };
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, cards, dispatch, selectedCardId]);

  const handleAddClick = () => {
    setFormMode('add');
    setCardToEdit(null);
    setFormOpen(true);
  };

  const handleEditClick = (card: CreditCard) => {
    setFormMode('edit');
    setCardToEdit(card);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (selectedCard) {
      dispatch({ type: 'DELETE_CARD', payload: { id: selectedCard.id } });
    }
  };


  const renderCard = (card: CreditCard, index: number) => {
    const bank = card.bankName.toLowerCase();
    if (bank.includes('hdfc')) {
      return <HDFCDesign card={card} />;
    }
    if (bank.includes('axis')) {
      return <AxisBankDesign card={card} />;
    }
    return <GenericDesign card={card} index={index} />;
  }

  return (
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <Card>
        <CardHeader>
          <CardTitle>My Cards</CardTitle>
        </CardHeader>
        <CardContent>
          {cards.length > 0 ? (
            <Carousel setApi={setCarouselApi} className="w-full">
              <CarouselContent>
                {cards.map((card, index) => (
                  <CarouselItem key={card.id}>
                    {renderCard(card, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              {cards.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="aspect-[1.586] w-full flex items-center justify-center">
              <p className="text-muted-foreground">No cards added yet.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleAddClick} variant="outline" size="sm">
            <PlusCircle /> Add Card
          </Button>
          {selectedCard && (
            <div className="flex items-center gap-2">
              <Button onClick={() => handleEditClick(selectedCard)} variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this credit card and all associated expenses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardFooter>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formMode === 'add' ? 'Add' : 'Edit'} Credit Card</DialogTitle>
        </DialogHeader>
        <CreditCardForm card={cardToEdit} dispatch={dispatch} onFinished={() => setFormOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
