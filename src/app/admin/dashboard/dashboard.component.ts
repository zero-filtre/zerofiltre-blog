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

  cards = [
    {
      title: 'Articles',
      description: 'Total des articles publiés',
      link: '/user/dashboard/admin',
      linkText: 'Voir les articles',
      iconBgClass: 'bg-primary-500 bg-opacity-20 text-primary-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" /></svg>',
      getValue: () => this.stats?.articles,
    },
    {
      title: 'Formations',
      description: 'Total des formations disponibles',
      link: '/user/dashboard/courses/all',
      linkText: 'Voir les formations',
      iconBgClass: 'bg-accent-100 text-accent-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
      getValue: () => this.stats?.courses,
    },
    {
      title: 'Organisations',
      description: 'Total des organisations',
      link: '/admin/companies',
      linkText: 'Voir les organisations',
      iconBgClass: 'bg-secondary bg-opacity-10 text-secondary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
      getValue: () => this.stats?.organizations,
    },
  ];

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
