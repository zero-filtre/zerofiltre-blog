import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private hasHistory!: boolean
  private homeUrl = '/cours'

  constructor(
    private location: Location,
    private router: Router,
  ) {
    this.hasHistory = router.navigated;
  }

  back() {
    this.hasHistory = this.router.navigated;

    if (this.hasHistory) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.homeUrl);
    }
  }
}
