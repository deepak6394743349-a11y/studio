'use client';

import { useState, type Dispatch } from 'react';
import Image from 'next/image';
import type { Action, CreditCard } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCardForm } from '@/components/credit-card-form';
import { PlusCircle } from 'lucide-react';

interface CreditCardDisplayProps {
  card: CreditCard | null;
  dispatch: Dispatch<Action>;
}

export function CreditCardDisplay({ card, dispatch }: CreditCardDisplayProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const chipImage = PlaceHolderImages.find(img => img.id === 'credit-card-chip');

  const formatCardNumber = (num: string) => {
    return `**** **** **** ${num.slice(-4)}`;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>My Card</CardTitle>
        </CardHeader>
        <CardContent>
          {card ? (
            <DialogTrigger asChild>
              <div className="aspect-[1.586] w-full rounded-lg p-6 flex flex-col justify-between bg-gradient-to-br from-primary via-purple-500 to-accent text-primary-foreground shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
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
            </DialogTrigger>
          ) : (
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
                <PlusCircle className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">Add Credit Card</span>
              </Button>
            </DialogTrigger>
          )}
        </CardContent>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{card ? 'Edit' : 'Add'} Credit Card</DialogTitle>
          </DialogHeader>
          <CreditCardForm card={card} dispatch={dispatch} onFinished={() => setDialogOpen(false)} />
        </DialogContent>
      </Card>
    </Dialog>
  );
}
