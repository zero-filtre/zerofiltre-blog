import { Component, OnInit } from '@angular/core';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-article-list-container',
  templateUrl: './article-list-container.component.html',
  styleUrls: ['./article-list-container.component.css']
})
export class ArticleListContainerComponent implements OnInit {

  constructor(
    private loadEnvService: LoadEnvService,
  ) { }

  ngOnInit(): void {
  }

}
