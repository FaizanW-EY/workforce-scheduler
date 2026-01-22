import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssignments } from './review-assignments';

describe('ReviewAssignments', () => {
  let component: ReviewAssignments;
  let fixture: ComponentFixture<ReviewAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewAssignments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAssignments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
