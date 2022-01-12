import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-entry-edit',
  templateUrl: './article-entry-edit.component.html',
  styleUrls: ['./article-entry-edit.component.css']
})
export class ArticleEntryEditComponent implements OnInit {

  // @ViewChild('fileUpload', { static: false })
  // fileUpload!: ElementRef;
  // public markdown!: string;
  public activeTab: string = 'editor';

  public form!: FormGroup;

  markdown = `
    ## Markdown __rulez__!
    # Jo
    ---

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

    ### Embed Video
    [![]({image-url})]({video-url} "Link Title")

    ### Embed Iframe


    ### Divider
    ---

    ### Inline HTML
    <dl>
    <dt>Definition list</dt>
    <dd>Is something people use sometimes.</dd>

    <dt>Markdown in HTML</dt>
    <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
    </dl>


    ### Gipgy

    ### Mention a person

    ### Embed CodePen

    ### Embed CodeSandBox
    `;

  constructor(
    // private formuilder: FormBuilder,
    // private articleService: ArticleService
  ) { }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  ngOnInit(): void {
  }

}
