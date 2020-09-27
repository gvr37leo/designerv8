/// <reference path="./src/designer.ts" />


//definition and data in same database
//name and id interchangeable
//knot logic handled on server
//filter handled as list on listviews
//modelsbuilder
//just do all the data in 1 table(indexes? clashing indexes on certain properties with same name) and the metadata in seperate tables//maybe to make it easier it's a good idea, but not for performance
//and embed knotdata in objects
//listviews of certain types

//load definition from metadata collection, and give it here as parameter
//maybe have 2 designers 1 to edit metadata and 1 to edit data
//reload the data designer when you edit in metadatadesigner
//maybe master listviews for each objdef








let selfdef = new ObjDef('appdef',null,false,null,true)

let datatypedefinition = new ObjDef('datatype',selfdef._id,false,null,false)

let datatypeholder = new Knot('datatypes',selfdef._id,'99')
let stringDef = new Datatype('string',datatypeholder._id)
let dateDef = new Datatype('date',datatypeholder._id)
let rangeDef = new Datatype('range',datatypeholder._id)
let numberDef = new Datatype('number',datatypeholder._id)
let pointerDef = new Datatype('pointer',datatypeholder._id)
let idDef = new Datatype('id',datatypeholder._id)
let booleanDef = new Datatype('boolean',datatypeholder._id)

let objectdefinition = new ObjDef('objdef',selfdef._id,false,null,false)
let allowAsRootNode = new Attribute('allowAsRootNode',objectdefinition._id,booleanDef._id,null)
let islist = new Attribute('isList',objectdefinition._id,booleanDef._id,null)
let listtype = new Attribute('listTypeObjdef',objectdefinition._id,pointerDef._id,objectdefinition._id)

let attributedefinition = new ObjDef('attribute',selfdef._id,false,null,false)
let datatypeAttributeDef = new Attribute('datatype',attributedefinition._id,pointerDef._id,datatypedefinition._id)
let pointsToObjectDef = new Attribute('pointsToObject',attributedefinition._id,pointerDef._id,datatypedefinition._id)



let knotDef = new ObjDef('knot',selfdef._id,false,null,false)


generateKnotAttributes(selfdef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(objectdefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(attributedefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(datatypedefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(knotDef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)

let metaknots:Knot[] = [selfdef,datatypeholder,stringDef,dateDef,rangeDef,numberDef,pointerDef,idDef,booleanDef,objectdefinition,allowAsRootNode,attributedefinition,datatypeAttributeDef,pointsToObjectDef,]

// let metadesigner = new Designer(metaknots,'metadata')
//need something to identify objs,attributes,appdefs and datatypes for rendering (maybe in appdef set ids of each type, or hardcoded)





//this definition should be read from database
//reference definitions from metadata designer

let rootdef = new ObjDef('root',null,false,null,true)


let cardef = new ObjDef('car',rootdef._id,false,null,false)
let platedef = new Attribute('plate',cardef._id,stringDef._id,null)

let persondef = new ObjDef('person',rootdef._id,true,cardef._id,false)
let phonenumberdef = new Attribute('phonenumber',persondef._id,stringDef._id,null)
let frienddef = new Attribute('friend',persondef._id,pointerDef._id,persondef._id)
let dataknots:Knot[] = [rootdef,persondef,phonenumberdef,frienddef,cardef,platedef]

dataknots.push(...generateKnotAttributes(rootdef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)) 
dataknots.push(...generateKnotAttributes(persondef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)) 
dataknots.push(...generateKnotAttributes(cardef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id))
let datadesigner = new Designer(dataknots,'data')
this.document.body.appendChild(datadesigner.rootElement)




