import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGetComponent } from './form-get.component';

describe('FormGetComponent', () => {
  let component: FormGetComponent;
  let fixture: ComponentFixture<FormGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
