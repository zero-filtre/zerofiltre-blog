import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Article } from '../article.model';
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

  markdown = `
    ## Markdown __rulez__!

    ### Syntax highlight
    \`\`\`ts
      const language = 'typescript';
    \`\`\`

    ### Ordered Lists
    1. bullet point
    2. Another bullet point

    ### Unordered list
    - Unordered bullet
    - Another unordered bullet

    ### Blockquote
    > Blockquote to the max

    \`\`\`js
      const language = 'javascript';
    \`\`\`

    \`\`\`java
      String language = "java";
    \`\`\`

    ### Inline code
   \`Inline code\`

    ### Links
    [google-link](https://google.com)

    ### Image
    ![Screenshot from 2021-11-04 09-32-25.png](https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300)

    ### Embed Iframe
    <iframe src="https://www.youtube.com/embed/yz8x71BiGXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>

    ### Divider
    ---
    `;

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

  public getArticle(): void{
    this.articleService.getOneArticle(this.articleId).subscribe({
      next: (response: Article) => {
        this.article = response
        this.articleTitle = response.title!
        this.form.controls['title'].setValue(this.articleTitle)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    })
  }

  public InitForm(): void {
    this.form = this.formuilder.group({
      title: [null, [Validators.required]],
      coverImage: [null, [Validators.required]],
      content: [null, [Validators.required]],
    })
  }

  public postArticle() {
    this.articleService.updateArticle(this.form.getRawValue()).pipe(
      tap(() => this.router.navigateByUrl('/'))
    ).subscribe();
  }

  public onClickFileUpload() {
    const fileInput = this.fileUpload.nativeElement;
    console.log('Clicked');
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

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id
    this.getArticle()
    this.InitForm()
  }

}
