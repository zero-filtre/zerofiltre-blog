import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-chart',
  templateUrl: './stat-chart.component.html',
  styleUrls: ['./stat-chart.component.css']
})
export class StatChartComponent {
  chartOptions = {
    responsive: true,
  };

  chartLabels: string[] = [];
  chartData: number[] = [];

  @Input() dataset!: any;

  constructor() { }

  initData() {
    let dailyReports = [];
    const { prevWeek, currWeek } = this.dataset;

    const pureData1 = this.parseData(currWeek)
    const pureData2 = this.parseData(prevWeek)

    pureData1.forEach((data: any) => {
      dailyReports = [...dailyReports, { day: Object.keys(data)[0], quantity: Object.values(data)[0]}] 
    })

    this.chartLabels = dailyReports.map(report => report.day);
    this.chartData = dailyReports.map(report => report.quantity);
  }

  parseData(data: any) {
    return data.map(data => {
      const dateStr = Object.keys(data)[0];
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const weekday = date.toLocaleDateString('fr-FR', options);
      const newData = { [weekday[0].toUpperCase() + weekday.slice(1)]: Object.values(data)[0] }
      return newData
    })
  }

  ngOnInit() {
    this.initData();
  }
}
