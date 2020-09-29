


function getObjIdProp(appdef:AppDef,obj:any){
    
    if(appdef.debug){
        return obj['name']
    }else{
        return obj['_id']
    }
}

function getAttributeIdProp(appdef:AppDef,obj:any){

}

function emptyHtmlElement(el:HTMLElement){
    while(el.firstChild != null){
        el.removeChild(el.firstChild)
    }

}

function createWidget(attribute:Attribute,designer:Designer){
    //get datatype
    //check if name of datatype == "boolean"
    if(attribute.dataType == booleanDef._id){
        return new BooleanWidget()
    }
    if(attribute.dataType == dateDef._id){
        return new DateWidget()
    }
    if(attribute.dataType == idDef._id){
        return new IdWidget(attribute,designer)
    }
    if(attribute.dataType == numberDef._id){
        return new NumberWidget()
    }
    if(attribute.dataType == pointerDef._id){
        return new PointerWidget(attribute,designer)
    }
    if(attribute.dataType == rangeDef._id){
        return new RangeWidget()
    }
    if(attribute.dataType == stringDef._id){
        return new TextWidget()
    }
}