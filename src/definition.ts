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




class AppDef extends Knot{
    
    debug:boolean = true

    constructor(name:string,parent:string,isList:boolean,listTypeObjdef:string,objdef:string
        ){
        super(name,parent,objdef)
        // this.objdef = this._id
    }

}

class ObjDef extends Knot{
    
    
    // displayAttribute:string
    

    constructor(name:string,parent:string,public isList:boolean,public listTypeObjdef:string,public allowAsRootnode:boolean,objdef:string,
        ){
        super(name,parent,objdef)
        // this.objdef = this._id
    }

}




class Attribute extends Knot{
    constructor(
        name:string,parent:string,
        public dataType:string,
        public selectKnot:string,objdef:string,
    ){
        super(name,parent,objdef)
        // this.objdef = this._id
    }
}

class Datatype extends Knot{
    constructor(
        name:string,parent:string,objdef:string,
    ){
        super(name,parent,objdef)
        // this.objdef = this._id
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