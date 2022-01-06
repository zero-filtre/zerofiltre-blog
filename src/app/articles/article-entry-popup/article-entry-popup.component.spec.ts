import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEntryPopupComponent } from './article-entry-popup.component';

describe('ArticleEntryPopupComponent', () => {
  let component: ArticleEntryPopupComponent;
  let fixture: ComponentFixture<ArticleEntryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleEntryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEntryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
