import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CourseService } from '../courses/course.service';
import { Course } from '../courses/course';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';
import { isPlatformServer } from '@angular/common';
import { LessonService } from './lesson.service';

@Injectable({
  providedIn: 'root'
})
export class LessonAccessGuard implements CanActivate {
  constructor(
    private lessonService: LessonService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    // do nothing.
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const lessonID = route.params?.lesson_id
    const user = this.authService?.currentUsr as User

    if (isPlatformServer(this.platformId)) return true;
    
    if (lessonID == '?') return true;

    return this.lessonService.findLessonById(lessonID)
      .pipe(
        catchError(err => {
          this.router.navigateByUrl('**')
          return of(false);
        }),
        map((data: Course) => {
          return true;
        })
      )
  }

}
