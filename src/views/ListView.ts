class ListView{
    

    // query:Query(is saved in UI)
    table:Table<any>
    orderby = 'createdAt'
    orderAsc = true

    rootelement:HTMLElement
    newbuttonelment:HTMLElement
    pageskipelement:HTMLInputElement
    pagesizeelement:HTMLInputElement
    tablecontainer:HTMLElement
    filterWidgets:Map<string,Widget> = new Map()
    titleHeaderElements:Map<string,HTMLElement> = new Map()
    attributes: Attribute[]
    newbuttononclick: () => void
    dereferences: any[]
    collectionSize: number
    prelimitsize: number
    onRefreshFinished: EventSystem<any> = new EventSystem()

    constructor(public designer:Designer,public objDefinition:ObjDef){

    }

}