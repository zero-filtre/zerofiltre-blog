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
  chartDataPrevWeek: number[] = [];
  chartDataCurrWeek: number[] = [];

  @Input() dataset!: any;

  constructor() { }

  initData() {
    let dailyReportPrevWeek = [];
    let dailyReportCurrWeek = [];
    const { prevWeek, currWeek } = this.dataset;

    const pureData1 = this.parseData(prevWeek)
    const pureData2 = this.parseData(currWeek)

    pureData1.forEach((data: any) => {
      dailyReportPrevWeek = [...dailyReportPrevWeek, { day: Object.keys(data)[0], quantity: Object.values(data)[0]}] 
    })

    pureData2.forEach((data: any) => {
      dailyReportCurrWeek = [...dailyReportCurrWeek, { day: Object.keys(data)[0], quantity: Object.values(data)[0] }]
    })

    this.chartLabels = dailyReportCurrWeek.map(report => report.day);
    this.chartDataPrevWeek = dailyReportPrevWeek.map(report => report.quantity);
    this.chartDataCurrWeek = dailyReportCurrWeek.map(report => report.quantity);
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
