import { TestBed } from '@angular/core/testing';

import { Supaservice } from './supaservice';

describe('Supaservice', () => {
  let service: Supaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Supaservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
