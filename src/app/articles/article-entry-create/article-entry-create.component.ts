import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-entry-create',
  templateUrl: './article-entry-create.component.html',
  styleUrls: ['./article-entry-create.component.css']
})
export class ArticleEntryCreateComponent implements OnInit {

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
    <div>
    <iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="300"
    height="200"
    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik">
    </iframe>
    </div>

    ### Divider
    ---

  <iframe src="https://www.youtube.com/embed/yz8x71BiGXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>

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
