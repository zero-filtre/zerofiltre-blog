import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-no-network',
  templateUrl: './no-network.component.html',
  styleUrls: ['./no-network.component.css']
})
export class NoNetworkComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoNetworkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  onRetry(){
    this.dialogRef.close();
  }

}
