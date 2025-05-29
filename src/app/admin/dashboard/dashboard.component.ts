import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.loading = true;
    this.statsService.getGlobalStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
        this.loading = false;
      },
    });
  }
}
