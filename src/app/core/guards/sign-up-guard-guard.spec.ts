import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signUpGuardGuard } from './sign-up-guard-guard';

describe('signUpGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signUpGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
