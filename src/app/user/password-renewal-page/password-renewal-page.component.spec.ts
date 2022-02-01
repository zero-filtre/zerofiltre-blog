import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRenewalPageComponent } from './password-renewal-page.component';

describe('PasswordRenewalPageComponent', () => {
  let component: PasswordRenewalPageComponent;
  let fixture: ComponentFixture<PasswordRenewalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordRenewalPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRenewalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
