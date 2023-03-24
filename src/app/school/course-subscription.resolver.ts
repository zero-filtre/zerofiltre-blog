import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { LoadEnvService } from '../services/load-env.service';
import { MessageService } from '../services/message.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user.model';
import { CourseService } from './courses/course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseSubscriptionResolver implements Resolve<boolean> {
  constructor(
    private loadEnvService: LoadEnvService,
    private messageService: MessageService,
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.authService.currentUsr as User
    if (!user) return EMPTY;

    const data = { courseId: route.params?.course_id, userId: user.id }

    return this.courseService.findSubscribedByCourseId(data)
      .pipe(
        catchError(_ => {
          this.messageService.openSnackBarError("Oops cette SUB n'existe pas 😣!", 'OK');
          return EMPTY;
        })
      )
  }
}
