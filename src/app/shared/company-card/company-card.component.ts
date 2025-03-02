import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Company } from '../../admin/features/companies/company.model';
import { AuthService } from '../../user/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDeletePopupComponent } from '../../admin/features/companies/company-delete-popup/company-delete-popup.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css'],
})
export class CompanyCardComponent {
  @Input() company: Company;
  @Output() onCompanyDeleteEvent = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    private dialogDeleteRef: MatDialog,
    private messageService: MessageService,
  ) {}

  parseUrl(url: string) {
    return encodeURIComponent(url);
  }

  canEditCompany(_company: Company) {
    return this.authService.canAccessAdminDashboard;
  }

  fetchAllCompanies() {
    this.onCompanyDeleteEvent.emit();
  }

  openCompanyDeleteDialog(company: Company): void {
    this.dialogDeleteRef
      .open(CompanyDeletePopupComponent, {
        panelClass: 'delete-article-popup-panel',
        data: { company: company },
      })
      .afterClosed()
      .subscribe((message: string) => {
        if (message) {
          this.fetchAllCompanies();
          this.messageService.openSnackBarSuccess(message, 'OK');
        }
      });
  }
}
