import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'src/app/school/courses/course';
import { CourseService } from 'src/app/school/courses/course.service';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['./course-list-item.component.css']
})
export class CourseListItemComponent {
  @Input() course: Course;
  @Input() gridItem: boolean;
  @Output() openDialogEvent = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    private readonly courseService: CourseService
  ) { }

  canAccessCourse(course: Course) {
    const user = this.authService?.currentUsr
    return this.courseService.canAccessCourse(user, course);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr
    return this.courseService.canEditCourse(user, course);
  }

  openDeleteDialog(id: any) {
    this.openDialogEvent.emit(id);
  }
}
