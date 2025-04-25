import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {CustomValidators} from '@validations/custom-validators';

@Injectable({
  providedIn: 'root'
})


export class ValidationControlService {

  getValidation(validation): ValidatorFn {
    let validator: ValidatorFn;
    switch (validation.key) {
      case 'minLength':
        validator = Validators.minLength(validation.value);
        break;
      case 'maxLength':
        validator = Validators.maxLength(validation.value);
        break;
      case 'minInclusive':
        validator = Validators.min(validation.value);
        break;
      case 'maxInclusive':
        validator = Validators.max(validation.value);
        break;
      case 'minExclusive':
        validator = Validators.min(validation.value + 1);
        break;
      case 'maxExclusive':
        validator = Validators.max(validation.value - 1);
        break;
      case 'pattern':
        validator = Validators.pattern(validation.value);
        break;
      case 'lessThan':
        validator = CustomValidators.lessThanValidator(validation.value);
        break;
    }
    return validator;
  }

  getValidatorFn(input: FormField): ValidatorFn[] {
    const validator: ValidatorFn[] = [];
    input.validations.forEach(validation => {
      const specificValidation = this.getValidation(validation);
      if (specificValidation !== undefined) {
        validator.push(specificValidation);
      }
    });

    if (input.required) {
      validator.push(Validators.required);
    }
    if (input.datatype !== undefined && typeof input.datatype.value === 'string' )
    {
      if (input.datatype.value.toLowerCase().includes('uri')) {
        validator.push(CustomValidators.uriPatternValidator());
      }

      if (input.datatype.value.toLowerCase().includes('iri')) {
        validator.push(CustomValidators.urlPatternValidator());
      }
    }

    if (input.componentType === 'dynamicExpanded' && !input.selfLoop && input.required) {
      validator.push(CustomValidators.checkChildrenValidity());
    }
    return validator;
  }
}
