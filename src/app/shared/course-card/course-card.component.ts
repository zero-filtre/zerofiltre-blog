import { Component, Input } from '@angular/core';
import { Course } from 'src/app/school/courses/course';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {

  @Input() title: string;
  @Input() course: Course;

  constructor(
    public authService: AuthService,
  ) { }

}
