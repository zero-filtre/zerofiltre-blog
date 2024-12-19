import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from '../services/message.service';
import { CourseService } from './courses/course.service';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseEnrollmentResolver implements Resolve<boolean> {
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformID: any
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!isPlatformBrowser(this.platformID)) return EMPTY;

    const user = this.authService?.currentUsr;
    const courseId = route.params['course_id']?.split('-')[0];
    const lessonId = route.params?.lesson_id?.split('-')[0];

    if (!user || !courseId) {
      return of(true);
    }

    this.messageService.cancel();

    return this.checkSubscription(user.id, courseId, lessonId);
  }

  /**
   * Vérifie l'abonnement de l'utilisateur, avec enrôlement si nécessaire.
   */
  private checkSubscription(
    userId: string,
    courseId: string,
    lessonId: string
  ): Observable<boolean> {
    return this.courseService
      .findSubscribedByCourseId({ courseId, userId })
      .pipe(
        // tap(() => this.navigateToCourse(courseId)),
        map(() => true), // Abonnement trouvé, navigation autorisée
        catchError(() => {
          // Erreur : tenter l'enrôlement
          this.messageService.cancel();
          return this.enrollUser(courseId, lessonId);
        }),
        catchError(() => {
          // En cas d'échec d'enrôlement, permettre la navigation
          this.messageService.cancel();
          return of(true);
        })
      );
  }

  /**
   * Enrôle automatiquement l'utilisateur au cours.
   */
  private enrollUser(courseId: string, lessonId: string): Observable<boolean> {
    this.cleanLocalSubscriptions(courseId);

    return this.courseService.subscribeToCourse(+courseId).pipe(
      tap(() => {
        console.log(`Utilisateur enrôlé automatiquement au cours ${courseId}`)
        if (!lessonId) this.navigateToCourse(courseId);
      }),
      map(() => true)
    );
  }

  /**
   * Nettoie les abonnements obsolètes dans le localStorage.
   */
  private cleanLocalSubscriptions(courseId: string): void {
    const subIds = JSON.parse(localStorage.getItem('_subs') || '[]');
    const updatedSubs = subIds.filter((id: string) => id !== courseId);
    localStorage.setItem('_subs', JSON.stringify(updatedSubs));
  }

  /**
  * Navigue vers une page de cours.
  * @param courseId ID du cours
  */
  private navigateToCourse(courseId: string): void {
    this.router.navigateByUrl(`/cours/${courseId}${'/%3F'}`);
  }
}
