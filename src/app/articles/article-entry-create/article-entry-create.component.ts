import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-entry-create',
  templateUrl: './article-entry-create.component.html',
  styleUrls: ['./article-entry-create.component.css']
})
export class ArticleEntryCreateComponent implements OnInit {

  @ViewChild('fileUpload', { static: false })
  fileUpload!: ElementRef;

  public form!: FormGroup;

  public activeTab: string = 'editor';
  public article!: Article
  public articleId!: number
  public articleTitle!: string
  public selectedTags: Tag[] = []

  dropdownSettings = {};

  public tagListDrop: Tag[] = [
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

  // markdown = `
  //   ## Markdown __rulez__!

  //   ### Syntax highlight
  //   \`\`\`ts
  //     const language = 'typescript';
  //   \`\`\`

  //   ### Ordered Lists
  //   1. bullet point
  //   2. Another bullet point

  //   ### Unordered list
  //   - Unordered bullet
  //   - Another unordered bullet

  //   ### Blockquote
  //   > Blockquote to the max

  //   \`\`\`js
  //     const language = 'javascript';
  //   \`\`\`

  //   \`\`\`java
  //     String language = "java";
  //   \`\`\`

  //   ### Inline code
  //  \`Inline code\`

  //   ### Links
  //   [google-link](https://google.com)

  //   ### Image
  //   ![Screenshot from 2021-11-04 09-32-25.png](https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300)

  //   ### Embed Iframe
  //   <iframe src="https://www.youtube.com/embed/yz8x71BiGXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  //   </iframe>

  //   ### Divider
  //   ---
  //   `;

  constructor(
    private formuilder: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
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
      thumbnail: ['https://www.ricoh-imaging.co.jp/english/products/q-s1/ex/img/ex-thumb-pic01.jpg', [Validators.required]],
      content: ['', [Validators.required]],
      tags: [[], [Validators.required]]
    })
  }

  public saveArticle() {
    console.log(this.form.value);
    this.articleService.updateToSave(this.form.value).pipe(
      tap(() => this.router.navigateByUrl('/'))
    ).subscribe();
  }

  public publishArticle() {
    console.log(this.form.value);
    this.articleService.updateToPublish(this.form.value).pipe(
      tap(() => this.router.navigateByUrl('/'))
    ).subscribe();
  }

  public onClickFileUpload() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();

    // fileInput.onchange = () => {
    //   this.file = {
    //     data: fileInput.files[0],
    //     inProgress: false,
    //     progress: 0
    //   };
    //   this.fileUpload.nativeElement.value = '';
    //   this.uploadFile();
    // };    
  }

  public uploadFile() {
    // const formData = new FormData();
    // formData.append('file', this.file.data);
    // this.file.inProgress = true;

    // this.blogService.uploadHeaderImage(formData).pipe(
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

  public removeFile() {
    if (this.form.controls['thumbnail'].value !== '') this.form.controls['thumbnail'].setValue('')
  }

  onItemSelect(_item: any) {
    this.selectTag()
    console.log(this.form.value.content);
    console.log(this.form.value.tags);
  }

  onSelectAll(items: any) {
    this.form.controls['tags'].setValue(items)
    this.selectTag()
  }

  selectTag(): void {
    this.selectedTags = this.getFullObjectsBySelectedTagsIds(this.getSelectedTagsIds())
    this.form.controls['tags'].setValue(this.selectedTags)
  }

  getSelectedTagsIds() {
    return this.form.value.tags.map((tag: Tag) => tag.id)
  }

  getFullObjectsBySelectedTagsIds(ids: any) {
    return this.tagListDrop.filter(item => ids.includes(item.id))
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
      // itemsShowLimit: 3,
      // limitSelection: 3
    };
  }

}
