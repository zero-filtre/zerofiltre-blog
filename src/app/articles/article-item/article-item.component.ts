import { Component, OnInit } from '@angular/core';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {

  constructor(
    private loadEnvService: LoadEnvService
  ) { }

  ngOnInit(): void {
  }

}
