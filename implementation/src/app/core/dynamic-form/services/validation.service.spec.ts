import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ValidationControlService} from './validation.service';

describe('ValidationService', () => {
  let service: ValidationControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ValidationControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
