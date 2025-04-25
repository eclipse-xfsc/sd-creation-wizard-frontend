import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';
import {Prefix, ShaclFile} from '@models/shacl-file';
import {Shape} from '@models/shape';
import {ApiService} from '@services/api.service';
import {ValidationControlService} from '@services/validation.service';
import {Utils} from '@shared/utils';

@Injectable({
  providedIn: 'root'
})

export class FormfieldControlService {
  constructor(private validationService: ValidationControlService, private apiService: ApiService) {

  }

  readJsonFile(data: any): Map<string, string> {
    const resultMap: Map<string, string> = new Map();
    Object.entries(data).forEach(([key, value]) => {
      resultMap.set(key, String(value));
    });
    return resultMap;
  }

  readShaclFile(data: any, values: Map<string, string> = undefined): ShaclFile {
    // Create a shacl file object
    const file: ShaclFile = new ShaclFile();
    if (data === undefined) {
      data = this.apiService.getFieldsFromFile();
    }
    file.prefixes = this.getPrefixes(data.prefixList);
    file.shapes = this.getShapes(data.shapes, file.prefixes, values);
    return file;
  }

  getShapes(shapes: any, prefixesList: Prefix[] = undefined, values: Map<string, string> = undefined): Shape[] {
    // Create an array (FormFieldsGroups) for all shapes
    const formFieldsShapes: Shape[] = [];
    Array.prototype.forEach.call(shapes, shapesGroup => {
      const formFieldShape = new Shape({
        schema: shapesGroup.schema,
        prefix: shapesGroup.targetClassPrefix,
        name: shapesGroup.targetClassName
      });
      // Get the constraints for each shape
      const constraints = shapesGroup.constraints;
      if (constraints !== undefined && constraints.length > 0) {
        // Each form field group has an array of form fields
        const formFields: FormField[] = [];
        constraints.forEach(field => {
          // Create a form field object and get the main properties
          const formField = new FormField
          ({
            key: field.path.value,
            name: field.name === undefined ? field.path.value : field.name,
            prefix: field.path.prefix,
            datatype: field.datatype,
            minCount: field.minCount,
            required: field.minCount >= 1,
            maxCount: field.maxCount,
            order: field.order,
            group: field.group,
            in: field.in,
            or: field.or !== undefined ? field.or : [],
            validations: field.validations,
            childrenSchema: field.children,
            description: field.description
          });
          // Get control type
          formField.controlTypes = this.getControlTypes(formField);

          // Get the component type
          formField.componentType = this.getComponentType(formField);

          // Get the group property
          formField.group = this.getGroupProperty(formField);

          // Add the datatype
          formField.datatype = this.getDataType(formField);

          // Add values, if URI matches one of the elements of the provided map
          if (values !== undefined && prefixesList !== undefined) {
            const prefixMap: Map<string, string> = new Map();
            prefixesList.forEach(pref => {
              prefixMap.set(pref.alias, pref.url);
            });
            const fieldURI: string = prefixMap.get(formField.prefix) + formField.key;
            if (values.has(fieldURI)) {
              formField.value = values.get(fieldURI).split("^^")[0];
            }
          }

          formFields.push(formField);
        });
        formFieldShape.fields = formFields.sort((a, b) => a.order - b.order);
        formFieldShape.toolTipText = formFields.map(x => x.name).toString();
        formFieldsShapes.push(formFieldShape);
      }
    });
    return this.getChildrenFields(formFieldsShapes);
  }

  getChildrenFields(formFieldsShapes: Shape[]): Shape[] {
    const shapes: Shape[] = formFieldsShapes;
    formFieldsShapes.forEach(shape => shape.fields.forEach(field => {
      if (field.childrenSchema !== '') {
        const childrenShape = formFieldsShapes.find(x => x.schema === field.childrenSchema || x.name === field.childrenSchema);
        if (childrenShape !== undefined) {
          if (shape === childrenShape) // self-loops scenario
          {
            field.selfLoop = true;
            field.componentType = 'dynamicSelfLoop';
          } else {
            field.childrenFields = this.updateChildrenFieldsIds(childrenShape.fields);
            childrenShape.parentSchema = shape.schema;
          }
        }
      }
    }));
    return shapes;
  }

  updateChildrenFieldsIds(fields: FormField[]): FormField[] {
    const updatedFormFields: FormField[] = [];
    fields.forEach(field => {
      const tempField = Object.assign({}, field);
      tempField.id = Utils.getRandomValue();
      updatedFormFields.push(tempField);
    });
    return updatedFormFields;
  }

  getPrefixes(prefixesList: any): Prefix[] {
    // Create an array (FormFieldsGroups) for all shapes
    const prefixes: Prefix[] = [];
    Array.prototype.forEach.call(prefixesList, prefix => {
      const prefixObject = new Prefix(
        prefix.alias, prefix.url
      );
      prefixes.push(prefixObject);
    });
    return prefixes;
  }

  getFormFields(constraints: []): FormField[] {
    const formFields: FormField[] = [];
    constraints?.forEach(field => {
      const formField = new FormField
      ({
        key: field['path'],
        name: field['name'] === undefined ? field['path'] : field['name'],
        datatype: field['datatype'],
        required: field['minCount'] >= 1,
        minCount: field['minCount'],
        maxCount: field['maxCount'],
        order: field['order'],
        group: field['group'],
        controlTypes: this.getControlTypes(field),
        in: field['in'],
        or: field['or'] !== undefined ? field['or']['values'] : [],
        validations: field['validations']
      });
      formField.componentType = this.getComponentType(formField);
      formFields.push(formField);
    });
    return formFields.sort((a, b) => a.order - b.order);
  }

  // Convert form field model array in form group
  toFormGroup(inputs: FormField[] = []): FormGroup {
    return new FormGroup(this.toGroup(inputs));
  }

  // Recursive function to convert input form field into form controls
  toGroup(inputs: FormField[] = [], group: any = {}) {
    inputs?.forEach(input => {
      const validator = this.validationService.getValidatorFn(input);
      const valueToPrefill = (input.datatype.value && input.value) ? this.getValueBasedOnDatatype(input.datatype.value, input.value) : input.value;

      if (input.componentType === 'dynamicExpanded' && !input.selfLoop) {
        let nestedForm: any;
        nestedForm = this.toGroup(input.childrenFields, nestedForm);
        const nestedFormGroup = new FormGroup(nestedForm, validator);
        group[input.id] = nestedFormGroup;
      } else {
        group[input.id] = validator.length > 0 ? new FormControl(valueToPrefill || null, validator)
          : new FormControl(valueToPrefill || null);
        if (input.componentType === 'dynamicFormArray') {
          group[input.id] = new FormArray([group[input.id]]);
        }
      }
    });
    return group;
  }

  selfLooptoGroup(input: FormField, group: any = {}) {
    const validator = this.validationService.getValidatorFn(input);
    let nestedForm: any;
    nestedForm = this.toGroup(input.childrenFields, nestedForm);
    const nestedFormGroup = new FormGroup(nestedForm, validator);
    group[input.id] = nestedFormGroup;
    return group;
  }

  getControlTypes(field: FormField): string[] {
    const controlTypes: string[] = [];
    const orProperty = field.or;
    if (field.in !== undefined && field.in.length > 0) {
      if (field.in[0].prefix === undefined) {
        controlTypes.push('dropdown');
      } else {
        controlTypes.push('dropdown_object');
      }
    } else if (field.or !== undefined && field.or.length > 0) {
      orProperty.forEach(element => {
        if (element['clazz']) { // handle it as IRI
          element['datatype'] = {prefix: 'nodeKind', value: 'IRI'};
        }
        if (element['datatype'] !== undefined  && element['datatype'].value) {
          element['controlType'] = this.getSingleControlType(element['datatype'].value);
        } else {
          element['controlType'] = 'dynamicExpanded'; // children node
        }
      });
    } else if (field.childrenSchema === '') {
      controlTypes.push(this.getSingleControlType(field.datatype?.value));
    }
    return controlTypes;
  }

  getSingleControlType(fieldType): string {
    let controlType = '';
    switch (fieldType) {
      case 'date':
        controlType = 'datepicker';
        break;
      case 'dateTime':
      case 'dateTimeStamp':
        controlType = 'datetimepicker';
        break;
      case 'integer':
        controlType = 'textbox_integer';
        break;
      case 'decimal':
      case 'float':
        controlType = 'textbox_decimal';
        break;
      case 'anyURI':
      case 'IRI':
        controlType = 'textbox_uri';
        break;
      case 'boolean':
        controlType = 'checkbox';
        break;
      default:
        controlType = 'textbox';
        break;
    }
    return controlType;
  }

  getValueBasedOnDatatype(dataType: string, value: string) {
    if (dataType !== undefined) {
      switch (dataType) {
        case 'string':
        case 'anyURI':
          return value;
        case 'boolean':
          return value === 'true';
        case 'integer':
        case 'float':
        case 'decimal':
          return Number(value);
        case 'dateTime':
        case 'date':
        case 'dateTimeStamp':
          return new Date(value);
        default:
          console.log('Unknown Datatype, no prefill possible', dataType);
          return value;
      }
    }
    return value;
  }

  getDataType(field: FormField): any {
    let datatype = field.datatype;
    // Add default datatype when datatype is undefinded
    if (field.datatype === undefined) {
      datatype = {prefix: 'xsd', value: 'string'};
    }
    // In case of a or a property, add the datatype of the first option
    if (field.or !== undefined && field.or.length > 0) {
      datatype = field.or[0]['datatype'];
    }
    return datatype;
  }


  // Decide the component type (input, array, or) based on the values of maxCount, minCount and control types
  getComponentType(field: FormField): string {
    let componentType = '';
    if (field.controlTypes.length === 1) {
      if (((field.minCount === 0 || field.minCount === 1) && field.maxCount === 1) || field.datatype?.value === 'boolean') {
        componentType = 'dynamicFormInput';
      } else {
        componentType = 'dynamicFormArray';
      }
    } else if (field.childrenSchema !== '') {
      componentType = 'dynamicExpanded';
    } else if (field.or !== undefined && field.or.length > 0) {
      if (((field.minCount === 0 || field.minCount === 1) && field.maxCount === 1)) {
        componentType = 'dynamicFormOr';
      } else {
        componentType = 'dynamicFormOrArray';
      }
    }


    return componentType;
  }

  getGroupProperty(formField: FormField): string {
    let group = '';
    const validations = formField['validations'];
    if (validations !== undefined) {
      const groupProperty = validations.find(x => x.key === 'group');
      if (groupProperty !== undefined) {
        group = groupProperty.value;
      }
    }
    return group;
  }

  fieldHasNodeKindProperty(formField: FormField): boolean {
    const result = (formField.datatype !== undefined && formField.datatype.prefix === 'nodeKind'
      && formField.datatype.value === 'IRI');

    return result;
  }

  updateFilteredShapes(shaclFile: ShaclFile): Shape[] {
    let filteredShapes = shaclFile?.shapes;
    // Not dispay shapes that are part of the or and in array
    if (filteredShapes) {
      filteredShapes.forEach(shape => {
        const toRemoveOr = this.getOrPropertyShapeNames(shape.fields, []);
        filteredShapes = filteredShapes.filter(el => {
          // the children shape can use the shape name or schema
          return toRemoveOr.indexOf(el.name) < 0 && toRemoveOr.indexOf(el.schema) < 0 ;
        });
        const toRemoveIn = this.getInPropertyShapeNames(shape.fields, []);
        filteredShapes = filteredShapes.filter(el => {
          return toRemoveIn.indexOf(el.name) < 0;
        });
      });
      // Not display nested shapes
      filteredShapes = filteredShapes.filter(x => x.parentSchema == null);
    }
    return filteredShapes;
  }

  getOrPropertyShapeNames(fields: FormField[], result: string[]): string[] {
    fields.forEach(field => {
      if (field.childrenSchema === '') {
        if (field.or !== undefined && field.or.length > 1) {
          field.or.forEach(object => {
            // only the children should be a shape
            if (object['children'] !== undefined) {
              result.push(object['children']);
            }
          });
        }
      } else {
        this.getOrPropertyShapeNames(field.childrenFields, result);
      }
    });
    return result;
  }

  getInPropertyShapeNames(fields: FormField[], result: string[]): string[] {
    fields.forEach(field => {
      if (field.childrenSchema === '') {
        if (field.in !== undefined && field.in.length > 1) {
          field.in.forEach(object => {
            if (object !== undefined) {
              result.push(object.value);
            }
          });
        }
      } else {
        this.getInPropertyShapeNames(field.childrenFields, result);
      }
    });
    return result;
  }
}
