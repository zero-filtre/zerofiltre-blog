import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEntryEditComponent } from './article-entry-edit.component';

describe('ArticleEntryEditComponent', () => {
  let component: ArticleEntryEditComponent;
  let fixture: ComponentFixture<ArticleEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleEntryEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
