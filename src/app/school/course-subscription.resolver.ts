import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
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
    private authService: AuthService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.authService?.currentUsr as User
    const courseID = route.params?.course_id
    const lessonID = route.params?.lesson_id


    if (!user) return of(true)

    const data = { courseId: courseID , userId: user.id }

    return this.courseService.findSubscribedByCourseId(data)
      .pipe(
        catchError(_ => {
          
          this.messageService.cancel();
          const subIds = JSON.parse(localStorage?.getItem('_subs'));
          localStorage?.setItem('_subs', JSON.stringify(subIds.filter(id => id != courseID)));

          if (!this.authService.isPro) return of(true);

          return this.courseService.subscribeToCourse(+courseID)
            .pipe(tap(data => {
              if (!lessonID) this.router.navigateByUrl(`/cours/${courseID}${"/%3F"}`)
            }))

        })
      )
  }
}
