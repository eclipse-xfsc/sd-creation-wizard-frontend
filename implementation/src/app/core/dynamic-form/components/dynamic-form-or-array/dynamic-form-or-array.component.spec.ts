import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFormOrArrayComponent} from './dynamic-form-or-array.component';

describe('DynamicFormOrArrayComponent', () => {
  let component: DynamicFormOrArrayComponent;
  let fixture: ComponentFixture<DynamicFormOrArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormOrArrayComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormOrArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
