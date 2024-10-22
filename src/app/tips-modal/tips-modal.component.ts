import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tips-modal',
  templateUrl: './tips-modal.component.html',
  styleUrls: ['./tips-modal.component.css'],
})
export class TipsModalComponent {
  constructor(
    private modalRef: MatDialogRef<TipsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  public closeModal() {
    this.modalRef.close();
  }
}
