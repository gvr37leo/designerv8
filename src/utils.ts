


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