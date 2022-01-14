import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleEntryCreateComponent } from './article-entry-create.component';


describe('ArticleEntryCreateComponent', () => {
  let component: ArticleEntryCreateComponent;
  let fixture: ComponentFixture<ArticleEntryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleEntryCreateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEntryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
