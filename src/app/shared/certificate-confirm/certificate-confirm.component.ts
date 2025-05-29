import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EnrollmentService } from '../../services/enrollment.service';
import { CertificateResponse } from '../../school/courses/course';

@Component({
  selector: 'app-certificate-confirm',
  templateUrl: './certificate-confirm.component.html',
  styleUrls: ['./certificate-confirm.component.css'],
})
export class CertificateConfirmComponent {
  result: CertificateResponse | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  verifyCertificate(query: ParamMap) {
    const fullname = query.get('fullname')!;
    const courseTitle = query.get('courseTitle')!;
    const uuid = query.get('uuid')!;

    if (!fullname || !courseTitle || !uuid) {
      this.error = 'Paramètres manquants pour la vérification.';
      this.isLoading = false;
      return;
    }

    this.enrollmentService
      .verifyCourseCertificate(fullname, courseTitle, uuid)
      .pipe(
        catchError((err) => {
          this.error = 'Erreur de communication avec le serveur.';
          this.isLoading = false;
          return throwError(() => err);
        }),
        tap((data: CertificateResponse) => {
          this.result = data;
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe((query) => {
        this.verifyCertificate(query);
      });
    }
  }
}
