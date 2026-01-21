import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPatternsComponent } from './shift-patterns';

describe('ShiftPatterns', () => {
  let component: ShiftPatternsComponent;
  let fixture: ComponentFixture<ShiftPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
