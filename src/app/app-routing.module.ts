import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleEntryCreateComponent } from './articles/article-entry-create/article-entry-create.component';
import { ArticlesListComponent } from './articles/articles-list/articles-list.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  // { path: '', component: HomePageComponent },
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  {
    path: 'articles',
    loadChildren: () =>
      import('./articles/articles.module').then(m => m.ArticlesModule),
  },
  {
    path: 'article/new', component: ArticleEntryCreateComponent
  },
  { path: '**', component: ArticlesListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
