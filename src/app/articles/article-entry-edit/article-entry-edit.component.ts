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
  public activeTab: string = 'editor';

  form!: FormGroup;

  markdown = `## Markdown __rulez__!
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
 \`Hello\`

  ### Links
  [link_text](https://google.com)

  ### Image
  ![Screenshot from 2021-11-04 09-32-25.png](https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300)

  ### Embed Video
  [![Alternate Text]({image-url})]({video-url} "Link Title")
  [![Alternate Text](https://img.youtube.com/watch?v=J1BDEl9uS18.jpg)](https://www.youtube.com/watch?v=J1BDEl9uS18)

  <figure class="video_container">
  <video controls="true" allowfullscreen="true" poster="path/to/poster_image.png">
    <source src="https://www.youtube.com/watch?v=J1BDEl9uS18" type="video/mp4">
    <source src="https://www.youtube.com/watch?v=J1BDEl9uS18" type="video/ogg">
    <source src="https://www.youtube.com/watch?v=J1BDEl9uS18" type="video/webm">
  </video>
  </figure>

  ### Embed Iframe
  
  <figure class="video_container">
  <iframe src="https://www.youtube.com/embed/J1BDEl9uS18" frameborder="0" allowfullscreen="true"></iframe>
  </figure>

  ### Divider
  ---

  ### Inline HTML
  <dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
  </dl>

  This is a regular paragraph.

  <table>
  <tr>
  <td>Foo</td>
  </tr>
  </table>

  This is another regular paragraph.

  ### Gipgy
  {% giphy https://giphy.com/embed/pynZagVcYxVUk %}

  ### Mention a person
  @ericmbouwe

  ### Embed CodePen
  {% codepen https://codepen.io/mehraddev/pen/LYpwLVq %}

  ### Embed CodeSandBox
  {% codesandbox https://codesandbox.io/s/rough-wildflower-bfh4z?file=/src/components/App.js %}
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
