class ContentTree{

    // knots: Knot[]
    knotviews:KnotView[]
    rootElement: HTMLElement
    newbuttonElement: HTMLElement
    knotsElement: HTMLElement
    contextpanel: HTMLElement
    selectedKnot:string = null

    constructor(public designer:Designer){

        this.rootElement = string2html(`<div style="border:1px solid black; margin:10px; padding:10px;" >
            <div>
                <button id="newbutton">new</button>
            </div>
            <div id="contextpanel">
                
            </div>
            <div id="knots"></div>
        </div>`)
        this.newbuttonElement = this.rootElement.querySelector('#newbutton')
        this.knotsElement = this.rootElement.querySelector('#knots')
        this.contextpanel = this.rootElement.querySelector('#contextpanel')
        this.newbuttonElement.addEventListener('click',e => {
            
        })

        for(var objdef of this.designer.objdefinitions){
            var html = string2html(`<button>new ${objdef.name}</button>`)
            html.addEventListener('click', e => {
                this.designer.eventQueue.trigger(EventTypes.create,{objdefid:objdef._id})
            })
            this.contextpanel.appendChild(html)
        }

        this.designer.eventQueue.listen(EventTypes.knotClicked,(data) => {
            this.selectedKnot = data.knotid
            var knotview = this.knotviews.find(kv => kv.knot._id == data.knotid)
            if(knotview.childrenLoaded == false){
                knotview.childrenLoaded = true
                this.loadChildren(data.knotid)
            }

        })
    }

    
    async loadChildren(knotid:string){
        var knotview = this.knotviews.find(k => k.knot._id == knotid)
        var children = await getChildren(knotid)
        for(var child of children){
            var childkv = new KnotView(this.designer,child)
            this.knotviews.push(childkv) 
            knotview.childrenelement.appendChild(childkv.rootelement)
        }
    }
}

//contenttree side panel with create for every objdef
