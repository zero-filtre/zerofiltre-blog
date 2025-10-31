import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { CourseInfosService } from 'src/app/school/courses/course-infos.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
  @Input() title: string;
  @Input() canDownloadCertificate = false;
  @Input() course: Course;
  @Input() companyId: string;
  @Output() onCourseDeleteEvent = new EventEmitter<any>();

  exclusiveCourse!: boolean;
  canLinkCourseToCompany!: boolean;
  canUnlinkCourseFromCompany!: boolean;
  canManageCourse!: boolean;
  test!: string;

  constructor(
    public authService: AuthService,
    private readonly courseService: CourseService,
    private readonly dialogDeleteRef: MatDialog,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly companyService: CompanyService,
    private readonly courseInfosService: CourseInfosService
  ) {}

  ngOnInit(): void {
    console.log('CourseCardComponent');
    this.exclusiveCourse = this.course.exclusive;
    this.canLinkCourseToCompany = this.checkLinkCourseToCompany();
    this.canUnlinkCourseFromCompany = this.checkUnLinkCourseFromCompany();
    this.canManageCourse = this.checkManageCourse();
    console.log('  - this.companyId =', this.companyId);
    console.log('  - this.exclusiveCourse =', this.exclusiveCourse);
  }

  checkLinkCourseToCompany() {
    return this.authService.canAccessAdminDashboard && !this.companyId;
  }

  checkUnLinkCourseFromCompany() {
    if(this.companyId && !this.exclusiveCourse && this.isPublishedCourse() && this.isAdminOrCompanyAdmin()) {
        return true;
    }

    return false;
  }

  isDraftOrInReviewCourse() {
    return this.course.status === 'DRAFT' || this.course.status === 'IN_REVIEW';
  }

  isPublishedCourse() {
    return this.course.status === 'PUBLISHED';
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

  isAdminOrAuthor() {
    return (this.authService.isAdmin || this.authService?.currentUsr.id === this.course.author.id);
  }

  isAdminOrCompanyAdmin() {
    return (this.authService.isAdmin || this.authService?.adminInCompany(+this.companyId));
  }

  isAdminOrCompanyAdminOrEditor() {
    return (this.authService.isAdmin || this.authService?.adminInCompany(+this.companyId) || this.authService?.editorInCompany(+this.companyId));
  }

  checkManageCourse() {
    if(!this.companyId && this.isPublishedCourse() && this.isAdmin()) {
        return true;
    }
    if(!this.companyId && this.isDraftOrInReviewCourse() && this.isAdminOrAuthor()) {
        return true;
    }

    if(this.companyId && this.exclusiveCourse && this.isPublishedCourse() && this.isAdminOrCompanyAdmin()) {
        return true;
    }
    if(this.companyId && this.exclusiveCourse && this.isDraftOrInReviewCourse() && this.isAdminOrCompanyAdminOrEditor()) {
        return true;
    }

    return false;
  }

  saveCourseInfos() {
    if(this.isAdmin) this.courseInfosService.setAdmin(true);
    if(!this.isAdmin) this.courseInfosService.setUserCompanyRole(this.authService.getUserRoleInCompany(+this.companyId));

    if(this.exclusiveCourse) this.courseInfosService.setExclusiveCourse(this.exclusiveCourse);

    this.courseInfosService.setCompanyId(this.companyId);
    this.courseInfosService.setModeEditCourse(this.canManageCourse);
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
