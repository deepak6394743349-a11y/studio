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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Loader2, Plus, Check, ChevronsUpDown, Sparkles } from 'lucide-react';
import { suggestCategory } from '@/ai/flows/suggest-category-flow';

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
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

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

  const handleSuggestCategory = async () => {
    const description = form.getValues('description');
    if (!description || description.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Description too short',
        description: 'Please enter a description before suggesting a category.',
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestCategory({ description, categories: uniqueCategories });
      if (result.category && uniqueCategories.includes(result.category)) {
        form.setValue('category', result.category, { shouldValidate: true });
        toast({
          title: 'Category Suggested',
          description: `We've selected "${result.category}" for you.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'Suggestion Failed',
          description: 'The AI could not suggest a valid category.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Error',
        description: 'An error occurred while suggesting a category.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

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
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? uniqueCategories.find(
                                  (cat) => cat === field.value
                                )
                              : "Select a category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {uniqueCategories.map((cat) => (
                                <CommandItem
                                  value={cat}
                                  key={cat}
                                  onSelect={() => {
                                    form.setValue("category", cat);
                                    setComboboxOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      cat === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {cat}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                     <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSuggestCategory}
                      disabled={isSuggesting}
                      title="Suggest Category with AI"
                    >
                      {isSuggesting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    </Button>
                  </div>
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
