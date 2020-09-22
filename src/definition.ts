class Knot{
    
    static idcounter = 1
    _id:string
    lastUpdated:number
    createdAt:number

    constructor(
        
        public name:string,
        public parent:string,//parentknot can be any type
        public objdef:string,//own type
    
        public isList:boolean,//data will not be shown in contenttree and the knot will show a table of its children
        public listTypeObjdef:string,

    ){
        this._id = Knot.idcounter.toString();
        Knot.idcounter++;
    }
}

function generateKnotAttributes(knot:Knot,string:string,date:string,range:string,number:string,pointer:string,id:string,boolean:string,objdef:string){
    var res:Attribute[] = []
    res.push(new Attribute('_id',knot._id,false,null,id,null))
    res.push(new Attribute('name',knot._id,false,null,string,null))
    res.push(new Attribute('parent',knot._id,false,null,pointer,null))//knot?pointer to parent could be any object so it should just search on the complete knot set
    res.push(new Attribute('objdef',knot._id,false,null,pointer,objdef))//objdef type the pointer points too
    res.push(new Attribute('isList',knot._id,false,null,boolean,null))
    res.push(new Attribute('listTypeObjdef',knot._id,false,null,pointer,objdef))//objdef
    res.push(new Attribute('lastUpdated',knot._id,false,null,date,null))
    res.push(new Attribute('createdAt',knot._id,false,null,date,null))
    return res
}


class AppDef extends Knot{
    
    debug:boolean = true

    constructor(name:string,parent:string,isList:boolean,listTypeObjdef:string,
        ){
        super(name,parent,'1',isList,listTypeObjdef)
    }

}

class ObjDef extends Knot{
    
    
    // displayAttribute:string

    constructor(name:string,parent:string,isList:boolean,listTypeObjdef:string,public allowAsRootnode:boolean){
        super(name,parent,'2',isList,listTypeObjdef)
    }

}



class Attribute extends Knot{
    constructor(
        name:string,parent:string,isList:boolean,listTypeObjdef:string,
        public dataType:string,
        public pointsToObjectDef:string,
    ){
        super(name,parent,'3',isList,listTypeObjdef)
    }
}

class Datatype extends Knot{
    constructor(
        name:string,parent:string,isList:boolean,listTypeObjdef:string,
    ){
        super(name,parent,'4',isList,listTypeObjdef)
    }
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