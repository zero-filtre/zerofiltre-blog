import { Injectable } from '@angular/core';
import { CourseService } from '../school/courses/course.service';
import { MessageService } from '../services/message.service';
import { catchError, EMPTY, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { CourseEnrollment } from '../school/studentCourse';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient
  ) { }

  /**
   * Vérifie l'abonnement de l'utilisateur, avec enrôlement si nécessaire.
  */
  checkSubscriptionAndEnroll(
    userId: string,
    courseId: string,
    lessonId?: string,
    notRedirectToFirstLesson?: string
  ): Observable<boolean | CourseEnrollment> {
    return this.courseService.findSubscribedByCourseId({ courseId, userId }).pipe(
      switchMap((enrollment: CourseEnrollment) => {
        console.log(`L'utilisateur ${userId} est déjà inscrit au cours ${courseId}.`);
        if (!notRedirectToFirstLesson) {
          this.navigateToLesson(courseId, lessonId);
        }
        return of(enrollment);
      }),
      catchError(() => {
        // User is not subscribed, try enrollment
        this.messageService.cancel();
        return this.enrollUser(courseId, lessonId);
      }),
      catchError(() => {
        // Enrollment failed
        this.messageService.cancel();
        return of(null);
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

  // Verification du certificat
  verifyCourseCertificate(fullname: string, courseTitle: string, uuid: string): Observable<any> {
    const params = new HttpParams()
      .set('fullname', fullname)
      .set('courseTitle', courseTitle)
      .set('uuid', uuid);

    return this.http.get(`${this.apiServerUrl}/enrollment/certificate/verification`, {
      params: params,
    })
    .pipe(shareReplay());
  }
}
