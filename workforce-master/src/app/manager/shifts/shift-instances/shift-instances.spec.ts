import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftInstancesComponent } from './shift-instances';

describe('ShiftInstancesComponent', () => {
  let component: ShiftInstancesComponent;
  let fixture: ComponentFixture<ShiftInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftInstancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
