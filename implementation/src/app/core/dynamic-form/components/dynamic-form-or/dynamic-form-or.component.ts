import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';
import {ValidationControlService} from '@services/validation.service';
import {Utils} from '@shared/utils';
import {TranslateService} from '@ngx-translate/core';
import {RadioOption} from '@models/radio-option.model';


@Component({
  selector: 'app-dynamic-form-or',
  templateUrl: './dynamic-form-or.component.html',
  styleUrls: ['./dynamic-form-or.component.scss']
})
export class DynamicFormOrComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  nestedFormGroup: FormGroup = new FormGroup({});
  radioButtonSelected: RadioOption;
  radioGroup: RadioOption[] = [];
  groupName = '';

  constructor(private formfieldService: FormfieldControlService,
              private validationService: ValidationControlService,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.groupName = this.getRandomValue();
    this.radioGroup = RadioOption.getRadioOptions(this.input, this.shapes);
    // as default select the first option
    this.onItemChange(this.radioGroup[0]);
  }

  onItemChange(item: RadioOption): void {
    this.radioButtonSelected = item;
    // update the main input data
    this.input.childrenSchema = item.childrenSchema;
    this.input.childrenFields = item.childrenFields;
    this.input.datatype = item.datatype;
    this.addFormControl(item);
  }

  private addFormControl(item: RadioOption) {
    this.form.removeControl(this.input.id);
    // create a nested group if the selected option has children fields
    if (item.childrenFields && item.childrenFields.length > 0) {
      let nestedForm: any;
      nestedForm = this.formfieldService.toGroup(item.childrenFields, nestedForm);
      const validator = this.validationService.getValidatorFn(this.input);
      const nestedFormGroup = new FormGroup(nestedForm, validator);
      this.form.addControl(this.input.id, nestedFormGroup);
      this.nestedFormGroup = nestedFormGroup;
    } else {
      this.form.addControl(this.input.id, new FormControl('', this.validationService.getValidatorFn(this.input)));
    }
  }

  getRandomValue(): string {
    return Utils.getRandomValue();
  }

}
