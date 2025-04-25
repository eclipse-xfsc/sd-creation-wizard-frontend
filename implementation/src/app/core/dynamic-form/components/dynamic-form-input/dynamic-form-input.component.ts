import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';
import {ValidationControlService} from '@services/validation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dynamic-form-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['./dynamic-form-input.component.scss']
})
export class DynamicFormInputComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];

  selectShapeChildren: FormField[] = [];
  selectShapeFormGroup: FormGroup = new FormGroup({});

  constructor(private formfieldService: FormfieldControlService, private validationService: ValidationControlService, public translate: TranslateService) {

  }

  get isValid() {
    return this.form.controls[this.input.id].valid;
  }

  ngOnInit(): void {
    if (this.input.datatype !== undefined && this.input.datatype.value === 'boolean' && this.input.value === undefined) {
      this.form.get(this.input.id).setValue(false);
    } else if (this.input.datatype !== undefined && this.input.datatype.value === 'boolean' && this.input.value === 'true') {
      this.form.get(this.input.id).setValue(true);
    }
  }

  onSelectionChanged(selectedValue): void {
    this.updateShapeFields(selectedValue);
  }

  updateShapeFields(selectedValue): void {
    this.form.removeControl(this.input.id);
    // Get shape fields from selected shape
    const shape = this.shapes.find(x => x.name === selectedValue);
    this.selectShapeChildren = shape?.fields;
    // We append the children fields of the first shape from the or array of shapes
    this.input.childrenSchema = shape.schema;
    this.input.childrenFields = this.selectShapeChildren;
    // Add the form group in the form array
    let nestedForm: any;
    nestedForm = this.formfieldService.toGroup(this.input.childrenFields, nestedForm);
    const validator = this.validationService.getValidatorFn(this.input);
    const nestedFormGroup = new FormGroup(nestedForm, validator);
    this.form.addControl(this.input.id, nestedFormGroup);
    this.selectShapeFormGroup = nestedFormGroup;
  }
}
