import { TestBed } from '@angular/core/testing';

import { LoadEnvService } from './load-env.service';

describe('LoadEnvService', () => {
  let service: LoadEnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadEnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
