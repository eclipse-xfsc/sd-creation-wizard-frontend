import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {FormfieldControlService} from './form-field.service';

describe('FormFieldService', () => {
  let service: FormfieldControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(FormfieldControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
