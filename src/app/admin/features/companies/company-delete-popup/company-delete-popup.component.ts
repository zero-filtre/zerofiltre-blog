import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { CompanyService } from '../../../features/companies/company.service';

@Component({
  selector: 'app-company-delete-popup',
  templateUrl: './company-delete-popup.component.html',
  styleUrls: ['./company-delete-popup.component.css'],
})
export class CompanyDeletePopupComponent {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CompanyDeletePopupComponent>,
    private messageService: MessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyService: CompanyService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteCompany(): void {
    this.loading = true;

    const { company: { id, companyName, siren } } = this.data;
    const bodyData = { id, companyName, siren };

    this.companyService
      .deleteCompany(bodyData)
      .pipe(
        catchError((err) => {
          this.loading = false;
          return throwError(() => err?.message);
        })
      )
      .subscribe((message: string) => {
        this.loading = false;
        this.dialogRef.close(message);
      });
  }

  ngOnInit(): void {
    // do nothing.
  }
}
