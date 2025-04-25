import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MaterialModule} from 'src/app/material.module';

import {DynamicSelfLoopsComponent} from './dynamic-self-loops.component';

describe('DynamicSelfLoopsComponent', () => {
  let component: DynamicSelfLoopsComponent;
  let fixture: ComponentFixture<DynamicSelfLoopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSelfLoopsComponent],
      imports: [MaterialModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSelfLoopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
