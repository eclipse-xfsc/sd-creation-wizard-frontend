import {Injectable} from '@angular/core';
import {FormField} from '@models/form-field.model';
import {Shape} from '@models/shape';
import {saveAs} from 'file-saver';
import {Prefix, ShaclFile} from '@models/shacl-file';
import {Utils} from '@shared/utils';
import {FormfieldControlService} from './form-field.service';
import {DownloadFormat} from '@shared/download-format.enum';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private formFieldService: FormfieldControlService) {
  }

  createRDFStream(file: ShaclFile) {
    const N3 = require('n3');
    const {DataFactory} = N3;
    const {namedNode, literal, quad} = DataFactory;

    const selectedShape = file.shapes.find(shape => shape.selected);
    //const identifier = this.generateIdentifier(selectedShape);
    const identifier = selectedShape.userPrefix;
    const subject = this.getSubject(selectedShape);

    let writer = new N3.Writer({prefixes: this.getPrefixes(file.prefixes)});
    writer.addQuad(
      namedNode(identifier),
      namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      namedNode(subject)
    );
    selectedShape.fields.forEach(field => {
      // Add quads for main shape
      if (field.childrenSchema === '') {
        field.values.forEach(val => {
          if (this.checkValue(val)) {
            const myQuad = quad(
              namedNode(identifier),
              namedNode(this.getPrefix(field, file.prefixes)),
              this.formFieldService.fieldHasNodeKindProperty(field) ?
                namedNode(val) : (literal(val === null ? '' : val, namedNode(this.getFieldDataTypePrefix(field)))),
            );
            writer.addQuad(myQuad);
          }
        });
      } else {
        // Update the writer variable with the writer of all nested shapes
        writer = this.addNestedShape(file, field, identifier, writer);
      }
    });
    let final: any;
    writer.end((error, result) => final = result);
    return final;
  }

  addNestedShape(file: ShaclFile, formField: FormField, identifier: string, writer: any) {
    const N3 = require('n3');
    const {DataFactory} = N3;
    const {namedNode, quad} = DataFactory;
    const myQuad = quad(
      namedNode(identifier),
      namedNode(this.getPrefix(formField, file.prefixes)),
      writer.blank(this.addNestedShapeFields(file, formField, identifier, writer)
      )
    );

    writer.addQuad(myQuad);
    return writer;
  }

  addNestedShapeFields(file: ShaclFile, formField: FormField, identifier: string, writer: any) {
    const N3 = require('n3');
    const {DataFactory} = N3;
    const {namedNode, literal, quad} = DataFactory;
    const quads: any = [];
    const obj: { [k: string]: any } = {};
    const childrenShape = file.shapes.find(x => x.schema === formField.childrenSchema);

    // Declare is-a relationship
    obj['predicate'] = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    obj['object'] = namedNode(this.getSubject(childrenShape));
    quads.push(obj);

    // Iterate over children fields, if the field does not have child, then for each value add the predicate and object
    // Otherwise, first add the nested shape and come over again (recursively) to add the fields
    formField.childrenFields.forEach(field => {
      if (field.childrenSchema === '') {
        field.values.forEach(value => {
          if (this.checkValue(value)) {
            const values: { [k: string]: any } = {};
            values['predicate'] = namedNode(this.getPrefix(field, file.prefixes));
            values['object'] = this.formFieldService.fieldHasNodeKindProperty(field) ?
              namedNode(value) : (literal(value === null ? '' : value, namedNode(this.getFieldDataTypePrefix(field))));
            quads.push(values);
          }
        });
      } else {
        const myQuad = quad(
          namedNode(identifier),
          namedNode(this.getPrefix(field, file.prefixes)),
          writer.blank(this.addNestedShapeFields(file, field, identifier, writer)
          )
        );
        quads.push(myQuad);
      }

    });
    return quads;
  }

  getPrefixes(prefixes: Prefix[]) {
    const obj: { [k: string]: any } = {};
    prefixes.forEach(prefix => {
      const key = prefix.alias;
      const value = prefix.url;
      obj[key] = value;
    });

    return obj;
  }

  generateIdentifier(shape: Shape) {
    let url = 'http://example.org/';
    if (shape.userPrefix && shape.userPrefix !== '') {
      url = this.getValidatedPrefix(shape.userPrefix);
    }
    const random = Utils.getRandomValue();
    const identifier = shape.name;
    return identifier;
  }

  getValidatedPrefix(prefix: string) {
    let result = '';
    if (prefix.endsWith('#') || prefix.endsWith('/')) {
      result = prefix;
    } else {
      result = prefix.concat('/');
    }
    return result;
  }

  getSubject(shape: Shape) {
    if (shape) {
      return shape.prefix.concat(':').concat(shape.name);
    }
  }

  getFieldDataTypePrefix(formField: FormField) {
    let datatypePrefix = '';
    // In case of dropdown we do not have a specified datatype
    if (formField.in.length === 0 && formField.datatype.prefix !== undefined) {
      datatypePrefix = formField.datatype.prefix.concat(':').concat(formField.datatype.value);
    }
    return datatypePrefix;
  }

  getPrefix(formField: FormField, prefixes: Prefix[]) {
    const prefixField = formField.prefix;
    const prefixURL = prefixes.find(x => x.alias === prefixField);
    if (prefixURL !== undefined) {
      return prefixURL.url.concat(formField.key);
    }

    return '';
  }

  checkValue(val): boolean {
    let valid = false;
    if (Array.isArray(val)) {
      if (val[0] !== null) {
        valid = true;
      }
    } else if ((val !== null && val !== '')) {
      valid = true;
    }

    return valid;
  }

  saveFile(file: ShaclFile) {
    const rdfStream = this.createRDFStream(file);
    const selectedShape = file.shapes.find(shape => shape.selected);
    // check for download format
    let blob: Blob;
    let fileName: string;
    if (selectedShape.downloadFormat === DownloadFormat.turtle) {
      blob = new Blob([rdfStream], {type: 'turtle'});
      fileName = selectedShape.name.concat('-instance.ttl');
    } else if (selectedShape.downloadFormat === DownloadFormat.jsonld) {
      blob = new Blob([this.convertTurtleToJsonLd(`${rdfStream}`)], {type: 'application/json'});
      fileName = selectedShape.name.concat('-instance.json');
    }

    saveAs(blob, fileName);
  }

  convertTurtleToJsonLd(ttl: string) {
    const ttl2jsonld = require('@frogcat/ttl2jsonld').parse;
    const jsonld = JSON.stringify(ttl2jsonld(ttl), null, 2);
    return jsonld;
  }
}

