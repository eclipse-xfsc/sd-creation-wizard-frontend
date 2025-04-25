import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {FormField} from '@models/form-field.model';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent implements OnInit {

  @Input() ctrl: FormControl;
  @Input() ctrlAll: FormArray;
  @Input() label: string;
  @Input() displayAll: false;
  @Input() formField: FormField;
  @Input() form: FormGroup = new FormGroup({});

  allErrors: string[] = [];

  ERROR_MESSAGE = {
    required: () => `${this.label} is required.`,
    minlength: (par) => `${this.label} must be minimum ${par.requiredLength} characters.`,
    maxlength: (par) => `${this.label} must be maximum ${par.requiredLength} characters.`,
    min: (par) => `The minimum value of ${this.label} must be ${par.min}.`,
    max: (par) => `The maximum value of ${this.label} must be ${par.max}.`,
    pattern: (par) => `The pattern allowed ${par.requiredPattern}`,
    lessthan: (par) => `The value must be less than ${par}.`,
    uriPattern: () => `The value must be a URI.`,
    urlPattern: () => `The value must be a URL.`,
    childrenValid: () => `${this.label} is required.`
  };

  constructor() {
  }

  ngOnInit(): void {
    if (this.displayAll) {
      this.allErrors = this.listOfAllErrors([], this.formField, this.form);
    }
  }

  shouldShowErrors(): boolean {
    return this.ctrl && this.ctrl.errors && this.ctrl.touched && !(this.ctrl instanceof FormGroup);
  }

  shouldShowShapesErrors(): boolean {
    return this.ctrl && this.ctrl.errors && this.ctrl instanceof FormGroup;
  }

  listOfErrors(): string[] {
    if (this.ctrl && this.ctrl.errors) {
      return Object.keys(this.ctrl.errors).map(
        err => this.ERROR_MESSAGE[err](this.ctrl.getError(err))
      );
    }
  }

  listOfAllErrors(result, formField: FormField, formGroup: FormGroup): string[] {
    if (formField.childrenSchema === '') {
      this.label = formField.name;
      // Get errors when single dynamic input
      const ctrlAll = formGroup.get(formField.id) as FormArray;
      const controlErrors: ValidationErrors = formGroup.get(formField.id)?.errors;
      if (controlErrors) {
        result.push(Object.keys(controlErrors).map(
          err => this.ERROR_MESSAGE[err](ctrlAll.getError(err))
        ));
      }
      // Get erros when array dynamic input
      const controls = ctrlAll?.controls;
      if (controls !== undefined && controls.length > 0) {
        controls.forEach(element => {
          const controlErrorsElement: ValidationErrors = element?.errors;
          if (controlErrorsElement) {
            result.push(Object.keys(controlErrorsElement).map(
              err => this.ERROR_MESSAGE[err](element.getError(err))
            ));
          }
        });
      }
    } else {
      if (formField.required) {
        const nestedformGroup = formGroup.get(formField.id) as FormGroup;
        const controlErrors: ValidationErrors = formGroup.get(formField.id)?.errors;
        if (controlErrors) {
          result.push(Object.keys(controlErrors).map(
            err => this.ERROR_MESSAGE[err](nestedformGroup.getError(err))
          ));
        }
        formField.childrenFields.forEach(childrenField => {
          this.listOfAllErrors(result, childrenField, nestedformGroup);
        });
      }
    }

    return result;
  }

}
