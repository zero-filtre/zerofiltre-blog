import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { CourseService } from '../course.service';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';
import { CompanyService } from '../../../admin/features/companies/company.service'
import { Company } from 'src/app/admin/features/companies/company.model';

@Component({
  selector: 'app-course-init-popup',
  templateUrl: './course-init-popup.component.html',
  styleUrls: ['./course-init-popup.component.css']
})
export class CourseInitPopupComponent implements OnInit {
  public title: string = '';
  public selectedCompany: string | null
  public companies$: Observable<any[]>;
  public loading: boolean = false;
  public course!: any;

  constructor(
    public dialogRef: MatDialogRef<CourseInitPopupComponent>,
    private router: Router,
    private courseService: CourseService,
    private companyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private slugify: SlugUrlPipe
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleCourseInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;

    this.courseService.initCourse(this.title, this.selectedCompany)
      .pipe(catchError(err => {
        this.loading = false
        return throwError(() => err)
      }))
      .subscribe(course => {
        this.dialogRef.close();
        this.loading = false;
        this.router.navigateByUrl(`/cours/${this.slugify.transform(course)}/edit`)
      });

  }

  fecthCompanies() {
    this.companies$ = this.companyService.getCompanies(0, 100)
      .pipe(
        catchError(err => {
          return EMPTY
        }),
        map(({ content }: any) => content as Company[])
    )
  }

  ngOnInit(): void {
    this.fecthCompanies();
  }

}
