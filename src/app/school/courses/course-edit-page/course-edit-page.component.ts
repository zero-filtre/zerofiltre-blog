import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, Observable, Subject, throwError, tap, switchMap } from 'rxjs';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { File } from 'src/app/articles/article.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-edit-page',
  templateUrl: './course-edit-page.component.html',
  styleUrls: ['./course-edit-page.component.css']
})
export class CourseEditPageComponent implements OnInit {
  public file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  course$: Observable<Course>;
  courseID!: string;

  form!: FormGroup;

  isLoading: boolean;
  isSaving: boolean;
  uploading: boolean;

  private TitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private ThumbnailText$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private messageService: MessageService,
    private navigate: NavigationService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.course$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.courseID = params.get('course_id');
        return this.getCourse();;
      })
    );
  }

  getCourse(): Observable<any> {
    return this.courseService.findCourseById(this.courseID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.messageService.openSnackBarError("Oops ce cours est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap(data => this.initForm(data))
      )
  }

  updateCourse() {
    this.isSaving = true;
    this.courseService.updateCourse(this.form.value)
      .subscribe({
        next: (_res: Course) => {
          this.isSaving = false;
          this.messageService.openSnackBarSuccess('Enregistrement réussie !', '');
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
          this.messageService.openSnackBarError('Une erreur est survenue lors de la sauvegarde', 'OK')
        }
      })
  }

  updateCourseCoverImage() {
    const course = { id: this.courseID, thumbnail: this.thumbnail.value }
    this.courseService.updateCourse(course)
      .subscribe({
        next: (_res: Course) => {
          this.messageService.openSnackBarSuccess('Succes !', '');
        },
        error: (_error: HttpErrorResponse) => {
          this.messageService.openSnackBarError("Une erreur est survenue lors de la mise à jour de l'image", 'OK')
        }
      })
  }

  initForm(course: Course) {
    const courseSummaryTemplate = 'Un petit resume du cours ici';
    const courseSummary = course.summary || courseSummaryTemplate;

    this.form = this.fb.group({
      id: [course.id!],
      title: [course.title, [Validators.required]],
      summary: [courseSummary, [Validators.required]],
      thumbnail: [course.thumbnail],
    })
  }

  get title() { return this.form.get('title'); }
  get summary() { return this.form.get('summary'); }
  get thumbnail() { return this.form.get('thumbnail'); }

  getValue(event: Event): string {
    event.preventDefault();
    return (event.target as HTMLTextAreaElement).value
  }

  typeInTitle(content: string) {
    this.TitleText$.next(content);
  }
  typeInSummary(content: string) {
    this.SummaryText$.next(content);
  }
  typeInThumbnail(content: string) {
    this.ThumbnailText$.next(content);
  }

  onFileSelected(event: any) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };

    this.uploadCoverImage();
  }

  uploadCoverImage() {
    this.uploading = true;
    this.fileUploadService.uploadFile(this.file)
      .pipe(catchError(err => {
        this.uploading = false;
        return throwError(() => err.message);
      }))
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.uploading = false;
          this.thumbnail?.setValue(event.url);
          this.updateCourseCoverImage();
        }
      })
  }

  removeCoverImage() {
    this.uploading = true;
    this.fileUploadService.deleteFile(this.thumbnail as any, this.ThumbnailText$)
      .pipe(catchError(err => {
        this.uploading = false;
        return throwError(() => err.message);
      }))
      .subscribe(() => {
        this.uploading = false;
        this.thumbnail?.setValue('');
        this.updateCourseCoverImage();
      })
  }

}
