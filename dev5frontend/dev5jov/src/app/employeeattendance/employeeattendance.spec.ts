import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employeeattendance } from './employeeattendance';

describe('Employeeattendance', () => {
  let component: Employeeattendance;
  let fixture: ComponentFixture<Employeeattendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Employeeattendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Employeeattendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
