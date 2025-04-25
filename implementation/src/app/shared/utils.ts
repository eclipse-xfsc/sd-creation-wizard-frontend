import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormField} from '@models/form-field.model';

export class Utils {
  static groupBy<T, K>(list: T[], getKey: (item: T) => K) {
    const map = new Map<K, T[]>();
    list?.forEach((item) => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return Array.from(map.values());
  }


  // Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
  static cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });

      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)));

      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) {
      newControl.disable({emitEvent: false});
    }

    return newControl;
  }

  static getRandomValue(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static getDistinctObjects(fields: FormField[]): FormField[] {
    const distinctObjects = fields.filter(
      (thing, i, arr) => arr.findIndex(t => t.key === thing.key) === i
    );
    return distinctObjects;
  }

  static controlUrl(api: string): string {
    let result = '';
    if (api.includes('http') || api.includes('https')) {
      result = api;
    } else {
      result = `http://${api}`;
    }
    return result;
  }

  static filterInPlace = (array, predicate) => {
    let end = 0;
    array.forEach(obj => {
      if (predicate(obj)) {
        array[end++] = obj;
      }
    });
    array.length = end;
  }

  static removeAfterCharacter(input: string, character = '.') {
    input = input.substring(0, input.indexOf(character));
    return input;
  }

  static hasRequiredField = (abstractControl: AbstractControl): boolean => {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
        if (abstractControl['controls'][controlName]) {
          if (Utils.hasRequiredField(abstractControl['controls'][controlName])) {
            return true;
          }
        }
      }
    }
    return false;
  }

}
