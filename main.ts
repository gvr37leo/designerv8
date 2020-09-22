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








var selfdef = new ObjDef('appdef',null,false,null,true)

var datatypeholder = new Knot('datatypes',selfdef._id,'99',true,'4')
var stringDef = new Datatype('string',datatypeholder._id,false,null)
var dateDef = new Datatype('date',datatypeholder._id,false,null)
var rangeDef = new Datatype('range',datatypeholder._id,false,null)
var numberDef = new Datatype('number',datatypeholder._id,false,null)
var pointerDef = new Datatype('pointer',datatypeholder._id,false,null)
var idDef = new Datatype('id',datatypeholder._id,false,null)
var booleanDef = new Datatype('boolean',datatypeholder._id,false,null)

var objectdefinition = new ObjDef('objdef',selfdef._id,false,null,false)
var allowAsRootNode = new Attribute('allowAsRootNode',objectdefinition._id,false,null,booleanDef._id,null)

var attributedefinition = new ObjDef('attribute',selfdef._id,false,null,false)
var datatypeAttributeDef = new Attribute('datatype',attributedefinition._id,false,null,pointerDef._id,datatypedefinition._id)
var pointsToObjectDef = new Attribute('pointsToObject',attributedefinition._id,false,null,pointerDef._id,datatypedefinition._id)

var datatypedefinition = new ObjDef('datatype',selfdef._id,false,null,false)

var knotDef = new ObjDef('knot',selfdef._id,false,null,false)


generateKnotAttributes(selfdef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(objectdefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(attributedefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(datatypedefinition,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)
generateKnotAttributes(knotDef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)

var metaknots:Knot[] = [selfdef,datatypeholder,stringDef,dateDef,rangeDef,numberDef,pointerDef,idDef,booleanDef,objectdefinition,allowAsRootNode,attributedefinition,datatypeAttributeDef,pointsToObjectDef,]

// var metadesigner = new Designer(metaknots,'metadata')
//need something to identify objs,attributes,appdefs and datatypes for rendering (maybe in appdef set ids of each type, or hardcoded)





//this definition should be read from database
//reference definitions from metadata designer

var rootdef = new ObjDef('root',null,false,null,true)

var peopledef = new ObjDef('people',rootdef._id,false,null,false)
var phonenumberdef = new Attribute('plate',peopledef._id,false,null,stringDef._id,null)
var frienddef = new Attribute('friend',peopledef._id,false,null,pointerDef._id,peopledef._id)

var cardef = new ObjDef('cars',rootdef._id,false,null,false)
var platedef = new Attribute('plate',cardef._id,false,null,stringDef._id,null)

var dataknots:Knot[] = [rootdef,peopledef,phonenumberdef,frienddef,cardef,platedef]
dataknots.push(...generateKnotAttributes(peopledef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id)) 
dataknots.push(...generateKnotAttributes(cardef,stringDef._id,dateDef._id,rangeDef._id,numberDef._id,pointerDef._id,idDef._id,booleanDef._id,objectdefinition._id))
var datadesigner = new Designer(dataknots,'data')
this.document.body.appendChild(datadesigner.rootElement)




