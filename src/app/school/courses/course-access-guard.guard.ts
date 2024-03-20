import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CourseService } from './course.service';
import { AuthService } from 'src/app/user/auth.service';
import { isPlatformServer } from '@angular/common';
import { User } from 'src/app/user/user.model';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseAccessGuardGuard implements CanActivate {

  constructor(
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    // do nothing.
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseID = route.params?.course_id?.split('-')[0]
    const user = this.authService?.currentUsr as User

    if (isPlatformServer(this.platformId)) return true;

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
          } else {
            return true
          }
        })
      )
  }
  
}
