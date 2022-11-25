import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-no-network',
  templateUrl: './no-network.component.html',
  styleUrls: ['./no-network.component.css']
})
export class NoNetworkComponent implements OnInit {

  @Output() submitClicked = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<NoNetworkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // do nothing.
  }


  onRetry() {
    this.submitClicked.emit('RETRY');
    this.dialogRef.close();
    window.location.reload();
  }

}
