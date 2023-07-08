import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-chart',
  templateUrl: './stat-chart.component.html',
  styleUrls: ['./stat-chart.component.css']
})
export class StatChartComponent {
  chartOptions = {
    responsive: true
  };
  chartLabels: string[] = [];
  chartData: number[] = [];

  @Input() dataset!: any[];

  constructor() { }

  initData() {
    let dailyReports = [
      { day: 'Lundi', quantity: 0 },
      { day: 'Mardi', quantity: 0 },
      { day: 'Mercredi', quantity: 0 },
      { day: 'Jeudi', quantity: 0 },
      { day: 'Vendredi', quantity: 0 },
      { day: 'Samedi', quantity: 0 },
      { day: 'Dimanche', quantity: 0 },
    ];

    this.dataset.forEach((data, i) => {
      dailyReports[i] = { ...dailyReports[i], quantity: data }
    })

    this.chartLabels = dailyReports.map(report => report.day);
    this.chartData = dailyReports.map(report => report.quantity);
  }

  ngOnInit() {
    this.initData();
  }
}
