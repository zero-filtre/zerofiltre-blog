import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
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
  public articleId!: number
  public articleTitle!: string
  public selectedTags: Tag[] = []

  dropdownSettings = {};

  public tagList: Tag[] = [
    { id: 1, name: 'java', colorCode: '#222' },
    { id: 2, name: 'angular', colorCode: '#222' },
    { id: 3, name: 'spring-boot', colorCode: '#222' },
    { id: 4, name: 'html', colorCode: '#222' },
    { id: 5, name: 'react', colorCode: '#222' },
    { id: 6, name: 'sql', colorCode: '#222' },
    { id: 7, name: 'graphql', colorCode: '#222' },
    { id: 8, name: 'docker', colorCode: '#222' },
    { id: 9, name: 'api', colorCode: '#222' },
    { id: 10, name: 'rest', colorCode: '#222' }
  ]

  constructor(
    private formuilder: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private _snackBar: MatSnackBar
  ) { }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  openSnackBar(message: string, action: string, cssClass: string, name: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: null!,
      panelClass: [cssClass, name],
    });
  }

  public getArticle(): void {
    this.articleService.getOneArticle(this.articleId).subscribe({
      next: (response: Article) => {
        this.article = response
        this.articleTitle = response.title!
        this.form.controls['id'].setValue(+this.articleId)
        this.form.controls['title'].setValue(this.articleTitle)
        this.form.controls['thumbnail'].setValue(this.article.thumbnail)
        this.form.controls['content'].setValue(this.article.content)
        this.form.controls['tags'].setValue(this.article.tags)
        this.selectedTags = this.article.tags
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    })
  }

  public InitForm(): void {
    this.form = this.formuilder.group({
      id: [null],
      title: ['', [Validators.required]],
      thumbnail: [''],
      content: ['', [Validators.required]],
      tags: [[]]
    })
  }

  public saveArticle() {
    this.articleService.updateToSave(this.form.value).pipe(
      tap(() => this.openSnackBar('Article sauvegardé!', 'Fermer', 'green-snackbar', 'article-save-snackbar'))
    ).subscribe({
      next: (_response: Article) => this.openSnackBar('Article sauvegardé!', 'Fermer', 'green-snackbar', 'article-save-snackbar'),
      error: (_error: HttpErrorResponse) => this.openSnackBar('La sauvegarde a echouée!', 'Ressayez', 'red-snackbar', 'article-save-snackbar')
    })
  }

  public publishArticle() {
    this.articleService.updateToPublish(this.form.value).pipe(
      tap(() => this.router.navigateByUrl(`articles/${this.articleId}`))
    ).subscribe();
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

    const newValue = this.form.value.content + '\n' + '![alt](' + this.fileUploadService.FakeUploadImage(fakeImages) + ')'

    if (host === 'coverImage') this.form.patchValue({ thumbnail: this.fileUploadService.FakeUploadImage(fakeImages) });
    if (host === 'editorImage') this.form.patchValue({ content: newValue });

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

  get title() { return this.form.get('title'); }
  get content() { return this.form.get('content'); }
  get thumbnail() { return this.form.get('thumbnail'); }

  public removeFile() {
    if (this.form.controls['thumbnail'].value !== '') this.form.controls['thumbnail'].setValue('')
  }

  onItemSelect(_item: any) {
    this.setFormTagsValue()
  }

  private setFormTagsValue(): void {
    this.selectedTags = this.getFullObjectsFromTagListBySelectedTagsIds(this.getSelectedTagsIds())
    this.form.controls['tags'].setValue(this.selectedTags)
  }

  private getSelectedTagsIds() {
    return this.form.value.tags.map((tag: Tag) => tag.id)
  }

  /** The ngx-MultiSelection library doesn't return the full object selected by default, 
  ** therefore we need a function to get the correct object value to send to the server
  **/
  private getFullObjectsFromTagListBySelectedTagsIds(ids: any) {
    return this.tagList.filter(item => ids.includes(item.id))
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id
    this.getArticle()
    this.InitForm()

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
  }

}
