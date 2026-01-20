import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPatterns } from './shift-patterns';

describe('ShiftPatterns', () => {
  let component: ShiftPatterns;
  let fixture: ComponentFixture<ShiftPatterns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftPatterns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftPatterns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
