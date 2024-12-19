import { Injectable } from '@angular/core';
import { CourseService } from '../school/courses/course.service';
import { MessageService } from '../services/message.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CourseEnrollment } from '../school/studentCourse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  /**
   * Vérifie l'abonnement de l'utilisateur, avec enrôlement si nécessaire.
   */
  checkSubscriptionAndEnroll(
    userId: string,
    courseId: string,
    lessonId?: string
  ): Observable<boolean | CourseEnrollment> {
    return this.courseService
      .findSubscribedByCourseId({ courseId, userId })
      .pipe(
        // Abonnement trouvé
        tap(() => console.log(`L'utilisateur ${userId} est déjà inscrit au cours ${courseId}.`)),
        map((data: CourseEnrollment) => data),
        catchError(() => {
          // Abonnement non trouvé : tenter l'enrôlement
          this.messageService.cancel();
          return this.enrollUser(courseId, lessonId);
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
  private enrollUser(courseId: string, lessonId?: string): Observable<boolean | CourseEnrollment> {
    this.cleanLocalSubscriptions(courseId);
    this.messageService.cancel();

    return this.courseService.subscribeToCourse(+courseId).pipe(
      tap(() => {
        this.updateLocalSubscriptions(courseId);
        console.log(`Utilisateur enrôlé automatiquement au cours ${courseId}`);
        this.updateLocalSubscriptions(courseId);
        this.navigateToLesson(courseId, lessonId);
      }),
      // map(() => true),
      map((data: CourseEnrollment) => data)
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
   * Met à jour les abonnements dans le localStorage.
   */
  private updateLocalSubscriptions(courseId: string): void {
    const subIds = JSON.parse(localStorage.getItem('_subs') || '[]');
    const updatedSubs = [...subIds, +courseId];
    localStorage.setItem('_subs', JSON.stringify(updatedSubs));
  }

  /**
  * Navigue vers une page de cours.
  * @param courseId ID du cours
  */
  private navigateToLesson(courseId: string, lessonId?: string): void {
    if (!lessonId || !(/^\d+$/).test(lessonId)) {
      this.router.navigateByUrl(`/cours/${courseId}${'/%3F'}`);
    }
  }
}
