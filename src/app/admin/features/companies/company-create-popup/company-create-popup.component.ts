import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CompanyService } from '../../../features/companies/company.service';
import { Company } from '../company.model';

@Component({
  selector: 'app-company-create-popup',
  templateUrl: './company-create-popup.component.html',
  styleUrls: ['./company-create-popup.component.css'],
})
export class CompanyCreatePopupComponent {
  public companyName: string = '';
  public siren: string = '';
  public loading: boolean = false;
  public company!: Company;

  constructor(
    public dialogRef: MatDialogRef<CompanyCreatePopupComponent>,
    private companyService: CompanyService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleCourseInit(): void {
    if (!this.companyName.trim()) return;

    this.loading = true;

    const bodyData = {
      companyName: this.companyName,
      siren: this.siren,
    };

    this.companyService
      .createCompany(bodyData)
      .pipe(
        catchError((err) => {
          this.loading = false;
          return throwError(() => err);
        })
      )
      .subscribe((company: Company) => {
        this.dialogRef.close(company);
        this.loading = false;
      });
  }

  ngOnInit(): void {
    // do nothing.
  }
}
