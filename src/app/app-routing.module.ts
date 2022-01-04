import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleEntryEditComponent } from './articles/article-entry-edit/article-entry-edit.component';
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
    path: 'article-entry-edit', component: ArticleEntryEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
