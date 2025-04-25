import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Utils} from '@shared/utils';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';
import {ValidationControlService} from '@services/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {RadioOption} from '@models/radio-option.model';

@Component({
  selector: 'app-dynamic-form-or-array',
  templateUrl: './dynamic-form-or-array.component.html',
  styleUrls: ['./dynamic-form-or-array.component.scss']
})
export class DynamicFormOrArrayComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  inputs: FormField[] = [];
  radioButtonsSelected: RadioOption[] = [];
  enableButton = true;
  displayAddButton = true;
  formGroups: any = [];
  allformFields: FormField[];
  radioGroup: RadioOption[] = [];
  radioGroupIds: string[] = [];

  constructor(private formfieldService: FormfieldControlService,
              private validationService: ValidationControlService,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.allformFields = this.shapes.find(shape => shape.selected)?.fields;
    this.displayAddButton = this.input.maxCount === undefined || this.input.maxCount > this.input.minCount;
    // get RadioOptions to display it in template and store the needed extra fields
    this.radioGroup = RadioOption.getRadioOptions(this.input, this.shapes);
    // when the main shape is required then we add it to the main form, otherwise we remove it and display the add button.
    if (this.input.required) {
      // add the first Form Control
      this.addFirstField();
      // add the min required controls
      if (this.input.or[0] !== undefined) {
        for (let i = 0; i < this.input.minCount - 1; i++) {
          this.addInput();
        }
      }
    } else {
      this.form.removeControl(this.input.id);
    }
  }


  /**
   * update the form field and control according to the selection
   */
  onItemChange(item: RadioOption, i: number): void {
    this.radioButtonsSelected[i] = item;
    const formField = this.inputs[i];
    const formInput = this.updateFormField(i, formField);
    this.addFormControl(formInput);

    const formFieldIndex = this.allformFields.findIndex(field => field.id === formInput.id);
    this.allformFields[formFieldIndex] = formInput;
  }

  copyFormField(formField: FormField): FormField {
    const newFormField = Object.assign({}, formField);
    newFormField.id = Utils.getRandomValue();
    return newFormField;
  }

  /**
   * add form field and control according to the last selected element
   */
  addInput(): void {
    const lastIndex = this.inputs.length - 1;
    let newInput = this.copyFormField(this.inputs[lastIndex]);
    const radioButtonSelected = this.radioButtonsSelected[lastIndex];
    newInput = this.updateFormField(lastIndex, newInput);
    this.radioGroupIds.push(newInput.id);
    this.radioButtonsSelected.push(radioButtonSelected);
    // add to the list of all form fields
    this.allformFields.push(newInput);
    this.inputs.push(newInput);
    // add to the main form
    this.addFormControl(newInput);
    this.updateEnableButton();
  }


  deleteInput(index: number): void {
    // find input to be removed
    const inputToBeRemoved = this.inputs[index];
    // remove from the list of inputs iterated on this component
    this.inputs.splice(index, 1);
    // remove radio group id
    this.radioGroupIds.splice(index, 1);
    // remove the the list of all form fields
    const indexInFormFields = this.allformFields.indexOf(inputToBeRemoved, 0);
    if (index > -1) {
      this.allformFields.splice(indexInFormFields, 1);
    }
    // update shape with the new list
    this.shapes.find(shape => shape.selected).fields = this.allformFields;
    // remove from the main form
    this.form.removeControl(inputToBeRemoved.id);
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

  /**
   * setup the first form input and add the form control, by default select the first radio option
   */
  addFirstField() {
    this.radioButtonsSelected.push(this.radioGroup[0]);
    const formInput = this.updateFormField(0, {...this.input});
    this.radioGroupIds.push(formInput.id);
    this.inputs.push(formInput);
    this.addFormControl(formInput);
    const formFieldIndex: number = this.allformFields.findIndex(field => field.id === formInput.id);
    if (formFieldIndex >= 0) {
      this.allformFields[formFieldIndex] = formInput;
    } else { this.allformFields.push(formInput); }
    this.updateEnableButton();
  }

  /**
   * reset the form field data acording to the selected radio option
   */
  updateFormField(radioIndex: number, field: FormField): FormField {
    field.childrenSchema = this.radioButtonsSelected[radioIndex].childrenSchema;
    field.datatype = this.radioButtonsSelected[radioIndex].datatype;
    field.childrenFields = [];

    const childrenFields = this.radioButtonsSelected[radioIndex].childrenFields;
    if (childrenFields) {
      // copy fields with a new id before creating the form
      childrenFields.forEach(childrenField => field.childrenFields.push(this.copyFormField(childrenField)));
      // hide AddButton by Expanded Fields, this component is already an array
      field.minCount = 1;
      field.maxCount = 1;
      field.required = true;
    }
    return field;
  }

  /**
   * delete the old form control and create a new one according to the modified form field
   */
  private addFormControl(newInput: FormField): void {
    this.form.removeControl(newInput.id);
    if (newInput.childrenFields && newInput.childrenFields.length > 1) {
      let nestedForm: any;
      nestedForm = this.formfieldService.toGroup(newInput.childrenFields, nestedForm);
      const validator = this.validationService.getValidatorFn(newInput);
      const nestedFormGroup = new FormGroup(nestedForm, validator);
      this.form.addControl(newInput.id, nestedFormGroup);
      this.formGroups.push(this.form.controls[newInput.id]);
    } else {
      this.form.addControl(newInput.id, new FormControl('', this.validationService.getValidatorFn(newInput)));
    }
  }

}
