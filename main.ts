/// <reference path="./src/designer.ts" />
/// <reference path="./src/gamedef.ts" />


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


let selfdef = new ObjDef('appdef',null,false,null,true,'this should be replaced')

let objdefsholder = new FolderDef('objdefs',selfdef._id,null,null)
objdefsholder.foldertype = objdefsholder._id

let objdefDef = new ObjDef('objdef',objdefsholder._id,false,null,false,'this should be replaced')
selfdef.objdef = objdefDef._id
objdefDef.objdef = objdefDef._id


let folderDef = new ObjDef('folder',objdefsholder._id,false,null,false,objdefDef._id)
objdefsholder.objdef = folderDef._id


let datatypeDef = new ObjDef('datatype',objdefsholder._id,false,null,false,objdefDef._id)

let attrDef = new ObjDef('attribute',objdefsholder._id,false,null,false,objdefDef._id)

let datatypeholder = new Knot('datatypes',selfdef._id,folderDef._id)
let stringDef = new Knot('string',datatypeholder._id,datatypeDef._id)
let dateDef = new Knot('date',datatypeholder._id,datatypeDef._id)
let rangeDef = new Knot('range',datatypeholder._id,datatypeDef._id)
let numberDef = new Knot('number',datatypeholder._id,datatypeDef._id)
let pointerDef = new Knot('pointer',datatypeholder._id,datatypeDef._id)
let idDef = new Knot('id',datatypeholder._id,datatypeDef._id)
let booleanDef = new Knot('boolean',datatypeholder._id,datatypeDef._id)

//objdef attributes
let allowAsRootNode = new Attribute('allowAsRootNode',objdefDef._id,booleanDef._id,null,attrDef._id)
let islist = new Attribute('isList',objdefDef._id,booleanDef._id,null,attrDef._id)
let listtype = new Attribute('listTypeObjdef',objdefDef._id,pointerDef._id,objdefsholder._id,attrDef._id)

//attribute attributes
let datatypeAttributeDef = new Attribute('dataType',attrDef._id,pointerDef._id,datatypeholder._id,attrDef._id)
let selectKnot = new Attribute('selectKnot',attrDef._id,pointerDef._id,objdefsholder._id,attrDef._id)

//folder
let foldertype = new Attribute('foldertype',folderDef._id,pointerDef._id,objdefsholder._id,attrDef._id)


//get metadefinition tree
//get all objdef/attributes according to their id <- identify id by seeing which has the objdefname/attributename/datatypename
//call generateknotattributes pass in datatypesid foudn by their name


//maybe have these attributes generated and appended by the detailviews at runtime,prevents having to store it in the database,less clutter
// generateKnotAttributes(selfdef,metaknots)
// generateKnotAttributes(objectdefinition,objectdefinition._id,metaknots)
// generateKnotAttributes(attributedefinition,objectdefinition._id,metaknots)
// generateKnotAttributes(datatypedefinition,objectdefinition._id,metaknots)
// generateKnotAttributes(knotDef,objectdefinition._id,metaknots)

let metaknots:Knot[] = [selfdef,folderDef,objdefsholder,datatypeDef,datatypeholder,stringDef,dateDef,rangeDef,numberDef,pointerDef,idDef,booleanDef,objdefDef,allowAsRootNode,attrDef,datatypeAttributeDef,selectKnot,]

let metadesigner = new Designer(metaknots.slice(),metaknots.slice(),'metadata')
this.document.body.appendChild(metadesigner.rootElement)
//need something to identify objs,attributes,appdefs and datatypes for rendering (maybe in appdef set ids of each type, or hardcoded)






//this definition should be read from database
//reference definitions from metadata designer

let rootdef = new ObjDef('root',null,false,null,true,selfdef._id)

let cardef = new ObjDef('car',rootdef._id,false,null,false,objdefDef._id)
let platedef = new Attribute('plate',cardef._id,stringDef._id,null,attrDef._id)

let persondef = new ObjDef('person',rootdef._id,true,cardef._id,false,objdefDef._id)
let phonenumberdef = new Attribute('phonenumber',persondef._id,stringDef._id,null,attrDef._id)
let frienddef = new Attribute('friend',persondef._id,pointerDef._id,persondef._id,attrDef._id)

let folderDefcomp = new ObjDef('folder',rootdef._id,true,null,false,objdefDef._id)

let dataknots:Knot[] = [rootdef,persondef,phonenumberdef,frienddef,cardef,platedef,folderDefcomp]

JSON.stringify(genGameDef())

// dataknots.push(...generateKnotAttributes(rootdef,metaknots))
// dataknots.push(...generateKnotAttributes(persondef,objectdefinition._id,metaknots)) 
// dataknots.push(...generateKnotAttributes(cardef,objectdefinition._id,metaknots))
// dataknots.push(...generateKnotAttributes(folderDef,objectdefinition._id,metaknots))

// let datadesigner = new Designer(dataknots.slice(),metaknots.slice(),'data',)
// this.document.body.appendChild(datadesigner.rootElement)




