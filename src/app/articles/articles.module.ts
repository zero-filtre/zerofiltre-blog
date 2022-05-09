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

import { ImagekitioAngularModule } from 'imagekitio-angular';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    ArticleDetailComponent,
    ArticlesListComponent,
    ArticleEntryPopupComponent,
    ArticleEntryCreateComponent,
    ArticleItemComponent,
    ArticleListContainerComponent,
    DeleteArticlePopupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
    MarkdownModule.forChild(),
    ImagekitioAngularModule.forRoot({
      publicKey: 'public_TOa/IP2yX1o2eHip4nsS+rPLsjE=', // or environment.publicKey
      urlEndpoint: 'https://ik.imagekit.io/lfegvix1p', // or environment.urlEndpoint
      authenticationEndpoint: environment.ovhTokenUrl // or environment.authenticationEndpoint
    })
  ]
})
export class ArticlesModule { }
