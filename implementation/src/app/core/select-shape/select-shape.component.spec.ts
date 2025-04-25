import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from 'src/app/material.module';

import {SelectShapeComponent} from './select-shape.component';

describe('SelectShapeComponent', () => {
  let component: SelectShapeComponent;
  let fixture: ComponentFixture<SelectShapeComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      declarations: [SelectShapeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'getCurrentNavigation').and.returnValue({extras: {state: {data: 'data'}}} as any);
    fixture = TestBed.createComponent(SelectShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
