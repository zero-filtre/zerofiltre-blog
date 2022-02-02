import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfirmationPageComponent } from './account-confirmation-page.component';

describe('AccountConfirmationPageComponent', () => {
  let component: AccountConfirmationPageComponent;
  let fixture: ComponentFixture<AccountConfirmationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountConfirmationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
