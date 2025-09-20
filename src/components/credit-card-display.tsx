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

interface CreditCardDisplayProps {
  cards: CreditCard[];
  selectedCardId: string | null;
  dispatch: Dispatch<Action>;
}

export function CreditCardDisplay({ cards, selectedCardId, dispatch }: CreditCardDisplayProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formOpen, setFormOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);

  const chipImage = PlaceHolderImages.find(img => img.id === 'credit-card-chip');
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
      const selectedCard = cards[carouselApi.selectedScrollSnap()];
      if (selectedCard) {
        dispatch({ type: 'SELECT_CARD', payload: { id: selectedCard.id } });
      }
    };
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, cards, dispatch]);

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

  const formatCardNumber = (num: string) => `**** **** **** ${num.slice(-4)}`;

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
                {cards.map((card) => (
                  <CarouselItem key={card.id}>
                    <div className="aspect-[1.586] w-full rounded-lg p-6 flex flex-col justify-between bg-gradient-to-br from-primary via-purple-500 to-accent text-primary-foreground shadow-lg">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xl">CC Expense</span>
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
                        <span className="text-2xl font-mono tracking-widest">{formatCardNumber(card.number)}</span>
                        <div className="flex justify-between items-end">
                          <span className="uppercase text-lg">{card.name}</span>
                          <span className="text-lg">{card.expiry}</span>
                        </div>
                      </div>
                    </div>
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
                      This action cannot be undone. This will permanently delete this credit card.
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
