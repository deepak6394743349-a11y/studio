'use client';

import { useState, useMemo, type Dispatch } from 'react';
import type { Action, Expense } from '@/lib/types';
import { format, isToday, isThisMonth, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, TrendingUp, Infinity } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExpenseListProps {
  expenses: Expense[];
  dispatch: Dispatch<Action>;
}

export function ExpenseList({ expenses, dispatch }: ExpenseListProps) {
  const [activeTab, setActiveTab] = useState('today');

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    switch (activeTab) {
      case 'month':
        return expenses.filter((e) => isThisMonth(parseISO(e.date)));
      case 'all':
        return expenses;
      case 'today':
      default:
        return expenses.filter((e) => isToday(parseISO(e.date)));
    }
  }, [expenses, activeTab]);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: { id } });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  const ExpenseTable = ({ items }: { items: Expense[] }) => (
    <ScrollArea className="h-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                <TableCell>{format(parseISO(expense.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                <TableCell className="text-right">
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
                          This action cannot be undone. This will permanently delete this expense.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(expense.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No expenses for this period.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today"><Calendar/>Today</TabsTrigger>
            <TabsTrigger value="month"><TrendingUp/>This Month</TabsTrigger>
            <TabsTrigger value="all"><Infinity/>All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <ExpenseTable items={filteredExpenses} />
          </TabsContent>
          <TabsContent value="month">
            <ExpenseTable items={filteredExpenses} />
          </TabsContent>
          <TabsContent value="all">
            <ExpenseTable items={filteredExpenses} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
