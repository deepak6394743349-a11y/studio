'use server';

/**
 * @fileOverview AI-powered expense categorization flow.
 *
 * This file defines a Genkit flow that suggests expense categories based on a user-provided expense description.
 * It exports:
 * - `categorizeExpense`: The main function to trigger the categorization flow.
 * - `CategorizeExpenseInput`: The input type for the `categorizeExpense` function.
 * - `CategorizeExpenseOutput`: The output type for the `categorizeExpense` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  description: z.string().describe('The description of the expense.'),
});

export type CategorizeExpenseInput = z.infer<typeof CategorizeExpenseInputSchema>;

const CategorizeExpenseOutputSchema = z.object({
  categorySuggestions: z
    .array(z.string())
    .describe('An array of suggested expense categories.'),
});

export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;

export async function categorizeExpense(input: CategorizeExpenseInput): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `Suggest expense categories for the following expense description:\n\nDescription: {{{description}}}\n\nCategories:`, 
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
