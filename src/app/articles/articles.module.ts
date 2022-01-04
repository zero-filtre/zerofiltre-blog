import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { SharedModule } from '../shared/shared.module';
import { ArticleEntryPopupComponent } from './article-entry-popup/article-entry-popup.component';


@NgModule({
  declarations: [
    ArticleDetailComponent,
    ArticlesListComponent,
    ArticleEntryPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
