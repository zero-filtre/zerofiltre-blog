import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, Observable, Subject, tap, throwError } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { Article, File, Tag } from '../article.model';
import { ArticleService } from '../article.service';

import { FormArray } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { sortByNameAsc } from 'src/app/services/utilities.service';
import { BaseComponent } from 'src/app/Base.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-article-entry-create',
  templateUrl: './article-entry-create.component.html',
  styleUrls: ['./article-entry-create.component.css']
})
export class ArticleEntryCreateComponent implements OnInit, BaseComponent {
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

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  uploading = false;
  form!: FormGroup;

  article!: Article
  articleId!: string;
  articleTitle!: string;
  loading = false;
  isSaving = false;
  isPublishing = false;
  isPublished = false

  EditorText$ = new Subject<string>();
  private TitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private TagsText$ = new Subject<Tag[]>();
  private ThumbnailText$ = new Subject<string>();

  savedArticle$!: Observable<Article>;

  tagList!: Tag[];
  savingMessage!: string;
  isSaved!: boolean;
  saveFailed!: boolean;

  tagsDropdownOpened!: boolean;

  constructor(
    private loadEnvService: LoadEnvService,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    public fileUploadService: FileUploadService,
    private messageService: MessageService,
    private seo: SeoService,
    public authService: AuthService,
    private translate: TranslateService,
    public navigate: NavigationService,
    @Inject(DOCUMENT) private document: any
  ) { }

  openTagsDropdown() {
    this.tagsDropdownOpened = true
  }

  fetchListOfTags(): void {
    this.articleService.getListOfTags().subscribe(
      (response: Tag[]) => {
        const sortedList = sortByNameAsc(response);
        this.tagList = sortedList;
      }
    )
  }

  getArticle(): void {
    this.articleService.findArticleById(this.articleId)
      .pipe(
        tap(art => {
          if (art.status === 'PUBLISHED') {
            this.isPublished = true;
          } else {
            this.isPublished = false;
          }
        }),
      )
      .subscribe(
        (response: Article) => {
          this.article = response
          this.articleTitle = response.title!
          this.InitForm(this.article)
        }
      )
  }

  InitForm(article: Article): void {

    const summaryTemplate =
      `Veuillez indiquer ici le résume de votre article. Ex: Mettre en place un serveur de messagerie n'a jamais été aussi simple. Voici comment faire.`;

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

    const articleSummary = article.summary || summaryTemplate;
    const articleContent = article.content || contentTemplate;

    this.form = this.fb.group({
      id: [+article.id!],
      title: [article.title, [Validators.required]],
      summary: [articleSummary, [Validators.required]],
      content: [articleContent, [Validators.required]],
      thumbnail: [article.thumbnail],
      tags: this.fb.array(article.tags.map(tag => this.buildTagItemFields(tag)))
    })
  }

  get title() { return this.form.get('title'); }
  get summary() { return this.form.get('summary'); }
  get content() { return this.form.get('content'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get tags() { return this.form.get('tags') as FormArray; }

  buildTagItemFields(tag: Tag): FormGroup {
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
      this.typeInTags();
    } else {
    }
  }

  removeTag(tagIndex: number) {
    this.tags.removeAt(tagIndex);
    this.typeInTags();
  }

  getValue(event: Event): string {
    event.preventDefault();
    return (event.target as HTMLTextAreaElement).value
  }

  typeInEditor(content: string) {
    this.EditorText$.next(content);
  }

  typeInTitle(content: string) {
    this.TitleText$.next(content);
  }

  typeInTags() {
    this.TagsText$.next(this.tags.value);
  }

  typeInSummary(content: string) {
    this.SummaryText$.next(content);
  }

  saveArticle() {
    this.loading = true;
    this.isSaving = true;

    this.articleService.updateToSave(this.form.value).pipe(
    ).subscribe({
      next: (_response: Article) => {
        this.loading = false;
        this.isSaving = false;
        this.messageService.saveArticleSuccess();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.isSaving = false;
      }
    })
  }

  publishArticle() {
    this.loading = true;
    this.isPublishing = true;

    this.articleService.updateToPublish(this.form.value).pipe(
      tap(() => this.router.navigateByUrl(`articles/${this.articleId}`))
    ).subscribe({
      next: (_response: Article) => {
        this.loading = false;
        this.isPublishing = false;
        this.messageService.publishArticleSuccess();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.isPublishing = false;
      }
    });
  }

  onFileSelected(event: any, host: string) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };

    this.uploadFile(host);
  }

  uploadFile(host: string) {
    this.uploading = true;

    this.fileUploadService.uploadFile(this.file)
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.uploading = false;

          if (host === 'coverImage') {
            this.form.patchValue({ thumbnail: event.url });
            this.ThumbnailText$.next(this.thumbnail?.value);
          } else {
            const editorContent = (<HTMLInputElement>document.getElementById('content'));
            const editorContentImgSrcValue = '![alt](' + event.url + ')'

            this.fileUploadService.insertAtCursor(editorContent, editorContentImgSrcValue);
            this.form.patchValue({ content: editorContent?.value });
            this.EditorText$.next(editorContent?.value);
          }
        }
      })
  }

  removeFile(): any {
    this.fileUploadService.deleteFile(this.thumbnail as any, this.ThumbnailText$)
      .subscribe(() => {
        this.thumbnail?.setValue('');
        this.ThumbnailText$.next('');
      })
  }

  isFormValid = () => this.isSaved || this.form?.valid;

  onChanges(element: Observable<any>): void {
    element.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => {
        if (this.form.valid) {
          this.messageService.cancel();
          this.isSaving = true;

          this.articleService.updateToSave(this.form.value)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.isSaving = false;
                this.isSaved = false;
                this.savingMessage = "Oops problème de connexion! Vos modifications n'ont pas pu être enregistrées.";
                this.saveFailed = true;
                return throwError(() => error);
              }),
              tap(() => {
                this.isSaving = false;
                this.isSaved = true;
                this.saveFailed = false;
              })
            ).subscribe();
        } else {
          this.isSaved = false;
        }
      }),
    ).subscribe()
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
    this.checkScreenMode();
    this.elem = document.documentElement;

    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.getArticle();
    this.fetchListOfTags();

    this.seo.generateTags({
      title: this.translate.instant('meta.articleEntryEditTitle'),
      description: this.translate.instant('meta.articleEntryEditDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });

    const fields = [
      this.TagsText$,
      this.TitleText$,
      this.EditorText$,
      this.SummaryText$,
      this.ThumbnailText$
    ]

    fields.forEach((el: Observable<any>) => {
      this.onChanges(el);
    })
  }
}
