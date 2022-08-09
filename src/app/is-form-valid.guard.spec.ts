import { TestBed } from '@angular/core/testing';

import { IsFormValidGuard } from './is-form-valid.guard';

describe('IsFormValidGuard', () => {
  let guard: IsFormValidGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsFormValidGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
