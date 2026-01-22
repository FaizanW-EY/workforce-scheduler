import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAssign } from './auto-assign';

describe('AutoAssign', () => {
  let component: AutoAssign;
  let fixture: ComponentFixture<AutoAssign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoAssign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoAssign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
