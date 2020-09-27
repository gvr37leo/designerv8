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
    limitel: HTMLInputElement
    skipel: HTMLInputElement
    searchbtn: HTMLElement
    filterviews:FilterView[] = []

    constructor(public designer:Designer,public objDefinition:ObjDef){
        this.attributes = this.designer.getAttributes(this.objDefinition._id)
        this.rootelement = string2html(`
            <div>
                <div>
                    <label>
                        limit
                        <input type="number" value="0" id="limit" />
                    </label>
                    <label>
                        skip
                        <input type="number" value="0" id="skip" />
                    </label>
                    <button id="search">search</button>
                </div>
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
        this.limitel = this.rootelement.querySelector('#limit')
        this.skipel = this.rootelement.querySelector('#skip')
        this.searchbtn = this.rootelement.querySelector('#search')

        this.addfiltersbtn.addEventListener('click', e => {
            var filters = this.getFilters()
            filters.push({propname:this.designer.getAttributeNameProp(this.attributes[0]),type:'=',value:''})
            this.setFilters(filters)
        })

        var table = new Table<any>(this.attributes.map(a => {
            return new Column([
                () => {
                    return string2html(`<span>${a.name}</span>`)
                }
            ],(obj,i) => {
                return string2html(`<div>${obj[this.designer.getAttributeNameProp(a)]}</div>`)
            })
        }))
        this.searchbtn.addEventListener('click',async e => {
            var res = await search(this.getQuery())
            table.load(res.data)
        })

        this.rootelement.appendChild(table.rootelement)

    }

    setQuery(query:Query){
        this.limitel.value = query.paging.limit.toString()
        this.skipel.value = query.paging.skip.toString()
        this.setFilters(query.filter)
    }

    getQuery():Query{
        var query:Query = {
            filter:this.getFilters(),
            paging:{
                limit:parseInt(this.limitel.value),
                skip:parseInt(this.skipel.value),
            },
            dereferences:[],
            sort:[],
        }
        return query
    }

    getFilters():Filter[]{
        return this.filterviews.map(fv => fv.get())
    }

    setFilters(filters:Filter[]){
        
        this.filtersEl.innerHTML = ''
        this.filterviews = []
        for(let i = 0; i < filters.length; i++){
            let filter = filters[i]
            let fv = new FilterView(this.attributes,this.designer)
            this.filterviews.push(fv)
            fv.set(filter)
            this.filtersEl.appendChild(fv.rootelement)

            fv.removebtn.addEventListener('click', e => {
                let filters2 = this.getFilters()
                filters2.splice(i,1)
                this.setFilters(filters2)
            })
        }
        
    }
}

class FilterView{
    rootelement: HTMLElement
    attributeselector: HTMLInputElement
    typeselector: HTMLInputElement
    filterinput: HTMLInputElement
    removebtn: HTMLElement


    constructor(public attributes:Attribute[],public designer:Designer){
        this.rootelement =  string2html(`
            <div style="display:flex; align-items:flex-end;">
                <label style="display:flex; flex-direction:column;">
                    attribute
                    <select class="attributeselector"></select>
                </label>
                <label style="display:flex; flex-direction:column;">
                    type
                    <select class="typeselector">
                        <option value="=">=</option>
                        <option value=">">></option>
                        <option value="<"><</option>
                        <option value="!=">!=</option>
                        <option value="like">like</option>
                        <option value="regex">regex</option>
                    </select>
                </label>
                <label style="display:flex; flex-direction:column;">
                    value
                    <input style="width:120px;" class="filterinput" />
                </label>
                <button class="removebtn">remove</button>
            </div>
        `)

        this.attributeselector = this.rootelement.querySelector('.attributeselector')
        this.typeselector = this.rootelement.querySelector('.typeselector')
        this.filterinput = this.rootelement.querySelector('.filterinput')
        this.removebtn = this.rootelement.querySelector('.removebtn')

        for(var attribute of this.attributes){
            this.attributeselector.appendChild(string2html(`<option value="${attribute._id}">${attribute.name}</option>`))
        }
    }

    get():Filter{
        var attribute = this.attributes.find(a => a._id == this.attributeselector.value)
        var value:any = this.filterinput.value
        if(attribute.dataType == numberDef._id || attribute.dataType == dateDef._id){
            value = parseInt(value)
        }
        var filter:Filter = {
            propname:this.designer.getAttributeNameProp(attribute),
            type:this.typeselector.value,
            value:value,
        }
        return filter
    }

    set(filter:Filter){
        this.attributeselector.value = filter.propname
        this.typeselector.value = filter.type
        this.filterinput.value = filter.value
    }
}