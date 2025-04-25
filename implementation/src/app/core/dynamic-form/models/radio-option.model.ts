import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';

export class RadioOption {
  controlType: string;
  name: string;
  datatype: { prefix: string; value: string };
  childrenFields: FormField[];
  childrenSchema: string;

  constructor(
    options: {
      controlType: string,
      name: string,
      datatype?: { prefix: string; value: string },
      childrenFields?: FormField[],
      childrenSchema?: string
    }) {
    this.controlType = options.controlType;
    this.datatype = options.datatype || undefined;
    this.childrenFields = options.childrenFields || [];
    this.childrenSchema = options.childrenSchema || '';
    this.name = options.name;
  }

  /**
   * Create RadioOptions from FormField 'or' values and return the newly created list
   * @param input - FormField with or value
   * @param shapes - List of Shapes witch should contain the children shapes
   */
  static getRadioOptions(input: FormField, shapes: Shape[]): RadioOption[] {
    const radioOptions: RadioOption[] = [];
    input.or.forEach(orValue => {
      if ((orValue['datatype'] && orValue['datatype']['value'])) {
        const controlType: string = orValue['controlType'];
        if (!radioOptions.find((value) => value.controlType === controlType)) {
          radioOptions.push(new RadioOption({controlType, name: orValue['datatype']['value'], datatype: orValue['datatype']}));
        }
      } else if (orValue['children']) {
        // get the shape from 'shapes' to use its name and form fields
        const name = orValue['children'];
        const childrenShape = shapes.find(x => x.schema === name || x.name === name);
        const childrenFields = childrenShape ? childrenShape.fields : [] ;
        const childrenSchema = childrenShape ? childrenShape.schema : orValue['children'];
        radioOptions.push(
          new RadioOption({
            controlType: orValue['controlType'],
            childrenSchema, childrenFields,
            name
          }));
      }
    });
    return radioOptions;
  }
}
