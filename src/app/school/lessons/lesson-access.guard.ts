import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import { CourseService } from '../courses/course.service';
import { Course } from '../courses/course';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class LessonAccessGuard implements CanActivate {
  constructor(
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
  ) {
    // do nothing.
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseID = route.params?.course_id
    const user = this.authService?.currentUsr as User
    
    return this.courseService.findCourseById(courseID)
      .pipe(
        catchError(err => {
          this.router.navigateByUrl('**')
          return of(false);
        }),
        map((data: Course) => {
          if (data.status !== 'PUBLISHED' && !user) {
            this.router.navigateByUrl('**')
            return false;
          }else {
            return true
          }
        })
      )
  }

}
