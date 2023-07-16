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

  chartDataPrevWeek: number[] = [];
  chartDataCurrWeek: number[] = [];
  
  chartLabels: string[] = [];
  chartDataArray: any[] = [];

  @Input() dataset!: any;

  constructor() { }

  initData() {
    const { prevWeek, currWeek } = this.dataset;

    this.chartLabels = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    this.chartDataPrevWeek = prevWeek.map(obj => Object.values(obj)[0]);
    this.chartDataCurrWeek = currWeek.map(obj => Object.values(obj)[0]);

    if (prevWeek.length) {
      this.chartDataArray = [
        ...this.chartDataArray,
        { data: this.chartDataPrevWeek, label: 'La semaine précedente', backgroundColor: '#FFB1C1', },
        { data: this.chartDataCurrWeek, label: 'Cette semaine', backgroundColor: '#9BD0F5', },
      ]
    } else {
      this.chartDataArray = [
        ...this.chartDataArray,
        { data: this.chartDataCurrWeek, label: 'Cette semaine', backgroundColor: '#9BD0F5', },
      ]
    }

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
