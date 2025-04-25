import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {ValidationControlService} from '@services/validation.service';
import {Utils} from '@shared/utils';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html',
  styleUrls: ['./dynamic-form-array.component.scss']
})
export class DynamicFormArrayComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  inputs: FormArray = new FormArray([]);
  enableButton = true;
  displayAddButton = true;
  validator: ValidatorFn[];
  validationService: ValidationControlService = new ValidationControlService();

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.inputs = this.form.get(this.input.id) as FormArray;
    this.validator = this.validationService.getValidatorFn(this.input);
    // In the for loop we specify the limit (this.input.minCount-1) because the FormArray comes with a FormControl added by the service
    for (let i = 0; i < this.input.minCount - 1; i++) {
      // The form array has only a single FormControl
      this.inputs.push(new FormControl(this.input.value || null, this.validator));
    }
    this.displayAddButton = this.input.maxCount === undefined || this.input.maxCount > this.input.minCount;
  }

  addInput(): void {
    if (this.input.required) {
      // Remove the required validator from the new added inputs
      this.validator.pop();
    }
    this.inputs.push(new FormControl(this.input.value || '', this.validator));
    this.updateEnableButton();
  }


  deleteInput(index: number): void {
    if (this.inputs.length !== 1) {
      this.inputs.removeAt(index);
    }
    this.updateEnableButton();
  }

  updateEnableButton(): void {
    const maxCount = this.input.maxCount;
    if (maxCount !== undefined) {
      this.enableButton = this.inputs.length < maxCount;
    }
  }

  addFullWidthClass(i): boolean {
    return !this.displayAddButton || (i !== 0 && i < this.input.minCount);
  }

  addNonFullWidthClass(i): boolean {
    return this.displayAddButton && (i === 0 || this.input.minCount === 1
      || this.input.maxCount === 0 || i >= this.input.minCount);
  }

  hasRequiredValidator(control: FormControl): boolean {
    return Utils.hasRequiredField(control);
  }
}
