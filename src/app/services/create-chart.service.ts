import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import {DoughnutController} from 'chart.js/auto';
import { Expense } from '../types/expense.model';


// Register the controller and necessary elements/plugins
Chart.register(DoughnutController);

@Injectable({
  providedIn: 'root'
})
export class CreateChartService {
  chart: Chart | undefined;

  constructor() { }



 private unifyData(data:Expense[]){
  let d_array:Expense[]=[];
  data.forEach(e => {
    let existing = d_array.find(d => d.item === e.item && d.type === e.type);
    if(existing) {
      existing.amt += e.amt;
    } else {
      d_array.push({ ...e });
    }
  });

  return d_array;
}

renderChart(data:Expense[], chartRef: HTMLCanvasElement) {
     const chart_data = {
            labels: this.unifyData(data).map((e) => e.item),
            datasets: [
              {
                label: 'Expenses',
                data: this.unifyData(data).map((e) => e.amt),
                backgroundColor: this.unifyData(data).map((e) => e.bgColor),
                hoverOffset: 6,
              },
            ],
          };
    
    
          const config: ChartConfiguration<'doughnut', number[], string> = {
            type: 'doughnut',
            data: chart_data,
            options: {
              responsive: true,
              devicePixelRatio: 2, // higher = sharper
              maintainAspectRatio: false, // allows flexible resizing
              spacing: 3, // space between segments
              plugins: {
                legend: {
                  position: 'top',
                  labels:{
                    color: '#fff',
                    font: {
                      family: 'Arial',   // Font family
                      size: 16,          // Font size
                      style: 'italic',   // Normal, bold, italic
                      weight: 'bold'     // Font weight
                    }
                  }
                },
              },
            },
          };
    
          if(this.chart) {
            this.chart.destroy(); // Destroy previous chart instance before creating a new one
          }
    
          if (chartRef) {
            this.chart = new Chart(chartRef, config);
            // Trigger re-render
            this.chart.update();
          }
}
}