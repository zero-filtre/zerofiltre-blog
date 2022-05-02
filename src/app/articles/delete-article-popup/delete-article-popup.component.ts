import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-delete-article-popup',
  templateUrl: './delete-article-popup.component.html',
  styleUrls: ['./delete-article-popup.component.css']
})
export class DeleteArticlePopupComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteArticlePopupComponent>,
    private messageService: MessageService,
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteArticle(): void {
    this.loading = true;
    console.log('ID: ', this.data.id)

    this.articleService.deleteArticle(this.data.id).subscribe({
      next: (response: any) => {
        if (this.data.hasHistory) {
          this.location.back();
        } else {
          this.router.navigateByUrl('/articles');
        }
        this.messageService.openSnackBarSuccess(response, 'OK');
        this.loading = false;
        this.dialogRef.close();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
  }
}
