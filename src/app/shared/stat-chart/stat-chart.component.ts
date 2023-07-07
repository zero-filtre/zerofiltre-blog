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
      { day: 'Lundi', quantity: 50 },
      { day: 'Mardi', quantity: 60 },
      { day: 'Mercredi', quantity: 45 },
      { day: 'Jeudi', quantity: 55 },
      { day: 'Vendredi', quantity: 75 },
      { day: 'Samedi', quantity: 80 },
      { day: 'Dimanche', quantity: 90 },
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
