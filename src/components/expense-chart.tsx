'use client';

import { useMemo } from 'react';
import { isThisMonth, parseISO } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ExpenseChartProps {
  expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const monthlyData = useMemo(() => {
    const monthExpenses = expenses.filter((e) => isThisMonth(parseISO(e.date)));
    if (monthExpenses.length === 0) return [];
    
    const spendingByCategory = monthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(spendingByCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--primary))",
    },
  };
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);


  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month's Spending</CardTitle>
        <CardDescription>Breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value as number)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-64 w-full items-center justify-center">
            <p className="text-muted-foreground">No spending data for this month yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
