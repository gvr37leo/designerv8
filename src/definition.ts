class AppDef{
    _id:string
    objdefinitions:ObjDef[]
    attributes:Attribute[]
    dataTypes:Datatype[]

    attributeIdentifier:string
    objIdentifier:string
    debug:boolean = true
}

class ObjDef{
    _id:string
    name:string
    allowAsRootnode:boolean
    displayAttribute:string
}

class Attribute{
    _id:string
    name: string
    belongsToObjectDef:string
    dataType:string

    pointsToObjectDef:string
}

class Datatype{
    _id:string
    name:string
}

class Knot{
    _id:string
    name:string
    parent:string//parentknot can be any type
    objdef:string//own type
    objid:string//not nescessary if knot is embedded

    isList:boolean//data will not be shown in contenttree and the knot will show a table of its children
    listTypeObjdef:string
}

enum DataType{
    string = '1',
    date = '2',
    range = '3',
    number = '4',
    pointer = '5',
    id = '6',
    boolean = '7'
}