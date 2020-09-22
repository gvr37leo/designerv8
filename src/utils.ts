


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

function createWidget(dataTypename:string,attribute:Attribute,designer:Designer){
    if(dataTypename == 'boolean'){
        return new BooleanWidget()
    }
    if(dataTypename == 'date'){
        return new DateWidget()
    }
    if(dataTypename == 'id'){
        return new IdWidget(attribute,designer)
    }
    if(dataTypename == 'number'){
        return new NumberWidget()
    }
    if(dataTypename == 'pointer'){
        return new PointerWidget(attribute,designer)
    }
    if(dataTypename == 'range'){
        return new RangeWidget()
    }
    if(dataTypename == 'string'){
        return new TextWidget()
    }
}