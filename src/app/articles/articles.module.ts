import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleDetailComponent } from './article-detail-page/article-detail.component';
import { ArticlesListComponent } from './article-list-page/articles-list.component';
import { SharedModule } from '../shared/shared.module';
import { ArticleEntryPopupComponent } from './article-entry-popup/article-entry-popup.component';
import { MarkdownModule } from 'ngx-markdown';
import { ArticleEntryCreateComponent } from './article-entry-create-page/article-entry-create.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleListContainerComponent } from './article-list-container/article-list-container.component';
import { DeleteArticlePopupComponent } from './delete-article-popup/delete-article-popup.component';
import { NoNetworkComponent } from '../shared/no-network/no-network.component';


@NgModule({
  declarations: [
    ArticleDetailComponent,
    ArticlesListComponent,
    ArticleEntryPopupComponent,
    ArticleEntryCreateComponent,
    ArticleItemComponent,
    ArticleListContainerComponent,
    DeleteArticlePopupComponent,
    NoNetworkComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
    MarkdownModule.forChild(),
  ]
})
export class ArticlesModule { }
