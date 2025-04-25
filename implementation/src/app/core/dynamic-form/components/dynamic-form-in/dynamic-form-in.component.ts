import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';
import {ValidationControlService} from '@services/validation.service';

@Component({
  selector: 'app-dynamic-form-in',
  templateUrl: './dynamic-form-in.component.html',
  styleUrls: ['./dynamic-form-in.component.scss']
})
export class DynamicFormInComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  @Input() control: any;

  shapeFields: FormField[] = [];
  nestedFormGroup: FormGroup = new FormGroup({});
  isArray = false;

  constructor(private formfieldService: FormfieldControlService, private validationService: ValidationControlService) {
  }

  ngOnInit(): void {
    this.isArray = this.control !== undefined;
  }

  onSelectionChanged(selectedValue): void {
    this.updateShapeFields(selectedValue);
  }

  updateShapeFields(selectedValue: string): void {
    this.form.removeControl(this.input.id);
    // Get shape fields from selected shape
    const shape = this.shapes.find(x => x.name === selectedValue);
    this.shapeFields = shape?.fields;
    // We append the children fields of the first shape from the or array of shapes
    this.input.childrenSchema = shape.schema;
    this.input.childrenFields = this.shapeFields;
    // Add the form group in the form array
    let nestedForm: any;
    nestedForm = this.formfieldService.toGroup(this.input.childrenFields, nestedForm);
    const validator = this.validationService.getValidatorFn(this.input);
    const nestedFormGroup = new FormGroup(nestedForm, validator);
    this.form.addControl(this.input.id, nestedFormGroup);
    this.nestedFormGroup = nestedFormGroup;
  }

}
