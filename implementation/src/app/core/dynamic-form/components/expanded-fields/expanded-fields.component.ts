import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Utils} from '@shared/utils';
import {FormField} from '@models/form-field.model';
import {FormfieldControlService} from '@services/form-field.service';
import {Shape} from '@models/shape';

@Component({
  selector: 'app-expanded-fields',
  templateUrl: './expanded-fields.component.html',
  styleUrls: ['./expanded-fields.component.scss']
})

export class ExpandedFieldsComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  @Input() parentId: string = null;
  inputs: FormField[] = [];
  allformFields: FormField[];
  panelOpenState = false;
  groupsNumber = 1;
  groupedFormFields: FormField[][];
  formGroups: any = [];
  nestedFormGroup: FormGroup = new FormGroup({});
  enableButton = true;
  displayAddButton = true;

  constructor(private formFieldService: FormfieldControlService) {
  }

  ngOnInit(): void {
    this.allformFields = this.shapes.find(shape => shape.selected)?.fields;
    this.displayAddButton = this.input.maxCount === undefined || this.input.maxCount > this.input.minCount;
    this.groupFormFields();

    // when the main shape is required then we add it to the main form, otherwise we remove it and display the add button.
    if (this.input.required) {
      this.inputs.push(this.input);
      if (this.form.controls[this.input.id] !== undefined) {
        this.formGroups.push(this.form.controls[this.input.id]);
      } else {
        // create form group
        const newFormGroup = this.formFieldService.toGroup([this.input]);
        // add to the forms groups array
        this.formGroups.push(newFormGroup[this.input.id]);
        // add to the main form
        this.form.addControl(this.input.id, newFormGroup[this.input.id]);
      }
      for (let i = 0; i < this.input.minCount - 1; i++) {
        this.addInput();
      }
    } else {
      // remove the main input from the form
      this.form.removeControl(this.input.id);
    }
  }

  addInitialShape(): void {
    // add to the list of inputs
    this.inputs.push(this.input);
    // add to the list of all form fields if it has no parent
    if (!this.parentId && this.allformFields.find(x => x.id === this.input.id) === undefined) {
      this.allformFields.push(this.input);
    }
    // add to the forms groups array
    let nestedForm: any;
    nestedForm = this.formFieldService.toGroup(this.input.childrenFields, nestedForm);
    const formGroup = new FormGroup(nestedForm);
    this.formGroups.push(formGroup);
    // add to the main form
    this.form.addControl(this.input.id, formGroup);
  }

  groupFormFields(): void {
    this.groupedFormFields = Utils.groupBy(this.input.childrenFields, (formField) => formField.group);
    this.groupsNumber = this.groupedFormFields.length;
  }

  addInput(): void {
    const newInput = this.copyFormField(this.input);
    this.inputs.push(newInput);
    // Depends whether it is from the first level (parentId == null) and self-loop or a higher level
    if (this.parentId !== null) {
      const field = this.findParentField(this.parentId, this.allformFields);
      field.childrenFields.push(newInput);
    } else {
      this.allformFields.push(newInput);
      let newFormGroup: any;
      if (newInput.selfLoop) {
        newFormGroup = this.formFieldService.selfLooptoGroup(newInput);
      } else {
        newFormGroup = this.formFieldService.toGroup([newInput]);
      }
      // add to the forms groups array
      this.formGroups.push(newFormGroup[newInput.id]);
      // add to the main form
      this.form.addControl(newInput.id, newFormGroup[newInput.id]);
    }
    this.updateEnableButton();
  }

  deleteInput(index: number): void {
    // find input to be removed
    const inputToBeRemoved = this.inputs[index];
    // remove from the list of inputs iterated on this component
    this.inputs.splice(index, 1);

    // remove from the list of all form fields
    const indexInFormFields = this.allformFields.indexOf(inputToBeRemoved, 0);
    if (index > -1) {
      this.allformFields.splice(indexInFormFields, 1);
    }

    // remove from the forms groups array
    this.formGroups.splice(index, 1);

    // remove from the main form
    this.form.removeControl(inputToBeRemoved.id);
    this.updateEnableButton();
  }

  updateEnableButton(): void {
    const maxCount = this.input.maxCount;
    if (maxCount !== undefined) {
      this.enableButton = this.formGroups.length < maxCount;
    }
  }

  findParentField(id: string, formFields: FormField[]): FormField {
    let field = formFields.find(x => x.id === this.parentId);
    if (field) {
      return field;
    } else {
      const formFieldsFiltered = formFields.filter(x => Array.isArray(x.childrenFields) && x.childrenFields.length > 0);
      for (let i = 0; i <= formFieldsFiltered.length; i++) {
        field = this.findParentField(id, formFieldsFiltered[i].childrenFields);
        if (field) {
          return field;
        }
      }
    }
  }

  copyFormField(formField: FormField, isMainShape: boolean = true): FormField {
    const newFormField = Object.assign({}, formField);
    newFormField.id = Utils.getRandomValue();
    if (isMainShape) {
      newFormField.minCount = this.input.minCount - this.inputs.length;
      newFormField.maxCount = this.input.maxCount - this.inputs.length;
      newFormField.required = newFormField.minCount === 1 ? true : false;
    }
    if (newFormField.childrenSchema !== '') {
      const newChildrenFields: FormField[] = [];

      Utils.getDistinctObjects(newFormField.childrenFields).forEach(children => {
        newChildrenFields.push(this.copyFormField(children, false));
      });

      newFormField.childrenFields = newChildrenFields;
    }
    return newFormField;
  }

  displayDeleteButton(i: number): boolean {
    if (!this.input.required) {
      return true;
    } else {
      if (i !== 0 && i >= this.input.minCount) {
        return true;
      }
      return false;
    }
  }
}
