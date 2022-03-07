import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('fileUpload', { static: false })
  fileUpload!: ElementRef;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

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
  TagsText$ = new Subject<Tag[]>();

  savedArticle$!: Observable<Article>;
  dropdownSettings = {};

  public tagList!: Tag[];
  public savingMessage!: string;
  public isSaved!: boolean;


  constructor(
    private formuilder: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private seo: SeoService,
    private location: Location
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
      thumbnail: ['', [Validators.required]], // required just for publish
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

  public onClickFileUpload(host: string) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();

    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      };
      this.fileUpload.nativeElement.value = '';

      this.uploadFile(host);
    };
  }


  public uploadFile(host: string) {
    const fakeImages: any = [
      'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
      'https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ',
      'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU',
      'https://i.picsum.photos/id/1019/5472/3648.jpg?hmac=2mFzeV1mPbDvR0WmuOWSiW61mf9DDEVPDL0RVvg1HPs',
      'https://i.picsum.photos/id/1029/4887/2759.jpg?hmac=uMSExsgG8_PWwP9he9Y0LQ4bFDLlij7voa9lU9KMXDE',
      'https://i.picsum.photos/id/1047/3264/2448.jpg?hmac=ksy0K4uGgm79hAV7-KvsfHY2ZuPA0Oq1Kii9hqkOCfU'
    ]
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    const content = (<HTMLInputElement>document.getElementById('content'));
    const imgSrcValue = '![alt](' + this.fileUploadService.FakeUploadImage(fakeImages) + ')'

    if (host === 'coverImage') this.form.patchValue({ thumbnail: this.fileUploadService.FakeUploadImage(fakeImages) });
    if (host === 'editorImage') {
      this.insertAtCursor(content, imgSrcValue);
      this.form.patchValue({ content: content?.value });
    }

    // this.fileUploadService.uploadImage(formData).pipe(
    //   map((event) => {
    //     switch (event.type) {
    //       case HttpEventType.UploadProgress:
    //         this.file.progress = Math.round(event.loaded * 100 / event.total);
    //         break;
    //       case HttpEventType.Response:
    //         return event;
    //     }
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     this.file.inProgress = false;
    //     return of('Upload failed');
    //   })).subscribe((event: any) => {
    //     if (typeof (event) === 'object') {
    //       this.form.patchValue({ headerImage: event.body.filename });
    //     }
    //   })
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
    if (this.form.controls['thumbnail'].value !== '') this.form.controls['thumbnail'].setValue('')
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

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.getArticle()
    this.InitForm()

    this.fetchListOfTags();

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

    this.EditorText$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => this.isSaving = true),
      switchMap(_content => this.articleService.updateToSave(this.form.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.savingMessage = 'Oops erreur!'
            this.location.reload();
            return throwError(() => error);
          }),
          tap(() => {
            this.isSaving = false;
            this.isSaved = true;
          })
        ))
    ).subscribe()

    this.TitleText$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => this.isSaving = true),
      switchMap(_content => this.articleService.updateToSave(this.form.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.savingMessage = 'Oops erreur!'
            this.location.reload();
            return throwError(() => error);
          }),
          tap(() => {
            this.isSaving = false;
            this.isSaved = true;
          })
        ))
    ).subscribe()

    this.SummaryText$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => this.isSaving = true),
      switchMap(_content => this.articleService.updateToSave(this.form.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.savingMessage = 'Oops erreur!'
            this.location.reload();
            return throwError(() => error);
          }),
          tap(() => {
            this.isSaving = false;
            this.isSaved = true;
          })
        ))
    ).subscribe()

    this.TagsText$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => this.isSaving = true),
      switchMap(_content => this.articleService.updateToSave(this.form.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.savingMessage = 'Oops erreur!'
            this.location.reload();
            return throwError(() => error);
          }),
          tap(() => {
            this.isSaving = false;
            this.isSaved = true;
          })
        ))
    ).subscribe()

    /**
     * auto save listening all fields
     * if title input is empty save with the fetched articleTitle value
     * if summary is empty save with an empty value
     * if tags are empty save with empty array value
     * if thumnail is empty save empty value
     * it content is empty save with an empty space added into
     * 
     * save the form values (especially the content and the title) in the LS to avoid data lost if disconnected
     */
  }

}
