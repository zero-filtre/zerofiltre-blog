import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth.guard';
import { AuthorGuard } from '../user/author.guard';
import { DddComponent } from './ddd/ddd.component';

const routes: Routes = [
  { path: 'learn-ddd', component: DddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthorGuard],
})
export class CoursesRoutingModule { }
