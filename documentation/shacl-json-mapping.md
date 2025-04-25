# SHACL-JSON Mappings Overview

## Input Fields Properties

| SHACL Keyword          | SHACL Meaning                                                         | JSON             |
|------------------------|-----------------------------------------------------------------------|------------------|
| **sh:path**            | The type of value nodes                                               | path             |
| **sh:name**            | Human-readable labels                                                 | name             |
| **sh:datatype**        | Datatype of value nodes                                               | datatype         |
| **xsd:anyURI**         | Represents a Uniform Resource Identifier (URI) reference.             | datatype = 'URI' |
| **sh:nodeKind sh:IRI** | The kind of node of property values should be IRI                     | datatype = 'URL' |
| **sh:in**              | A SHACL list that has the allowed values as members                   | in               |
| **sh:or**              | A SHACL list of shapes to validate the value nodes against            | or               |
| **sh:order**           | Indicates the relative order of the property shape                    | order            |
| **sh:group**           | Indicate that the shape belongs to a group of related property shapes | group            |
| **sh:minCount**        | The minimum cardinality                                               | minCount         |
| **sh:maxCount**        | The maximum cardinality                                               | maxCount         |

## Input Fields Validations

Validations for each field are stored in an **array of objects**, with **key** and **value** properties.

For instance:

```markdown
"validations":
[
{
"key": "minLength",
"value": 3
},
{
"key": "maxLength",
"value": 10
}
]

```

| SHACL Keyword        | SHACL Meaning                           | JSON                                           |
|----------------------|-----------------------------------------|------------------------------------------------|
| **sh: minInclusive** | The minimum inclusive value             | "key":"minInclusive", "value": x               |
| **sh: maxInclusive** | The maximum inclusive value             | "key":"maxInclusive", "value": x               |
| **sh: minExclusive** | The minimum exclusive value             | "key":"minExclusive", "value": x               |
| **sh: maxExclusive** | The maximum exclusive value             | "key":"maxExclusive", "value": x               |
| **sh: minLength**    | The minimum length of a string          | "key":"minLength", "value": x                  |
| **sh: maxLength**    | The maximum length of a string          | "key":"maxLength", "value": x                  |
| **sh: lessThan**     | The property to compare the values with | "key":"lessThan", "value": "name of the field" |

## Example (SHACL and JSON)

```markdown
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:DatasetShape
a sh:NodeShape ;
sh:targetClass dcat:Dataset ;
sh:property [
sh:path dct:title ;
sh:datatype xsd:string ;
sh:name "Dataset title" ;
sh:minCount 1 ;
sh:maxCount 1;
] ;
sh:property [
sh:path dct:description ;
sh:datatype xsd:string ;
sh:name "Dataset description" ;
sh:maxCount 1;
] ;
sh:property [
sh:path dcat:startDate ;
sh:datatype xsd:dateTime ;
sh:name "Start date of the data" ;
] ;
sh:property [
sh:path dcat:endDate ;
sh:datatype xsd:dateTime ;
sh:name "End date of the data" ;
] ;
sh:property [
sh:path dcat:keyword ;
sh:datatype xsd:string ;
sh:name "Keyword / tag" ;
] .
sh:property [
sh:path dcat:logo ;
sh:nodeKind sh:IRI ;
sh:name "logo" ;

    ] ;
```

```markdown
[
{
"path":"title",
"datatype":"string",
"name":"Dataset title",
"maxCount":1,
"minCount":1
},
{
"path":"description",
"datatype":"string",
"name":"Dataset description",
"maxCount":1
},
{
"path":"startDate",
"datatype":"dateTime",
"name":"Start date of the data"
},
{
"path":"endDate",
"datatype":"dateTime",
"name":"End date of the data"
},
{
"path":"keyword",
"datatype":"string",
"name":"Keyword / tag"
},
{
"path":"logo",
"datatype":"URL",
"name":"logo"
}
]
```