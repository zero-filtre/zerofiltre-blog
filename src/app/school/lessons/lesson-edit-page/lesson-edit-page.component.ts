import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, Subject, switchMap, throwError, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { File } from 'src/app/articles/article.model';
import { Lesson, Ressource } from '../lesson';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-lesson-edit-page',
  templateUrl: './lesson-edit-page.component.html',
  styleUrls: ['./lesson-edit-page.component.css']
})
export class LessonEditPageComponent implements OnInit {
  form!: FormGroup;

  activeTab: string = 'editor';
  @ViewChild("editor") editor!: ElementRef;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  fileType!: string;
  fileName!: string;

  lesson$: Observable<Lesson>;
  lessonID!: string;
  courseID!: string;

  isLoading: boolean;
  isSaving: boolean;
  uploading: boolean;
  resUploading: boolean;

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  private TitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private ThumbnailText$ = new Subject<string>();
  private EditorText$ = new Subject<string>();
  private RessourcesText$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private messageService: MessageService,
    private navigate: NavigationService,
    private fileService: FileUploadService,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) { }

  setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  initForm(lesson: Lesson) {
    const summaryTemplate = 'Un petit resume de la lesson ici';
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
      id: [lesson.id!],
      title: [lesson.title, [Validators.required]],
      summary: [lessonSummary, [Validators.required]],
      thumbnail: [lesson.thumbnail],
      video: [lesson.video],
      content: [lessonContent],
      ressources: this.fb.array(lesson.ressources.map(res => this.buildRessourceItem(res)))
    })
  }

  get title() { return this.form.get('title'); }
  get content() { return this.form.get('content'); }
  get summary() { return this.form.get('summary'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get video() { return this.form.get('video'); }
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
  typeInEditor(content: string) {
    this.EditorText$.next(content);
  }
  typeInRessourse() {
    this.RessourcesText$.next(this.ressources.value);
  }

  buildRessourceItem(res: Ressource): FormGroup {
    return new FormGroup({
      url: new FormControl(res.url),
      type: new FormControl(res.type),
      name: new FormControl(res.name),
    });
  }

  addRessource(res: Ressource) {
    const resItem = this.fb.group({
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

    this.fileType = this.file.data.type.split('/')[1]
    this.fileName = this.file.data.name
  }

  uploadVideo(event: any) {
    this.onFileSelected(event);
    this.uploading = true;
  }

  deleteVideo() { }

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
          const res = { url: event.url, type: this.fileType, name: this.fileName };
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
    return this.lessonService.findLessonById(this.lessonID, this.courseID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.messageService.openSnackBarError("Oops cette lesson est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap(data => this.initForm(data))
      )
  }

  updateLesson() {
    this.isSaving = true;
    this.lessonService.updateLesson(this.form.value)
      .subscribe({
        next: (_res: Lesson) => {
          this.isSaving = false;
          this.messageService.openSnackBarSuccess('Enregistrement de la leçon réussie !', '');
        },
        error: (_error: HttpErrorResponse) => {
          this.isSaving = false;
          this.messageService.openSnackBarError('Une erreur est survenue lors de la sauvegarde de la leçon', 'OK')
        }
      })
  }

  onChanges(element: Observable<any>): void {
    element.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => {
        if (this.form.valid) {
          this.isSaving = true;
          this.updateLesson();
        } else {
          console.log('LESSON FORM NOT VALID')
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
      this.ThumbnailText$
    ]

    fields.forEach((el: Observable<any>) => {
      this.onChanges(el);
    })
  }

  // EDITOR CODE ------------------------------------------ //

  handleTab(event: Event, isUp: Boolean = false) {
    if ((event as KeyboardEvent).key === "Tab") {

      event.preventDefault();

      let start = (event.target as HTMLTextAreaElement).selectionStart;
      var end = (event.target as HTMLTextAreaElement).selectionEnd;
      (event.target as HTMLTextAreaElement).value = (event.target as HTMLTextAreaElement).value.substring(0, start) + '    ' + (event.target as HTMLTextAreaElement).value.substring(end);
      (event.target as HTMLTextAreaElement).selectionStart = (event.target as HTMLTextAreaElement).selectionEnd = start + 4;

      let value = (event.target as HTMLTextAreaElement).value;

      this.changeDetector.detectChanges();
      this.editor.nativeElement.focus();

      this.EditorText$.next(value);
    }

    if ((event as KeyboardEvent).key === "Tab" && isUp) {

      event.preventDefault();
      this.changeDetector.detectChanges();
      this.editor.nativeElement.focus();
    }

    let value = (event.target as HTMLTextAreaElement).value;
    this.EditorText$.next(value);
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event: any) {
    this.checkScreenMode();
  }

  checkScreenMode() {
    if (document.fullscreenElement) {
      this.fullScreenOn = true;
    } else {
      this.fullScreenOn = false;
    }
    console.log('FULLSCREN: ', this.fullScreenOn);
  }

  toggleFullScreen() {
    this.elem = (document as any).querySelector('.editor_sticky_wrapper');
    const textarea = (document as any).querySelector('#content');
    const editotheader = (document as any).querySelector('.editor-header');

    this.elem.addEventListener('fullscreenchange', this.fullscreenchanged);

    if (!this.document.fullscreenElement) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }

      textarea.style.height = '100vh';
      editotheader.style.marginTop = '0';

    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  fullscreenchanged() {
    if (document.fullscreenElement) {
      console.log(`Entered fullscreen mode.`);
    } else {
      console.log('Exit fullscreen mode.');
    }
  };

  fullScreenOn = false;
  elem: any;

  ngOnInit(): void {
    this.lesson$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.lessonID = params.get('lesson_id');
        this.courseID = params.get('course_id');
        return this.getLesson();;
      })
    );

    this.triggerAutoSave();

    this.checkScreenMode();
    this.elem = document.documentElement;
  }
}
