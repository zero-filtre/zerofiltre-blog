import { Injectable } from '@angular/core';
import { CourseService } from '../school/courses/course.service';
import { MessageService } from '../services/message.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CourseEnrollment } from '../school/studentCourse';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(
    private courseService: CourseService,
    private messageService: MessageService
  ) { }

  /**
   * Vérifie l'abonnement de l'utilisateur, avec enrôlement si nécessaire.
   */
  checkSubscriptionAndEnroll(
    userId: string,
    courseId: string
  ): Observable<boolean | CourseEnrollment> {
    return this.courseService
      .findSubscribedByCourseId({ courseId, userId })
      .pipe(
        // Abonnement trouvé
        tap(() =>
          console.log(
            `L'utilisateur ${userId} est déjà inscrit au cours ${courseId}.`
          )
        ),
        map(() => true),
        catchError(() => {
          // Abonnement non trouvé : tenter l'enrôlement
          this.messageService.cancel();
          return this.enrollUser(courseId);
        }),
        catchError(() => {
          // Échec de l'enrôlement
          this.messageService.cancel();
          return of(false);
        })
      );
  }

  /**
   * Enrôle automatiquement l'utilisateur au cours.
   */
  private enrollUser(courseId: string): Observable<boolean | CourseEnrollment> {
    this.cleanLocalSubscriptions(courseId);
    this.messageService.cancel();

    return this.courseService.subscribeToCourse(+courseId).pipe(
      tap((data) => {
        console.log(`Utilisateur enrôlé automatiquement au cours ${courseId}`);
        return data;
      })
      // map(() => true),
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
}
