class Knot{
    
    static idcounter = 1
    _id:string
    lastUpdated:number
    createdAt:number

    constructor(
        
        public name:string,
        public parent:string,//parentknot can be any type
        public objdef:string,//own type
    
        

    ){
        this._id = Knot.idcounter.toString();
        Knot.idcounter++;
    }
}

function generateKnotAttributes(knot:Knot,string:string,date:string,range:string,number:string,pointer:string,id:string,boolean:string,objdef:string){
    var res:Attribute[] = []
    res.push(new Attribute('_id',knot._id,id,null))
    res.push(new Attribute('name',knot._id,string,null))
    res.push(new Attribute('parent',knot._id,pointer,null))//knot?pointer to parent could be any object so it should just search on the complete knot set
    res.push(new Attribute('objdef',knot._id,pointer,objdef))//objdef type the pointer points too
    res.push(new Attribute('lastupdate',knot._id,date,null))
    res.push(new Attribute('createdAt',knot._id,date,null))
    return res
}


class AppDef extends Knot{
    
    debug:boolean = true

    constructor(name:string,parent:string,isList:boolean,listTypeObjdef:string,
        ){
        super(name,parent,'1')
    }

}

class ObjDef extends Knot{
    
    
    // displayAttribute:string
    

    constructor(name:string,parent:string,public isList:boolean,public listTypeObjdef:string,public allowAsRootnode:boolean,
        ){
        super(name,parent,'2')
    }

}



class Attribute extends Knot{
    constructor(
        name:string,parent:string,
        public dataType:string,
        public pointsToObjectDef:string,
    ){
        super(name,parent,'3')
    }
}

class Datatype extends Knot{
    constructor(
        name:string,parent:string,
    ){
        super(name,parent,'4')
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