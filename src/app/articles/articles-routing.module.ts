import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsFormValidGuard } from '../is-form-valid.guard';
import { TokenExpiredGuard } from '../shared/guard/token-expired.guard';
import { AuthGuard } from '../user/auth.guard';
import { AuthorGuard } from '../user/author.guard';
import { ArticleDetailComponent } from './article-detail-page/article-detail.component';
import { ArticleEntryCreateComponent } from './article-entry-create-page/article-entry-create.component';
import { ArticlesListComponent } from './article-list-page/articles-list.component';

const routes: Routes = [
  { path: '', component: ArticlesListComponent, canActivate: [TokenExpiredGuard] },
  { path: ':id', component: ArticleDetailComponent, canActivate: [TokenExpiredGuard] },

  {
    path: ':id/edit',
    component: ArticleEntryCreateComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, AuthorGuard],
    canDeactivate: [IsFormValidGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthorGuard],
})
export class ArticlesRoutingModule { }
