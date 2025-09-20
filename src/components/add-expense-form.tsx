'use client';

import { useState, type Dispatch } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Action } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(3, 'Description is too short'),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Please select a category'),
});

const STATIC_CATEGORIES = [
  "Food & Groceries", "Restaurants & Dining", "Coffee Shops", "Bars & Nightlife",
  "Public Transportation", "Ride-Sharing", "Gasoline & Fuel", "Vehicle Maintenance", "Parking", "Taxis",
  "Rent/Mortgage", "Property Taxes", "Home Insurance", "Utilities", "Internet", "Cable/Streaming", "Phone Bill", "Home Maintenance", "Furniture & Decor", "Household Supplies",
  "Clothing & Accessories", "Shoes", "Jewelry & Watches", "Personal Care & Cosmetics", "Haircuts & Salons",
  "Gym Membership", "Sports & Recreation", "Hobbies & Crafts", "Movies & Theaters", "Concerts & Events", "Books & Magazines", "Music", "Games",
  "Doctor & Co-pays", "Dentist", "Eye Care", "Prescriptions", "Health Insurance", "Vitamins & Supplements",
  "Tuition & School Fees", "Textbooks & Supplies", "Student Loans", "Online Courses",
  "Airfare", "Hotels & Accommodation", "Car Rental", "Tours & Activities", "Souvenirs",
  "Charitable Donations", "Gifts", "Pet Food & Supplies", "Veterinary Care", "Pet Grooming",
  "Life Insurance", "Investments", "Savings", "Retirement Contributions", "Financial Advisor Fees",
  "Electronics", "Software", "Gadgets", "Home Appliances",
  "Childcare & Babysitting", "Kids' Activities", "Toys & Games", "Baby Supplies", "School Lunches",
  "Federal Taxes", "State Taxes", "Local Taxes", "Property Taxes",
  "Legal Fees", "Bank Fees", "Credit Card Fees", "Postage & Shipping", "Subscriptions & Memberships",
  "Home Office Supplies", "Business Travel", "Client Entertainment", "Professional Development", "Business Software",
  "Emergency Fund", "Home Improvement Projects", "New Vehicle Fund", "Vacation Fund",
  "Laundry & Dry Cleaning", "Home Security", "Landscaping & Garden", "Flowers", "Donations",
  "Alcohol", "Tobacco", "Lottery & Gambling",
  "Therapy & Counseling", "Spa & Wellness", "Alternative Medicine",
  "Continuing Education", "Workshops & Seminars", "Certifications",
  "Car Wash", "Public Restrooms", "ATM Fees", "Tips & Gratuities", "Other"
];


interface AddExpenseFormProps {
  dispatch: Dispatch<Action>;
  allCategories: string[];
  cardId: string | null;
}

export function AddExpenseForm({ dispatch, allCategories, cardId }: AddExpenseFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: '' as any,
      category: '',
    },
  });
  
  const uniqueCategories = Array.from(new Set([...STATIC_CATEGORIES, ...allCategories])).sort();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!cardId) {
      toast({
        variant: 'destructive',
        title: 'No Card Selected',
        description: 'Please add and select a credit card before adding an expense.',
      });
      return;
    }
    dispatch({ type: 'ADD_EXPENSE', payload: { ...values, cardId } });
    form.reset();
    toast({
      title: 'Expense Added',
      description: `Successfully added "${values.description}".`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee with a friend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15.00" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={'Select a category'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !cardId}>
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
