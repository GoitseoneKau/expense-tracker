import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ExpenseTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Expense-Tracker';
}
