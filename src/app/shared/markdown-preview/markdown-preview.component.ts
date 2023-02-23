import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.css']
})
export class MarkdownPreviewComponent implements OnInit {
  @Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }

}
