import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListPageComponent } from './course-list-page.component';

describe('CourseListPageComponent', () => {
  let component: CourseListPageComponent;
  let fixture: ComponentFixture<CourseListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
