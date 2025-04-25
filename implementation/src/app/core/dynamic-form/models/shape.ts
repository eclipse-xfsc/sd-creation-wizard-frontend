import {DownloadFormat} from '@shared/download-format.enum';
import {FormField} from './form-field.model';

export class Shape {
  schema: string;
  fields: FormField[];
  toolTipText: string;
  prefix: string;
  name: string;
  parentSchema: string;
  selected: boolean;
  userPrefix: string;
  downloadFormat: DownloadFormat;

  constructor(
    options: {
      schema?: string;
      fields?: FormField[];
      toolTipText?: string;
      prefix?: string;
      name?: string;
      parentSchema?: string;
      selected?: boolean;
      userPrefix?: string;
      downloadFormat?: DownloadFormat;
    } = {}
  ) {
    this.schema = options.schema;
    this.fields = options.fields || [];
    this.toolTipText = options.toolTipText || '';
    this.prefix = options.prefix || '';
    this.name = this.name = options.name || '';
    this.parentSchema = options.parentSchema || null;
    this.selected = options.selected || false;
    this.userPrefix = options.userPrefix || '';
    this.downloadFormat = options.downloadFormat || DownloadFormat.turtle;
  }
}
