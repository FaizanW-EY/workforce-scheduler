import { TestBed } from '@angular/core/testing';

import { ShiftAssignmentsModule } from './shift-assignments-module';

describe('ShiftAssignmentsModule', () => {
  let service: ShiftAssignmentsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftAssignmentsModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
