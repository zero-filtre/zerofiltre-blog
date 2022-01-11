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

  form!: FormGroup;

  constructor(
    // private formuilder: FormBuilder,
    // private articleService: ArticleService
  ) { }

  ngOnInit(): void {
  }

}
