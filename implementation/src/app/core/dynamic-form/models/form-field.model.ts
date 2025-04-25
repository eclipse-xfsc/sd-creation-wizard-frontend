import {Utils} from '@shared/utils';
import {Validation} from '@models/validation.model';

export class FormField {
  id: string;
  value: string;
  key: string;
  name: string;
  datatype: { prefix: string; value: string };
  required: boolean;
  minCount: number;
  maxCount: number;
  order: number;
  group: string;
  controlTypes: string[];
  in: { prefix: string; value: string }[];
  or: { key: string; value: { prefix: string; value: string } }[];
  validations: Validation[];
  componentType: string;
  childrenFields: FormField[];
  childrenSchema: string;
  prefix: string;
  values: string[];
  description: string;
  example?: string;
  selfLoop: boolean;

  constructor(
    options: {
      id?: string;
      value?: string;
      key?: string;
      name?: string;
      datatype?: { prefix: string; value: string };
      required?: boolean;
      minCount?: number;
      maxCount?: number;
      order?: number;
      group?: string;
      controlTypes?: string[];
      in?: { prefix: string; value: string }[];
      or?: { key: string; value: { prefix: string; value: string } }[];
      validations?: Validation[];
      componentType?: string;
      childrenFields?: FormField[];
      childrenSchema?: string;
      prefix?: string;
      values?: string[];
      description?: string;
      selfLoop?: boolean;
      example?: string;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.name = options.name || '';
    this.datatype = options.datatype || undefined;
    this.required = !!options.required;
    this.minCount = options.minCount === undefined ? 0 : options.minCount;
    this.maxCount = options.maxCount === undefined ? undefined : options.maxCount;
    this.order = options.order === undefined ? 1 : options.order;
    this.group = options.group === undefined ? undefined : options.group;
    this.controlTypes = options.controlTypes || [];
    this.in = options.in || [];
    this.or = options.or || [];
    this.validations = options.validations || [];
    this.componentType = options.componentType || '';
    this.childrenFields = options.childrenFields || [];
    this.childrenSchema = options.childrenSchema || '';
    this.prefix = options.prefix || '';
    this.values = options.values || [];
    this.description = options.description || '';
    this.example = options.example || '';
    this.id = Utils.getRandomValue();
    this.selfLoop = options.selfLoop || false;
    //
  }
}
