import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Utilization } from './utilization';

describe('Utilization', () => {
  let component: Utilization;
  let fixture: ComponentFixture<Utilization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Utilization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Utilization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
