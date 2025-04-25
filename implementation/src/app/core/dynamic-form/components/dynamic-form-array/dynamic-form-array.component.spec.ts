import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MaterialModule} from 'src/app/material.module';

import {DynamicFormArrayComponent} from './dynamic-form-array.component';

describe('DynamicFormArrayComponent', () => {
  let component: DynamicFormArrayComponent;
  let fixture: ComponentFixture<DynamicFormArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormArrayComponent],
      imports: [MaterialModule, HttpClientModule]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
