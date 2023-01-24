import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, Subject, switchMap, throwError, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { File } from 'src/app/articles/article.model';
import { Lesson, Ressource } from '../lesson';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { VimeoService } from '../../../services/vimeo.service';
import { UploadFormComponent } from '../../../shared/upload-form/upload-form.component';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-lesson-edit-page',
  templateUrl: './lesson-edit-page.component.html',
  styleUrls: ['./lesson-edit-page.component.css']
})
export class LessonEditPageComponent implements OnInit {
  form!: FormGroup;
  color: ThemePalette = 'accent';

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  fileType!: string;
  fileName!: string;
  fileSize!: number;

  lesson$: Observable<Lesson>;
  lessonVideo$: Observable<any>;
  lessonID!: string;
  courseID!: string;

  isLoading: boolean;
  isPublishing: boolean;
  isPublished: boolean;
  isSaving: boolean;
  isSaved: boolean;
  saveFailed: boolean;
  uploading: boolean;
  resUploading: boolean;

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  private TitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private ThumbnailText$ = new Subject<string>();
  private VideoText$ = new Subject<string>();
  public EditorText$ = new Subject<string>();
  public FreeText$ = new Subject<boolean>();
  private RessourcesText$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private messageService: MessageService,
    private fileService: FileUploadService,
    public navigate: NavigationService,
    private router: Router,
    private vimeo: VimeoService,
    private dialogUploadRef: MatDialog
  ) { }

  initForm(lesson: Lesson) {
    const summaryTemplate = 'des petites bonnes actions.';
    const contentTemplate = `
      ## Introduction
      Ici vous dites ce que vous allez faire de façon objective.
      Ex: Nous allons voir comment déployer un serveur de messagerie en 2 mins, puis le déployer.

      ## 1/ Contenu 1
      Votre premier paragraphe
      ## 2/ Contenu 2
      Votre second paragraphe
      ## 3/ Contenu 3
      Votre troisieme paragraphe

      etc...

      ...
      N'hésitez pas à rajouter des sous-titres au besoin 🤗
      ### 3-1/ Sous-contenu 3


      ## Conclusion
      Ici rappelez ce que vous avez fait !
      `;
    const lessonSummary = lesson.summary || summaryTemplate;
    const lessonContent = lesson.content || contentTemplate;

    this.form = this.fb.group({
      id: [lesson.id],
      title: [lesson.title, [Validators.required]],
      summary: [lessonSummary, [Validators.required]],
      thumbnail: [lesson.thumbnail],
      video: [lesson.video],
      free: [lesson.free],
      type: [lesson.type],
      content: [lessonContent],
      chapterId: [lesson.chapterId],
      ressources: this.fb.array(this.loadFormRessources(lesson))
    })
  }

  isArray(obj: any) {
    return obj?.hasOwnProperty('length');
  }
  loadFormRessources(lesson: Lesson) {
    if (!this.isArray(lesson.ressources)) return [];
    return lesson.ressources.map(res => this.buildRessourceItem(res));
  }
  buildRessourceItem(res: Ressource): FormGroup {
    return new FormGroup({
      url: new FormControl(res.url),
      type: new FormControl(res.type),
      name: new FormControl(res.name),
    });
  }

  get title() { return this.form.get('title'); }
  get content() { return this.form.get('content'); }
  get summary() { return this.form.get('summary'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get video() { return this.form.get('video'); }
  get free() { return this.form.get('free'); }
  get type() { return this.form.get('type'); }
  get ressources() { return this.form.get('ressources') as FormArray; }

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
  typeInPrivacy(event: MatSlideToggleChange) {
    const val = event.checked
    this.FreeText$.next(!val);
  }
  typeInVideo(content: string) {
    this.VideoText$.next(content);
  }
  typeInEditor(content: string) {
    this.EditorText$.next(content);
  }
  typeInRessourse() {
    this.RessourcesText$.next(this.ressources.value);
  }

  addRessource(res: Ressource) {
    const resItem = this.fb.group({
      id: res.id,
      url: res.url,
      type: res.type,
      name: res.name
    })

    this.ressources.push(resItem)
    this.typeInRessourse();
  }

  removeRessource(resIndex: number) {
    this.ressources.removeAt(resIndex);
    this.typeInRessourse();
  }

  onFileSelected(event: any) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };

    this.fileType = this.file.data.type.split('/')[1];
    this.fileName = this.file.data.name;
    this.fileSize = this.file.data.size;
  }

  uploadImageInEditor(event: any) {
    this.onFileSelected(event);

    this.fileService.uploadFile(this.file)
      .pipe(catchError(err => {
        return throwError(() => err.message);
      }))
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          const editorContent = (<HTMLInputElement>document.getElementById('content'));
          const editorContentImgSrcValue = '![alt](' + event.url + ')'

          this.fileService.insertAtCursor(editorContent, editorContentImgSrcValue);
          this.form.patchValue({ content: editorContent?.value });
          this.EditorText$.next(editorContent?.value);
        }
      })
  }

  uploadRessource(event: any) {
    this.onFileSelected(event);
    this.resUploading = true;

    this.fileService.uploadFile(this.file)
      .pipe(catchError(err => {
        this.resUploading = false;
        return throwError(() => err.message);
      }))
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.resUploading = false;
          const res = { id: 1, url: event.url, type: this.fileType, name: this.fileName };
          this.addRessource(res);
        }
      })
  }

  deleteRessource(res: Ressource, id: any) {
    this.resUploading = true;

    this.fileService.removeImage(res.name)
      .pipe(catchError(err => {
        this.resUploading = false;
        return throwError(() => err.message);
      }))
      .subscribe(() => {
        this.resUploading = false;
        this.removeRessource(id)
      })
  }

  uploadContentImage(event: any) {
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
          const editorContent = (<HTMLInputElement>document.getElementById('content'));
          const editorContentImgSrcValue = '![alt](' + event.url + ')'

          this.fileService.insertAtCursor(editorContent, editorContentImgSrcValue);
          this.content.setValue(editorContent?.value);
          this.EditorText$.next(editorContent?.value);
        }
      })
  }

  getLesson(): Observable<any> {
    return this.lessonService.findLessonById(this.lessonID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.messageService.openSnackBarError("Oops cette lesson est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap((data: Lesson) => {
          this.initForm(data)
          this.lessonVideo$ = this.vimeo.getOneVideo(data?.video);
        })
      )
  }

  updateLesson() {
    this.isSaving = true;

    this.lessonService.updateLesson({ ...this.form.value, free: !this.free.value })
      .subscribe({
        next: (_res: Lesson) => {
          this.isSaving = false;
          this.isSaved = true;
          this.saveFailed = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
          this.isSaved = false;
          this.saveFailed = true;
        }
      })
  }

  publishLesson() {
    this.isSaving = true;

    this.lessonService.updateLesson({ ...this.form.value, free: !this.free.value })
      .subscribe({
        next: (_res: Lesson) => {
          setTimeout(() => {
            this.isSaving = false;
            this.messageService.openSnackBarSuccess('Publication de la leçon réussie !', '');
          }, 1000);
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
          this.messageService.openSnackBarError('Une erreur est survenue lors de la publication de la leçon', 'OK')
        }
      })
  }

  uploadVideo($event: any) {
    this.onFileSelected($event);

    this.uploading = true;
    this.vimeo.postVideo(this.file.data)
      .pipe(catchError(err => {
        this.uploading = false;
        this.messageService.openSnackBarError('Un probleme est survenu lors du chargement!', 'OK')
        return throwError(() => err.message)
      }))
      .subscribe(
        data => {
          this.uploading = false;
          this.openUploadFormDialog(
            data.upload.upload_link,
            this.file.data,
            this.fileName,
            data.link,
            this.fileSize,
            this.video,
            this.VideoText$
          );
        }
      )
  }

  deleteVideo(lesson: Lesson) {
    const videoID = lesson.video.split('/')[3];
    if (!videoID){
      this.video.setValue('');
      this.typeInVideo('');
      return
    }

    this.vimeo.deleteVideoFile(videoID)
      .pipe(catchError(err => {
        this.uploading = false;
        this.messageService.openSnackBarError('Un problème est survenu lors de la suppression!', 'OK')
        return throwError(() => err.message)
      }))
      .subscribe(_data => {
        this.video.setValue('');
        this.typeInVideo('');
        this.messageService.openSnackBarSuccess('La vidéo a bien été supprimée!', 'OK')
      });
  }

  openUploadFormDialog(
    uploadLink: any,
    videoFile: any,
    fileName: any,
    uri: string,
    fileSize: number,
    videoField: any,
    videoFieldSub: any
  ): void {
    this.dialogUploadRef.open(UploadFormComponent, {
      data: {
        history: this.router.url,
        uploadLink,
        videoFile,
        fileName,
        fileSize,
        uri,
        videoField,
        videoFieldSub,
      },
      disableClose: true
    });
  }

  onChanges(element: Observable<any>): void {
    element.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => {
        if (this.form.valid) {
          this.isSaving = true;
          this.updateLesson();
        }
      }),
    ).subscribe()
  }

  triggerAutoSave() {
    const fields = [
      this.RessourcesText$,
      this.TitleText$,
      this.EditorText$,
      this.SummaryText$,
      this.ThumbnailText$,
      this.VideoText$,
      this.FreeText$
    ]

    fields.forEach((el: Observable<any>) => {
      this.onChanges(el);
    })
  }

  ngOnInit(): void {
    this.lesson$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.lessonID = params.get('lesson_id');
        this.courseID = params.get('course_id');
        return this.getLesson();
      })
    );

    this.triggerAutoSave();
  }
}
