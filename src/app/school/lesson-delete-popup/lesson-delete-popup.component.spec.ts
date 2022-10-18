import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonDeletePopupComponent } from './lesson-delete-popup.component';

describe('LessonDeletePopupComponent', () => {
  let component: LessonDeletePopupComponent;
  let fixture: ComponentFixture<LessonDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
