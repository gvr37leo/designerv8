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



        this.rootelement = string2html(`
            <div>
                <h1>${objDefinition.name}</h1>

                <div style="margin:10px;">
                    pageskip
                    <input id="pageskip" type="number" value="0">
                    pagesize
                    <input id="pagesize" type="number" value="10">
                    <button id="newbutton">new</button>
                </div>
                <div style="overflow: auto; padding:10px;" id="tablecontainer"></div>
            </div>
        `)
        this.pageskipelement = this.rootelement.querySelector('#pageskip')
        this.pagesizeelement = this.rootelement.querySelector('#pagesize')
        this.newbuttonelment = this.rootelement.querySelector('#newbutton')
        this.tablecontainer = this.rootelement.querySelector('#tablecontainer')


        this.pagesizeelement.addEventListener('change',() => {
            this.refreshTable()
        })
        this.pageskipelement.addEventListener('change',() => {
            this.refreshTable()
        })

        this.newbuttononclick = () => {
            create(objDefinition.name,{}).then(id => {
                this.designer.router.navigate(`/${this.objDefinition.name}/${id}`)
            })
        }
        this.newbuttonelment.addEventListener('click',this.newbuttononclick)
        
        this.attributes = designer.definition.attributes.filter(a => a.belongsToObject == objDefinition._id)

        this.table = new Table(this.attributes.map(a => {
            return new Column([
                () => {
                   
                    let element = string2html(`<span>${a.name}<span id="orderspan"></span></span>`)
                    this.titleHeaderElements.set(a._id,element)
                    element.addEventListener('click',() => {
                        var oldOrderby = this.orderby
                        this.orderby = a.name
                        if(oldOrderby == this.orderby){
                            this.orderAsc = !this.orderAsc
                        }else{
                            this.orderAsc = true
                        }
                        
                        this.setQueryAndReload2(this.getQuery())
                    })
                    return element
                },
                () => {
                    var filterwidget = new TextWidget()
                    this.filterWidgets.set(a._id,filterwidget)
                    filterwidget.inputelement.addEventListener('change',() => {
                        this.refreshTable()
                    })
                    return filterwidget.rootElement
                }
            ],(item,i) => {
                
                let widget = createWidget(this.designer.getDataTypeDef(a.dataType).name,a,this.designer)
                
                if(this.designer.getDataTypeDef(a.dataType).name == 'pointer'){

                    if(item[a.name]){
                        var url = `/${this.designer.getObjDef(a.pointsToObject).name}/${item[a.name]}`
                        var reffedobjecttype = this.designer.getObjDef(a.pointsToObject)
                        var displayattribute = this.designer.getAttribute(reffedobjecttype.displayAttribute)
                        var dereffedobject = this.dereferences[reffedobjecttype.name][item[a.name]]
                        return string2html(`<span><a href="${url}">${dereffedobject[displayattribute.name]}</a></span>`)//hier moet data uit de derefs opgehaald worden
                    }else{
                        return string2html(`<span></span>`)
                    }
                    
                }else{
                    widget.set(item[a.name])
                }
                widget.inputelement.readOnly = true
                return widget.rootElement
            })
        }))
        this.tablecontainer.appendChild(this.table.rootelement)

        
    }

    mount(){
        this.setQueryAndReload2(this.getQuery())
    }

    refreshTable(){
        getList(this.objDefinition.name,this.getQuery()).then(res => {
            this.dereferences = res.reffedObjects
            this.collectionSize = res.collectionSize
            this.prelimitsize = res.prelimitsize
            this.table.load(res.data)
            this.onRefreshFinished.trigger(null)
        })
    }

    getQuery(){
        var sort = {}
        sort[this.orderby] = this.orderAsc ? 1 : -1
        var filter = {}
        var dereferences = []
        for(var attribute of this.attributes){
            //fill filter
            if(this.filterWidgets.get(attribute._id).get()){
                filter[attribute.name] = this.filterWidgets.get(attribute._id).get()
            }

            //fill derefs
            if(this.designer.getDataTypeDef(attribute.dataType).name == 'pointer'){
                dereferences.push({
                    attribute:attribute.name,
                    collection:this.designer.getObjDef(attribute.pointsToObject).name,
                    dereferences:[],
                })
            }
        }

        return {
            filter:filter,
            paging:{
                limit:this.pagesizeelement.valueAsNumber,
                skip:this.pageskipelement.valueAsNumber,
            },
            dereferences:dereferences,
            sort:sort
        }
    }

    setQueryAndReload2(query:Query){
        var entry = Object.entries(query.sort)[0]
        this.setQueryAndReload(entry[0],entry[1] == 1,query.paging.limit,query.paging.skip,query.filter)
    }

    setQueryAndReload(orderby:string,orderasc:boolean,pagesize:number,pageskip:number,filter:any){
        this.orderby = orderby
        this.orderAsc = orderasc
        this.pageskipelement.valueAsNumber = pageskip
        this.pagesizeelement.valueAsNumber = pagesize

        
        for(let [key,value] of Object.entries(filter)){
            this.filterWidgets.get(this.designer.definition.attributes.find(a => a.name == key)._id).set(value)
        }

        for(var entry of this.titleHeaderElements.entries()){
            var attribute = this.designer.getAttribute(entry[0])
            var element = entry[1]
            let orderspan = element.querySelector('#orderspan')
            var ordericon = this.orderAsc ? '^' : 'V'
            orderspan.innerHTML = this.orderby == attribute.name ? ordericon : ''
        }

        this.refreshTable()
    }

}