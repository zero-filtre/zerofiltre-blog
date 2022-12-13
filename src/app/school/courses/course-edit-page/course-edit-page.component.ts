import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, Subject, throwError, tap, switchMap } from 'rxjs';
import { Course, Section } from '../course';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { File } from 'src/app/articles/article.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseSectionEditComponent } from '../course-section-edit/course-section-edit.component';
import { MatDialog } from '@angular/material/dialog';

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
  course: Course;

  form!: FormGroup;

  isLoading: boolean;
  isSaving: boolean;
  uploading: boolean;

  private TitleText$ = new Subject<string>();
  private SubTitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private ThumbnailText$ = new Subject<string>();
  private VideoText$ = new Subject<string>();
  private SectionsText$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private messageService: MessageService,
    private navigate: NavigationService,
    private fileService: FileUploadService,
    private dialogSectionRef: MatDialog
  ) { }

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
        tap(data => {
          this.initForm(data);
          this.course = data;
        })
      )
  }

  updateCourse() {
    this.isSaving = true;
    this.courseService.updateCourse(this.form.value)
      .subscribe({
        next: (_res: Course) => {
          setTimeout(() => {
            this.isSaving = false;
            this.messageService.openSnackBarSuccess('Enregistrement réussi !', '');
          }, 1000);
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
          this.messageService.openSnackBarError('Une erreur est survenue lors de la sauvegarde', 'OK')
        }
      })
  }

  updateImageValue() {
    const course = { ...this.course, thumbnail: this.thumbnail.value };
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
      id: [course.id],
      title: [course.title, [Validators.required]],
      subTitle: [course.subTitle],
      summary: [courseSummary, [Validators.required]],
      thumbnail: [course.thumbnail],
      video: [course.video],
      sections: this.fb.array(this.loadFormSections(course))
    })
  }

  isArray(obj: any) {
    return obj?.hasOwnProperty('length');
  }
  loadFormSections(course: Course) {
    if (!this.isArray(course.sections)) return [];
    return course.sections.map(section => this.buildSectionItem(section));
  }
  buildSectionItem(section: Section): FormGroup {
    return new FormGroup({
      position: new FormControl(section.position),
      title: new FormControl(section.title),
      content: new FormControl(section.content),
      image: new FormControl(section.image),
    });
  }

  get title() { return this.form.get('title'); }
  get subTitle() { return this.form.get('subTitle'); }
  get summary() { return this.form.get('summary'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get video() { return this.form.get('video'); }
  get sections() { return this.form.get('sections') as FormArray; }

  getValue(event: Event): string {
    event.preventDefault();
    return (event.target as HTMLTextAreaElement).value
  }
  typeInTitle(content: string) {
    this.TitleText$.next(content);
  }
  typeInSubTitle(content: string) {
    this.SubTitleText$.next(content);
  }
  typeInSummary(content: string) {
    this.SummaryText$.next(content);
  }
  typeInThumbnail(content: string) {
    this.ThumbnailText$.next(content);
  }
  typeInVideo(content: string) {
    this.VideoText$.next(content);
  }
  typeInSections() {
    this.SectionsText$.next(this.sections.value);
  }

  addSection(section: Section, prevPos: string) {
    const existingIndex = this.sections.value.findIndex((sect: Section) => sect.position == prevPos);

    if (existingIndex >= 0) {
      this.removeSection(existingIndex);
    }

    const sectionItem = this.fb.group({
      position: section.position,
      title: section.title,
      content: section.content,
      image: section.image,
    })

    this.sections.push(sectionItem)
    this.messageService.openSnackBarSuccess('Section ajoutée!', 'OK');
    this.typeInSections();
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
    this.typeInSections();
  }

  onFileSelected(event: any) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };
  }

  uploadImage(event: any, imageField: any) {
    this.onFileSelected(event);

    this.uploading = true;
    this.fileService.uploadFile(this.file)
      .pipe(catchError(err => {
        this.uploading = false;
        return throwError(() => err.message);
      }))
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.uploading = false;
          imageField?.setValue(event.url);
          this.updateImageValue();
        }
      })
  }

  removeImage(imageField: any) {
    this.uploading = true;
    this.fileService.deleteFile(imageField)
      .pipe(catchError(err => {
        this.uploading = false;
        return throwError(() => err.message);
      }))
      .subscribe(() => {
        this.uploading = false;
        imageField?.setValue('');
        this.updateImageValue();
      })
  }

  openSectionEditDialog(section: Section = null): void {
    this.dialogSectionRef.open(CourseSectionEditComponent, {
      panelClass: 'edit-section-popup-panel',
      data: {
        section,
        sections: this.sections.value,
        uploading: this.uploading,
        onSave: (section: Section, prevPos: string) => this.addSection(section, prevPos),
        uploadImage: (event: any, field: any) => this.uploadImage(event, field),
        removeImage: (field: any) => this.removeImage(field)
      },
      width: '100%',
      disableClose: true
    });
  }

  ngOnInit(): void {
    this.course$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseID = params.get('course_id');
          return this.getCourse();;
        })
      );
  }

}
