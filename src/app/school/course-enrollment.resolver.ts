import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { LoadEnvService } from '../services/load-env.service';
import { MessageService } from '../services/message.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user.model';
import { CourseService } from './courses/course.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CourseEnrollmentResolver implements Resolve<boolean> {
  constructor(
    private loadEnvService: LoadEnvService,
    private messageService: MessageService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformID: any
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.authService?.currentUsr as User
    const courseID = route.params?.course_id?.split('-')[0]
    const lessonID = route.params?.lesson_id?.split('-')[0]


    if (!user) return of(true)

    const data = { courseId: courseID , userId: user.id }
    if (isPlatformBrowser(this.platformID)){
      this.messageService.cancel();
      
      return this.courseService.findSubscribedByCourseId(data)
        .pipe(
          catchError(_ => {
            
            this.messageService.cancel();
            const subIds = JSON.parse(localStorage?.getItem('_subs'));
            localStorage?.setItem('_subs', JSON.stringify(subIds.filter(id => id != courseID)));

            if (!this.authService.isPro) return of(true);

            return this.courseService.subscribeToCourse(+courseID)
              .pipe(
                catchError(_ => of(true)),
                tap(data => {
                  if (!lessonID) this.router.navigateByUrl(`/cours/${courseID}${"/%3F"}`)
                })
              )

          })
        )
    }else {
      return EMPTY
    }
  }
}
