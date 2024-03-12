import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, Subject, throwError, tap, switchMap } from 'rxjs';
import { Course, Section } from '../course';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { File, Tag } from 'src/app/articles/article.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseSectionEditComponent } from '../course-section-edit/course-section-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { SectionService } from '../../sections/section.service';
import { TagService } from 'src/app/services/tag.service';
import { sortByNameAsc } from 'src/app/services/utilities.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-course-edit-page',
  templateUrl: './course-edit-page.component.html',
  styleUrls: ['./course-edit-page.component.css']
})
export class CourseEditPageComponent implements OnInit {
  @HostListener('click', ['$event']) onClick(event: any) {
    if (
      event.target.classList.contains('tagItem')
      || event.target.classList.contains('selected-tags-container')
    ) {
      this.tagsDropdownOpened = true
    } else {
      this.tagsDropdownOpened = false
    }
  }

  tagList: Tag[];

  public file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  course$: Observable<Course>;
  courseID!: string;
  course: Course;

  form!: FormGroup;

  isLoading = true;
  isSaving: boolean;
  uploading: boolean;

  tagsDropdownOpened!: boolean;
  orderedSections: Section[];

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
    private sectionService: SectionService,
    private messageService: MessageService,
    public navigate: NavigationService,
    private fileService: FileUploadService,
    private dialogSectionRef: MatDialog,
    private tagService: TagService,
  ) { }

  getCourse(): Observable<any> {
    return this.courseService.findCourseById(this.courseID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.isLoading = false;
            this.messageService.openSnackBarError("Oops ce cours est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap((data: Course) => {
          this.isLoading = false;
          this.initForm(data);
          this.course = data;
          this.orderSections(data.sections);
        })
      )
  }

  updateCourse() {
    this.isSaving = true;
    this.courseService.updateCourse(this.form.value)
      .subscribe({
        next: (_res: Course) => {
          this.isSaving = false;
          this.messageService.openSnackBarSuccess('Enregistrement réussi !', '');
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
        }
      })
  }

  updateImageValue() {
    const course = { ...this.course, summary: this.form.value.summary, thumbnail: this.thumbnail.value };
    this.courseService.updateCourse(course)
      .subscribe({
        next: (_res: Course) => {
          this.messageService.openSnackBarSuccess('Succes !', '');
        },
        error: (_error: HttpErrorResponse) => {
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
      sections: this.fb.array(this.loadFormSections(course)),
      tags: this.fb.array(course.tags.map(tag => this.buildTagItem(tag)))
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
      id: new FormControl(section.id),
      courseId: new FormControl(section.courseId),
      position: new FormControl(section.position),
      title: new FormControl(section.title),
      content: new FormControl(section.content),
      image: new FormControl(section.image),
    });
  }

  buildTagItem(tag: Tag): FormGroup {
    return new FormGroup({
      id: new FormControl(tag.id),
      name: new FormControl(tag.name),
      colorCode: new FormControl(tag.colorCode),
    });
  }
  addtag(tag: Tag) {
    const tagItem = this.fb.group({
      id: tag.id,
      name: tag.name,
      colorCode: tag.colorCode
    })

    if (!this.tags.value.some((el: Tag) => el.id === tag.id)) {
      this.tags.push(tagItem)
      // this.typeInTags();
    }
  }
  removeTag(tagIndex: number) {
    this.tags.removeAt(tagIndex);
    // this.typeInTags();
  }

  get title() { return this.form.get('title'); }
  get subTitle() { return this.form.get('subTitle'); }
  get summary() { return this.form.get('summary'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get video() { return this.form.get('video'); }
  get sections() { return this.form.get('sections') as FormArray; }
  get tags() { return this.form.get('tags') as FormArray; }

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

  removeSection(sectionId: number, index: number) {
    this.sectionService.deleteSection(sectionId)
      .pipe(catchError(err => {
        this.isLoading = false;
        return throwError(() => err.message);
      }))
      .subscribe(_data => {
        this.messageService.openSnackBarSuccess('Section supprimée!', 'OK');
        this.sections.removeAt(index);
        this.typeInSections();
      })
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
      .subscribe({
        next: _data => {
          this.uploading = false;
          imageField?.setValue('');
        },
        complete: () => this.uploading = false
      })
  }

  openSectionEditDialog(section: Section = null): void {
    this.dialogSectionRef.open(CourseSectionEditComponent, {
      panelClass: 'edit-section-popup-panel',
      data: {
        section,
        sections: this.sections.value,
        uploading: this.uploading,
        courseId: this.courseID,
        uploadImage: (event: any, field: any) => this.uploadImage(event, field),
        removeImage: (field: any) => this.removeImage(field)
      },
      width: '100%',
      disableClose: true
    });
  }

  openTagsDropdown() {
    this.tagsDropdownOpened = true
  }

  fetchListOfTags(): void {
    this.tagService.getListOfTags().subscribe(
      (response: Tag[]) => {
        const sortedList = sortByNameAsc(response);
        this.tagList = sortedList;
      }
    )
  }

  dropSection(event: CdkDragDrop<Section[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex + 1;
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Section

      this.sectionService.updateSection({...draggedElement, position: currPosition})
        .pipe(catchError(err => {
          return throwError(() => err.message);
        }))
        .subscribe(_data => {
          console.log('DRAGGED RESPONSE SECTION');
          // this.orderSections(this.course.sections);
        })
    }
  }

  orderSections(list: Section[]) {
    this.orderedSections = list.sort((a: Section, b: Section) => a.position - b.position)
  }

  ngOnInit(): void {

    this.course$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseID = params.get('course_id')?.split('-')[0];
          this.fetchListOfTags();
          return this.getCourse();;
        })
      );
  }

}
