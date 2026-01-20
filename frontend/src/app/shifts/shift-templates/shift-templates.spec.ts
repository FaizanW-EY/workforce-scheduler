import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTemplatesComponent } from './shift-templates';

describe('ShiftTemplates', () => {
  let component: ShiftTemplatesComponent;
  let fixture: ComponentFixture<ShiftTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
