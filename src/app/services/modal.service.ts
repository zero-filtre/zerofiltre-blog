import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../user/user.model';
import { AddEmailPopupComponent } from '../shared/add-email-popup/add-email-popup.component';
import { SearchPopupComponent } from '../shared/search-popup/search-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private dialogRef: MatDialog
  ) { }

  checkUserEmail(user: User) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = regex.test(user.email!);
  
    if (validEmail) {
      return;
    } else {
      this.openEmailModal();
    }
  }

  private openEmailModal() {
    this.dialogRef.open(AddEmailPopupComponent, {
      panelClass: 'popup-panel',
      disableClose: true,
    });
  }

  public openSearchModal() {
    this.dialogRef.open(SearchPopupComponent, {
      panelClass: 'popup-search',
      backdropClass: 'popup-search-overlay',
      disableClose: false,
      minHeight: '400px',
      width: '700px'
    });
  }

  public toggleSearchModal(isOpen: boolean) {
    if(isOpen) {
      this.openSearchModal();
    } else {
      this.dialogRef.closeAll()
    }
  }

}
