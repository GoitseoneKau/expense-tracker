import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Expense } from '../types/expense.model';
import { computed } from '@angular/core';

type ExpenseSearchState ={
    expenses: Expense[];
    totalIncome: number;
    totalExpense: number;
}

const initialState: ExpenseSearchState = {
  expenses: [
    { item: 'Salary', amt: 10000, type: 'Income',bgColor: 'hsl(197, 70%, 50%)' },
    { item: 'Bank Charge', amt: 200, type: 'Expense',bgColor: 'hsl(0, 70%, 50%)' },
    { item: 'Gift-Sarah', amt: 850, type: 'Income',bgColor: 'hsl(98, 70%, 50%)' },
    { item: 'Monthly Bread Charge', amt: 350, type: 'Expense',bgColor: 'hsl(44, 70%, 50%)' },
  ],
    totalIncome: 0,
    totalExpense: 0,
};

export const ExpenseStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((state) => ({

        totalSumIncome: computed(()=>state.expenses()
            .filter((e) => e.type === 'Income')
            .reduce((sum, e) => sum + e.amt, 0)),

        totalSumExpense: computed(()=>state.expenses()
            .filter((e) => e.type === 'Expense')
            .reduce((sum, e) => sum + e.amt, 0)),

        NetBalance : computed(() => state.expenses()
            .reduce((balance, e) => e.type === 'Income' ? balance + e.amt : balance - e.amt, 0)),
    })),
    withMethods((store) => ({
        addExpense(expense: Expense) {
            patchState(store,(state)=>({expenses: [...state.expenses, expense]}));
        }
    }))
);
