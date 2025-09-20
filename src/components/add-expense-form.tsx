'use client';

import { useState, useMemo, type Dispatch } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { categorizeExpense } from '@/ai/flows/categorize-expense';
import type { Action, Expense } from '@/lib/types';
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

const STATIC_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

interface AddExpenseFormProps {
  dispatch: Dispatch<Action>;
  expenses: Expense[];
}

export function AddExpenseForm({ dispatch, expenses }: AddExpenseFormProps) {
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      category: '',
    },
  });

  const allCategories = useMemo(() => {
    const existingCategories = Array.from(new Set(expenses.map(e => e.category)));
    return Array.from(new Set([...STATIC_CATEGORIES, ...aiSuggestions, ...existingCategories]));
  }, [aiSuggestions, expenses]);

  const handleDescriptionBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const description = e.target.value;
    if (!description || description.length < 3) {
      setAiSuggestions([]);
      return;
    }
    setIsCategorizing(true);
    form.setValue('category', '');
    try {
      const result = await categorizeExpense({ description });
      const suggestions = result.categorySuggestions || [];
      setAiSuggestions(suggestions);
      if (suggestions.length > 0) {
        form.setValue('category', suggestions[0], { shouldValidate: true });
      }
    } catch (error) {
      console.error('AI categorization failed', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not get category suggestions.',
      });
    } finally {
      setIsCategorizing(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch({ type: 'ADD_EXPENSE', payload: values });
    form.reset();
    setAiSuggestions([]);
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
                    <Input placeholder="e.g., Coffee with a friend" {...field} onBlur={handleDescriptionBlur} />
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
                    <Input type="number" placeholder="15.00" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isCategorizing}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isCategorizing ? 'AI is thinking...' : 'Select a category'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
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
