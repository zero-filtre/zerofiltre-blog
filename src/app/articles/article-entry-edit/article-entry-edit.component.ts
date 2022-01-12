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
