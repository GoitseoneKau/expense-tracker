import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgModel, FormsModule } from '@angular/forms';
import { ExpenseStore } from '../expense-store/expense.store';
import { CreateChartService } from '../services/create-chart.service';
import { Expense } from '../types/expense.model';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './expense-tracker.component.html',
  styleUrl: './expense-tracker.component.css',
})
export class ExpenseTrackerComponent {
  @ViewChild('acquisitions') acquisitionsChart!: ElementRef<HTMLCanvasElement>;

  item = signal('');
  amount = signal(null);
  expenseType = signal<'Income' | 'Expense'>('Income');

  readonly expenseStore = inject(ExpenseStore);
  private ChartService = inject(CreateChartService);

  constructor() {
    effect(() => {
      this.ChartService.renderChart(
        this.expenseStore.expenses(),
        this.acquisitionsChart.nativeElement,
      );
    });
  }

  Add(data:Expense[]) {
    if (data.some((e) => e.item === this.item() && e.type === this.expenseType())) {
      
      this.expenseStore.addExpense({
        item: this.item(),
        amt: this.amount()!,
        type: this.expenseType(),
        bgColor: data
          .find((e) => e.item === this.item() && e.type === this.expenseType())!
          .bgColor,
      });

    } else {

      this.expenseStore.addExpense({
        item: this.item(),
        amt: this.amount()!,
        type: this.expenseType(),
        bgColor: this.generateUniqueColor(),
      });

    }

    this.item.set('');
    this.amount.set(null);
  }

  generateUniqueColor() {
    let color = this.generateRandomBrightColor();

    while (this.expenseStore.expenses().some((exp) => exp.bgColor === color)) {
      color = this.generateRandomBrightColor();
    }

    return color;
  }

  generateRandomBrightColor() {
    // Hue: 0-360 (all colors)
    const hue = Math.floor(Math.random() * 360);

    // Saturation: 70-90% (high saturation makes it vivid)
    const saturation = Math.floor(Math.random() * 20) + 70;

    // Lightness: 40-50% (avoids pure black (<40) and pure white (>80))
    const lightness = Math.floor(Math.random() * 10) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
