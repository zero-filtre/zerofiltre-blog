import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendConfirmationPageComponent } from './resend-confirmation-page.component';

describe('ResendConfirmationPageComponent', () => {
  let component: ResendConfirmationPageComponent;
  let fixture: ComponentFixture<ResendConfirmationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendConfirmationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
