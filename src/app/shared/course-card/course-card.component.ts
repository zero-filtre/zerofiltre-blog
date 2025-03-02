import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Course } from '../../school/courses/course';
import { CourseDeletePopupComponent } from '../../school/courses/course-delete-popup/course-delete-popup.component';
import { CourseService } from '../../school/courses/course.service';
import { AuthService } from '../../user/auth.service';
import { User } from '../../user/user.model';
import { CompanySearchPopupComponent } from '../../admin/features/companies/company-search-popup/company-search-popup.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent {
  @Input() title: string;
  @Input() canDownloadCertificate = false;
  @Input() course: Course;

  constructor(
    public authService: AuthService,
    private courseService: CourseService,
    private dialogDeleteRef: MatDialog,
    private router: Router,
    private messageService: MessageService
  ) {}

  parseUrl(url: string) {
    return encodeURIComponent(url);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr as User;
    return this.courseService.canEditCourse(user, course);
  }

  canLinkCourseToCompany() {
    return this.authService.canAccessAdminDashboard;
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

  openCompanySearchPopup(course: Course): void {
    this.dialogDeleteRef
      .open(CompanySearchPopupComponent, {
        panelClass: 'popup-search',
        disableClose: false,
        minHeight: '400px',
        width: '700px',
        data: { course: course },
      })
      .afterClosed()
      .subscribe((message) => {
        debugger
        if (message) {
          this.messageService.openSnackBarSuccess(message, '');
        }
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
