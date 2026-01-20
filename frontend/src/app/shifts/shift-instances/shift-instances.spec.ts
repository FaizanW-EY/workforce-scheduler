import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftInstances } from './shift-instances';

describe('ShiftInstances', () => {
  let component: ShiftInstances;
  let fixture: ComponentFixture<ShiftInstances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftInstances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftInstances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
