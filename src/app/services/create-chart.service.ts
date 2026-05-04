import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { DoughnutController } from 'chart.js/auto';
import { Expense } from '../types/expense.model';


// Register the controller and necessary elements/plugins
Chart.register(DoughnutController);

@Injectable({
  providedIn: 'root'
})
export class CreateChartService {
  chart: Chart | undefined;

  constructor() { }

  private unifyData(data: Expense[]) {
    let d_array: Expense[] = [];
    data.forEach(e => {
      let existing = d_array.find(d => d.item === e.item && d.type === e.type);
      if (existing) {
        existing.amt += e.amt;
      } else {
        d_array.push({ ...e });
      }
    });

    return d_array;
  }

  renderChart(data: Expense[], chartRef: HTMLCanvasElement) {
    const chart_data = {
      labels: [...new Set(this.unifyData(data).map(e => e.item))], // Unique items as labels
      datasets: [
        {
          label: 'Expenses',
          data: this.unifyData(data).filter((e) => e.type === 'Expense').map((e) => e.amt),
          backgroundColor: this.unifyData(data).filter((e) => e.type === 'Expense').map((e) => e.bgColor),
          hoverOffset: 6,
        },
        {
          label: 'Income',
          data: this.unifyData(data).filter((e) => e.type === 'Income').map((e) => e.amt),
          backgroundColor: this.unifyData(data).filter((e) => e.type === 'Income').map((e) => e.bgColor),
          hoverOffset: 6,
        }
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
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const datasetLabel = context.dataset.label || '';
                const label = context.label || '';
                const value = context.raw;
                return `${datasetLabel} - ${label}: ${value}`;
              }
            }
          },
          title: { text: 'Expense vs Income', display: true, color: '#fff', font: { size: 18, weight: 'bold' } },
          legend: {
            position: 'top',
            labels: {
              color: '#fff',
              font: {
                family: 'Arial',   // Font family
                size: 14,          // Font size
                style: 'italic',   // Normal, bold, italic
                weight: 'bold'     // Font weight
              },
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return datasets.flatMap((ds, i) =>
                  ds.data.map((value, j) => {
                    const bgColor = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[j] : ds.backgroundColor;
                    return {
                      text: `${ds.label}: ${chart.data.labels![j]}`, // e.g. "Expenses: Rent"
                      fillStyle: bgColor,
                      strokeStyle: bgColor,
                      fontColor: '#fff',
                      hidden: false,
                      datasetIndex: i
                    };
                  })
                );
              },
            },
          },
        },
      },
    };

    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance before creating a new one
    }

    if (chartRef) {
      this.chart = new Chart(chartRef, config);
      // Trigger re-render
      this.chart.update();
    }
  }
}