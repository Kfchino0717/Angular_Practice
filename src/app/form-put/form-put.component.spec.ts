import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPutComponent } from './form-put.component';

describe('FormPutComponent', () => {
  let component: FormPutComponent;
  let fixture: ComponentFixture<FormPutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
