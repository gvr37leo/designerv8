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

// var designer = new Designer()