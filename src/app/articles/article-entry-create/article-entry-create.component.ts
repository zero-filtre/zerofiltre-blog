import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { Article, File, Tag } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-entry-create',
  templateUrl: './article-entry-create.component.html',
  styleUrls: ['./article-entry-create.component.css']
})
export class ArticleEntryCreateComponent implements OnInit {

  public file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  public uploading = false;

  public form!: FormGroup;

  public activeTab: string = 'editor';
  public article!: Article
  public articleId!: string;
  public articleTitle!: string;
  public selectedTags: Tag[] = []
  public loading = false;
  public isSaving = false;
  public isPublishing = false;

  private EditorText$ = new Subject<string>();
  private TitleText$ = new Subject<string>();
  private SummaryText$ = new Subject<string>();
  private TagsText$ = new Subject<Tag[]>();
  private ThumbnailText$ = new Subject<string>();

  savedArticle$!: Observable<Article>;
  dropdownSettings = {};

  public tagList!: Tag[];
  public savingMessage!: string;
  public isSaved!: boolean;
  public saveFailed!: boolean;
  public alertMessage: string = 'Hello Bao, surtout veille à renseigner tous les champs obligatoires pour assurer la sauvegarde automatique de ton article';


  constructor(
    private formuilder: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    public fileUploadService: FileUploadService,
    private messageService: MessageService,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

  }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  public fetchListOfTags(): void {
    this.articleService.getListOfTags().subscribe({
      next: (response: Tag[]) => {
        this.tagList = response
      },
      error: (_error: HttpErrorResponse) => { }
    })
  }

  public getArticle(): void {
    this.articleService.findArticleById(this.articleId).subscribe({
      next: (response: Article) => {
        this.article = response
        this.articleTitle = response.title!
        this.form.controls['id'].setValue(+this.articleId)
        this.title?.setValue(this.articleTitle)
        this.summary?.setValue(this.article.summary)
        this.thumbnail?.setValue(this.article.thumbnail)
        this.content?.setValue(this.article.content)
        this.tags?.setValue(this.article.tags)
        this.selectedTags = this.article.tags
      },
      error: (_error: HttpErrorResponse) => { }
    })
  }

  public InitForm(): void {
    this.form = this.formuilder.group({
      id: [null],
      title: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      thumbnail: [''],
      content: ['', [Validators.required]],
      tags: [[]]
    })
  }

  get title() { return this.form.get('title'); }
  get summary() { return this.form.get('summary'); }
  get content() { return this.form.get('content'); }
  get thumbnail() { return this.form.get('thumbnail'); }
  get tags() { return this.form.get('tags'); }

  public getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  public typeInEditor(content: string) {
    this.EditorText$.next(content);
  }

  public typeInTitle(content: string) {
    this.TitleText$.next(content);
  }

  public typeInTags(content: any) {
    this.TagsText$.next(content);
  }
  public typeInSummary(content: string) {
    this.SummaryText$.next(content);
  }

  public saveArticle() {
    this.loading = true;
    this.isSaving = true;
    this.articleService.updateToSave(this.form.value).pipe(
    ).subscribe({
      next: (_response: Article) => {
        this.loading = false;
        this.isSaving = false;
        this.messageService.openSnackBarSuccess('Article sauvegardé !', '');
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.isSaving = false;
      }
    })
  }

  public publishArticle() {
    this.loading = true;
    this.isPublishing = true;
    this.articleService.updateToPublish(this.form.value).pipe(
      tap(() => this.router.navigateByUrl(`articles/${this.articleId}`))
    ).subscribe({
      next: (_response: Article) => {
        this.loading = false;
        this.isPublishing = false;
        this.messageService.openSnackBarSuccess('Article pulié avec success !', '');
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.isPublishing = false;
      }
    });
  }


  public onFileSelected(event: any, host: string) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };

    this.uploadFile(host);
  }


  public uploadFile(host: string) {

    const formData = new FormData();
    const fileName = this.file.data.name

    formData.append('image', this.file.data, fileName);
    this.file.inProgress = true;
    this.uploading = true;

    this.fileUploadService.uploadImage(fileName, this.file.data).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_error: HttpErrorResponse) => {
        this.file.inProgress = false;
        this.uploading = false;

        return of('Upload failed');
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.uploading = false;

          if (host === 'coverImage') {
            this.form.patchValue({ thumbnail: event.url });
            this.ThumbnailText$.next(this.thumbnail?.value);
          } else {
            const editorContent = (<HTMLInputElement>document.getElementById('content'));
            const editorContentImgSrcValue = '![alt](' + event.url + ')'

            this.insertAtCursor(editorContent, editorContentImgSrcValue);
            this.form.patchValue({ content: editorContent?.value });
            this.EditorText$.next(editorContent?.value);
          }
        }
      })
  }

  private insertAtCursor(myField: any, myValue: string) {
    //IE support
    if ((document as any).selection) {
      myField.focus();
      const sel = (document as any).selection.createRange();
      sel.text = myValue;
    }
    // Microsoft Edge
    else if (window.navigator.userAgent.indexOf("Edge") > -1) {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;

      myField.value = myField.value.substring(0, startPos) + myValue
        + myField.value.substring(endPos, myField.value.length);

      var pos = startPos + myValue.length;
      myField.focus();
      myField.setSelectionRange(pos, pos);
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }

  public removeFile() {
    const fileName = this.thumbnail?.value.split('/')[6];
    const fileNameUrl = this.thumbnail?.value.split('/')[2];

    if (fileNameUrl !== 'storage.gra.cloud.ovh.net') {
      this.thumbnail?.setValue('');
      this.ThumbnailText$.next('');
      return;
    }

    this.fileUploadService.RemoveImage(fileName)
      .subscribe({
        next: () => {
          this.thumbnail?.setValue('');
          this.ThumbnailText$.next('');
        },
        error: (_err: HttpErrorResponse) => {
        }
      })
  }

  public onItemSelect(item: any) {
    this.setFormTagsValue();
    this.typeInTags(item);
  }

  private setFormTagsValue(): void {
    this.selectedTags = this.getFullObjectsFromTagListBySelectedTagsIds(this.getSelectedTagsIds())
    this.form.controls['tags'].setValue(this.selectedTags)
  }

  private getSelectedTagsIds() {
    return this.form.value.tags.map((tag: Tag) => tag.id)
  }

  /** The ng-multiselect-dropdown library doesn't return the full object selected by default,
  * therefore we need a function to get the correct object value to send to the server
  */
  private getFullObjectsFromTagListBySelectedTagsIds(ids: any) {
    return this.tagList.filter(item => ids.includes(item.id))
  }

  public onChanges(element: Observable<any>): void {
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
                this.savingMessage = 'Oops erreur!'
                this.saveFailed = true;
                return throwError(() => error);
              }),
              tap(() => {
                this.isSaving = false;
                this.isSaved = true;
              })
            ).subscribe();
        } else {
          this.messageService.openSnackBarWarning(this.alertMessage, "C'est noté !", 0);
        }
      }),
    ).subscribe()
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.getArticle()
    this.InitForm()

    this.fetchListOfTags();

    if (isPlatformServer(this.platformId)) {
      this.fileUploadService.xToken$.subscribe();
    }


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Tout Sélectioner',
      unSelectAllText: 'Déselectioner tout',
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher",
      enableCheckAll: false
      // itemsShowLimit: 3,
      // limitSelection: 3,
    };

    this.seo.generateTags({
      title: "Editer l'aticle",
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
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
