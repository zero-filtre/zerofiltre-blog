import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { SharedModule } from '../shared/shared.module';
import { ArticleEntryPopupComponent } from './article-entry-popup/article-entry-popup.component';
import { ArticleEntryEditComponent } from './article-entry-edit/article-entry-edit.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    ArticleDetailComponent,
    ArticlesListComponent,
    ArticleEntryPopupComponent,
    ArticleEntryEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
    MarkdownModule.forChild()
  ]
})
export class ArticlesModule { }
