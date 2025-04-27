import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadcastService } from '../../services/broadcast.service'
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent {
  message: string = '';
  success: boolean = false;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private broadcastService: BroadcastService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  unsubscribe() {
    this.broadcastService
      .disableSub()
      .pipe(
        catchError((err) => {
          this.success = false;
          this.message = 'Erreur : votre désinscription a échoué. Merci de réessayer.';
          this.loading = false;
          return throwError(() => err);
        }),
        tap((_data) => {
          this.success = true;
          this.message = 'Vous avez été désinscrit avec succès de notre newsletter.';
          this.loading = false;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.unsubscribe();
    }
  }

}
