import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';
import {Utils} from '@shared/utils';

@Component({
  selector: 'app-dynamic-self-loops',
  templateUrl: './dynamic-self-loops.component.html',
  styleUrls: ['./dynamic-self-loops.component.scss']
})
export class DynamicSelfLoopsComponent implements OnInit {

  @Input() input: FormField = new FormField();
  @Input() form: FormGroup = new FormGroup({});
  @Input() shapes: Shape[] = [];
  @Input() parentId: string = null;
  formGroup: FormGroup = new FormGroup({});
  displayFields = false;
  displayButton = true;

  constructor(private formfieldService: FormfieldControlService) {
  }

  ngOnInit(): void {
  }

  addNestedShape(): void {
    this.input.componentType = 'dynamicExpanded';
    this.form.removeControl(this.input.id);
    this.input.id = Utils.getRandomValue();
    this.displayFields = true;
    // Iterate over input children fields
    const childrenFields = this.shapes.find(shape => shape.schema === this.input.childrenSchema ||
      shape.name === this.input.childrenSchema)?.fields;
    const cloneFields = Utils.getDistinctObjects(childrenFields).map(x => Object.assign({}, x));
    cloneFields.forEach(field => {
      field.id = Utils.getRandomValue();
      if (field.selfLoop) {
        field.childrenFields = [];
      }
    });
    this.input.childrenFields = cloneFields;
    this.formGroup = this.formfieldService.selfLooptoGroup(this.input)[this.input.id];
    this.form.addControl(this.input.id, this.formGroup);
    this.displayButton = false;
  }
}
