import { Component } from '@angular/core';

@Component({
  selector: 'app-course-detail-summary',
  templateUrl: './course-detail-summary.component.html',
  styleUrls: ['./course-detail-summary.component.css']
})
export class CourseDetailSummaryComponent {
  enrolled = false;
  course = {
    modules: 6,
    topics: 26,
    quizzes: 1,
    free: true,
  };
}
