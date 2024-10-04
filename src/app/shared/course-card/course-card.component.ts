import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Course } from 'src/app/school/courses/course';
import { CourseDeletePopupComponent } from 'src/app/school/courses/course-delete-popup/course-delete-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { slugify } from 'src/app/services/utilities.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent {
  @Input() title: string;
  @Input() course: Course;

  constructor(
    public authService: AuthService,
    private courseService: CourseService,
    private dialogDeleteRef: MatDialog,
    private router: Router
  ) {}

  parseUrl(url: string) {
    return encodeURIComponent(url);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr as User;
    return this.courseService.canEditCourse(user, course);
  }

  openCourseDeleteDialog(courseId: any): void {
    this.dialogDeleteRef.open(CourseDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        courseId,
        history: this.router.url,
      },
    });
  }

  downloadCoursePdf(courseId: number): void {
    this.courseService.downloadPdf(courseId).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificat_de_fin_de_parcours_${this.course.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }
}
