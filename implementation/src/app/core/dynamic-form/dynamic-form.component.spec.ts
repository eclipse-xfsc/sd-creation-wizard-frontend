import {DatePipe} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FilesProvider} from '@shared/files-provider';
import {MaterialModule} from 'src/app/material.module';

import {DynamicFormComponent} from './dynamic-form.component';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      declarations: [DynamicFormComponent],
      providers: [DatePipe, FilesProvider]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'getCurrentNavigation').and.returnValue({extras: {state: {data: 'data'}}} as any);
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
