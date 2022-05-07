import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private hasHistory!: boolean
  private homeUrl = '/articles'

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.hasHistory = router.navigated;
  }

  public back() {
    if (this.hasHistory) {
      this.location.back();
    } else {
      console.log('NO HISTORY')
      this.router.navigateByUrl(this.homeUrl);
    }
  }
}
