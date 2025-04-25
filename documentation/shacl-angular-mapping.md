# SHACL-Angular Mappings Overview

## Input Fields Properties

| SHACL Keyword   | SHACL Meaning                                                         | Angular UI                               |
|-----------------|-----------------------------------------------------------------------|------------------------------------------|
| **sh:path**     | Points at the URI of the property that is being restricted            | input [formControlName]                  |
| **sh:name**     | Human-readable labels                                                 | input [placeholder]                      |
| **sh:datatype** | Datatype of value nodes                                               | input [type]                             |
| **sh:in**       | A SHACL list that has the allowed values as members                   | `<mat-select>`                           |
| **sh:or**       | A SHACL list of shapes to validate the value nodes against            | `<mat-radio-button>`                     |
| **sh:order**    | Indicate the relative order of the property shapes                    | position in which the input is displayed |
| **sh: group**   | Indicate that the shape belongs to a group of related property shapes | inputs grouped in <mat-card>             |

## Datatypes

| Datatype     | Angular UI                                               |
|--------------|----------------------------------------------------------|
| **string**   | `<input matInput>`                                       |
| **integer**  | `<input matInput type="number" appNumeric>`              |
| **integer**  | `<input matInput type="number" appNumeric>`              |
| **decimal**  | `<input matInput type="number" appNumeric decimals="2">` |
| **date**     | `<mat-datepicker>`                                       |
| **dateTime** | `<mat-datepicker>`                                       |
| **boolean**  | `<mat-checkbox>`                                         |

## Input Fields Validations

| SHACL Keyword        | SHACL Meaning                                           | Angular UI                                                    |
|----------------------|---------------------------------------------------------|---------------------------------------------------------------|
| **sh:minCount**      | The minimum cardinality                                 | Input is required                                             |
| **sh:maxCount**      | The maximum cardinality                                 | Possibility to add (1) or more values to a input              |
| **sh:pattern**       | A regular expression that all value nodes need to match | x is one of the regular expressions that the value must match |
| **sh: minInclusive** | The minimum inclusive value                             | Value must be greater than or equal to x                      |
| **sh: maxInclusive** | The maximum inclusive value                             | Value must be less than or equal to x                         |
| **sh: minExclusive** | The minimum exclusive value                             | Value must be greater than x                                  |
| **sh: maxExclusive** | The maximum exclusive value                             | Value must be less than x                                     |
| **sh: minLength**    | The minimum length of a string                          | The length of the value must be greater than or equal to x    |
| **sh: maxLength**    | The maximum length of a string                          | The length of the value must be less than or equal to x       |
| **sh: lessThan**     | The property to compare the values with                 | Cross-field validations                                       |