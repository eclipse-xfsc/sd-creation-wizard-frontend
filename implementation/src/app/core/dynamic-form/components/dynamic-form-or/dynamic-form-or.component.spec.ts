import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MaterialModule} from 'src/app/material.module';

import {DynamicFormOrComponent} from './dynamic-form-or.component';

describe('DynamicFormOrComponent', () => {
  let component: DynamicFormOrComponent;
  let fixture: ComponentFixture<DynamicFormOrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormOrComponent],
      imports: [MaterialModule, HttpClientModule]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
