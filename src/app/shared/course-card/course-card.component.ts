import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Course } from '../../school/courses/course';
import { CourseDeletePopupComponent } from '../../school/courses/course-delete-popup/course-delete-popup.component';
import { CourseService } from '../../school/courses/course.service';
import { AuthService } from '../../user/auth.service';
import { CompanySearchPopupComponent } from '../../admin/features/companies/company-search-popup/company-search-popup.component';
import { MessageService } from '../../services/message.service';
import { CompanyService } from 'src/app/admin/features/companies/company.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent {
  @Input() title: string;
  @Input() canDownloadCertificate = false;
  @Input() course: Course;
  @Input() companyId: string;
  @Output() onCourseDeleteEvent = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    private readonly courseService: CourseService,
    private readonly dialogDeleteRef: MatDialog,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly companyService: CompanyService
  ) {}

  parseUrl(url: string) {
    return encodeURIComponent(url);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr;
    return (
      this.courseService.canEditCourse(user, course) ||
      this.canManageCompany() ||
      this.canEditCompanyCourses()
    );
  }

  canDeleteCourse(course: Course) {
    const user = this.authService?.currentUsr;
    return (
      this.courseService.canEditCourse(user, course) || this.authService.isAdmin || this.canManageCompany() || this.canEditCompanyCourses()
    );
  }

  canLinkCourseToCompany() {
    return this.authService.canAccessAdminDashboard && !this.companyId;
  }

  canUnLinkCourseFromCompany() {
    return this.canManageCompany() && this.companyId;
  }

  canManageCompany() {
    return this.authService.canManageCompany(+this.companyId);
  }

  canEditCompanyCourses() {
    return this.authService.canEditCompanyCourses(+this.companyId);
  }

  fetchAllCourses() {
    this.onCourseDeleteEvent.emit();
  }

  unlinkCourseFromCompany(): void {
    const bodyData = { courseId: this.course.id, companyId: this.companyId };

    this.companyService
      .unLinkCourseFromCompany(bodyData)
      .pipe(
        catchError((err) => {
          return throwError(() => err?.message);
        })
      )
      .subscribe((message: string) => {
        this.fetchAllCourses();
        this.messageService.openSnackBarSuccess(
          message || "Le cours a été retiré de l'organisation avec succès !",
          'OK'
        );
      });
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

  openCompanySearchPopup(course: Course, dataType: 'Company'): void {
    this.dialogDeleteRef
      .open(CompanySearchPopupComponent, {
        panelClass: 'popup-search',
        disableClose: false,
        minHeight: '400px',
        width: '700px',
        data: {
          course: course,
          dataType: dataType,
        },
      })
      .afterClosed()
      .subscribe((message) => {
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
