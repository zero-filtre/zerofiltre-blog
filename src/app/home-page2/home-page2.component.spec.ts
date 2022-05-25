import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage2Component } from './home-page2.component';

describe('HomePage2Component', () => {
  let component: HomePage2Component;
  let fixture: ComponentFixture<HomePage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePage2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
