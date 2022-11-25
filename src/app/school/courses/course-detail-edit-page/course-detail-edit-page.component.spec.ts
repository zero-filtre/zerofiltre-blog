import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailEditPageComponent } from './course-detail-edit-page.component';

describe('CourseDetailEditPageComponent', () => {
  let component: CourseDetailEditPageComponent;
  let fixture: ComponentFixture<CourseDetailEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseDetailEditPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDetailEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
