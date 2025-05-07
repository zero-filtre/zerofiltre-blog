import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats = [
    { title: 'Total Courses', subtitle: 'Active courses', value: '24', icon: 'school' },
    { title: 'Total Articles', subtitle: 'Published articles', value: '156', icon: 'article' },
    { title: 'Companies', subtitle: 'Registered companies', value: '45', icon: 'business' },
    { title: 'Users', subtitle: 'Active users', value: '1,234', icon: 'people' },
    { title: 'Students', subtitle: 'Enrolled students', value: '892', icon: 'person' },
    { title: 'Revenue', subtitle: 'This month', value: '$45,678', icon: 'attach_money' }
  ];
}
