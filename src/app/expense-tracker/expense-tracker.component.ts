import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgModel, FormsModule } from '@angular/forms';
import Chart, { DoughnutController } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [FormsModule, NgFor,NgIf],
  templateUrl: './expense-tracker.component.html',
  styleUrl: './expense-tracker.component.css',
})
export class ExpenseTrackerComponent {
  @ViewChild('acquisitions') acquisitionsChart!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  item = signal('');
  amount = signal(null);
  expenseType = signal('');
  expenses = signal<any[]>([
    { item: 'Salary', amt: 10000, type: 'Income',bgColor: 'hsl(197, 70%, 50%)' },
    { item: 'Bank Charge', amt: 200, type: 'Expense',bgColor: 'hsl(0, 70%, 50%)' },
  ]);

  totalIncome = computed(() =>
    this.expenses()
      .filter((e) => e.type === 'Income')
      .reduce((sum, e) => sum + e.amt, 0),
  );

  totalExpense = computed(() =>
    this.expenses()
      .filter((e) => e.type === 'Expense')
      .reduce((sum, e) => sum + e.amt, 0),
  );

  NetBalance = computed(
    () => this.totalIncome() - this.totalExpense(),
  );

  

  constructor() {
     effect(() => {
      const data = {
        labels: this.expenses().map((e) => e.item),
        datasets: [
          {
            label: 'Expenses',
            data: this.expenses().map((e) => e.amt),
            backgroundColor: this.expenses().map((e) =>
             e.bgColor || this.generateRandomBrightColor(),
            ),
            hoverOffset: 6,
          },
        ],
      };


      const config: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          devicePixelRatio: 2, // higher = sharper
          maintainAspectRatio: false, // allows flexible resizing
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      };

      if(this.chart) {
        this.chart.destroy(); // Destroy previous chart instance before creating a new one
      }

      if (this.acquisitionsChart) {
        const el = this.acquisitionsChart.nativeElement as HTMLCanvasElement;
        this.chart = new Chart(el, config);
        // Trigger re-render
        this.chart.update();
      }
    });
  }

 
  Add() {

        let color  = this.generateRandomBrightColor();
    while( this.expenses().includes(color)) {
      color  = this.generateRandomBrightColor();
    }

    let expenseList = {
      item: this.item(),
      amt: this.amount(),
      type: this.expenseType(),
      bgColor: this.generateRandomBrightColor(),
    };
    this.expenses.update((expenses) => [...expenses, expenseList]);

  }

  generateRandomBrightColor() {
    // Hue: 0-360 (all colors)
    const hue = Math.floor(Math.random() * 360);

    // Saturation: 70-90% (high saturation makes it vivid)
    const saturation = Math.floor(Math.random() * 20) + 70;

    // Lightness: 40-50% (avoids pure black (<40) and pure white (>80))
    const lightness = Math.floor(Math.random() *10) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
