class ListView{
    

    // query:Query(is saved in UI)
    // tableelement:Table<any>
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
    addfiltersbtn: HTMLElement
    filtersEl: HTMLElement
    tableEl: HTMLElement

    constructor(public designer:Designer,public objDefinition:ObjDef){
        var attributes = this.designer.getAttributes(this.objDefinition._id)
        this.rootelement = string2html(`
            <div>
                <div>
                    <button id="addfilters">addfilter</button>
                    <div id="filters">

                    </div>
                </div>
                <div id="#tableel"></div>
            </div>
        `)
        this.addfiltersbtn = this.rootelement.querySelector('#addfilters')
        this.filtersEl = this.rootelement.querySelector('#filters')
        this.tableEl = this.rootelement.querySelector('#tableel')

        this.addfiltersbtn.addEventListener('click', e => {
            var filterel = string2html(`
                <div style="display:flex; align-items:flex-end;">
                    <label style="display:flex; flex-direction:column;">
                        attribute
                        <select id="attributeselector"></select>
                    </label>
                    <label style="display:flex; flex-direction:column;">
                        type
                        <select id="typeselector">
                            <option value="=">=</option>
                            <option value="<">></option>
                            <option value=">"><</option>
                            <option value="!=">!=</option>
                            <option value="like">like</option>
                            <option value="regex">regex</option>
                        </select>
                    </label>
                    <label style="display:flex; flex-direction:column;">
                        value
                        <input style="width:120px;" id="filterinput" />
                    </label>
                    <button id="removebtn">remove</button>
                </div>
            `)
            var attributeselector = filterel.querySelector('#attributeselector')
            var typeselector = filterel.querySelector('#typeselector')
            var filterinput = filterel.querySelector('#filterinput')
            var removebtn = filterel.querySelector('#removebtn')
            for(var attribute of attributes){
                attributeselector.appendChild(string2html(`<option value="${attribute._id}">${attribute.name}</option>`))
            }
            this.filtersEl.appendChild(filterel)
        })

        var table = new Table([
            new Column([],(obj,i) => {
                return string2html(`<div>hello</div>`)
            }),
            new Column([],(obj,i) => {
                return string2html(`<div>hello</div>`)
            }),
            new Column([],(obj,i) => {
                return string2html(`<div>hello</div>`)
            }),
        ])
        table.load([{},{}])

        this.rootelement.appendChild(table.rootelement)

    }

}