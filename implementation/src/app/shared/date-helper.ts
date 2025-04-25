import {DatePipe} from '@angular/common';
import {FormField} from '@models/form-field.model';

export class DateHelper {
  static transformDate(field: FormField, v: any): string {
    let date: string;
    const datePipe: DatePipe = new DatePipe('en-GB');

    switch (field.datatype.value) {
      case 'date':
        date = datePipe.transform(v, 'yyyy-MM-dd');
        break;
      case 'dateTime' :
      case 'dateTimeStamp' :
        date = datePipe.transform(v, 'yyyy-MM-ddTHH:mm:ss');
        break;

    }
    return date;
  }
}
