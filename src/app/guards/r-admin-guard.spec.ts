import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { rAdminGuard } from './r-admin-guard';

describe('rAdminGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => rAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
