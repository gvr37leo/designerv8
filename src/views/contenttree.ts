class ContentTree{

    // knots: Knot[]
    knotviewsMap = new Map<string,KnotView>();
    rootElement: HTMLElement
    newbuttonElement: HTMLElement
    knotsElement: HTMLElement
    contextpanel: HTMLElement
    selectedKnotId:string = null

    constructor(public designer:Designer){

        this.rootElement = string2html(`<div style="border:1px solid black; margin:10px; padding:10px;" >
            <div>
                <button style="display:none;" id="newbutton">new</button>
            </div>
            <div style="display:flex;">
                <div id="knots" style="margin-right:10px;"></div>
                <div style="display:flex; flex-direction:column;" id="contextpanel">
                </div>
            </div>
            
        </div>`)
        this.newbuttonElement = this.rootElement.querySelector('#newbutton')
        this.knotsElement = this.rootElement.querySelector('#knots')
        this.contextpanel = this.rootElement.querySelector('#contextpanel')
        this.newbuttonElement.addEventListener('click',e => {
            
        })

        for(let objdef of this.designer.objdefinitions){
            let html = string2html(`<button>new ${objdef.name}</button>`)
            html.addEventListener('click',async e => {
                let knot = new Knot(objdef.name,this.selectedKnotId,objdef._id)
                var id = await create(knot)
                knot._id = id
                await this.loadChildren(this.selectedKnotId)
                this.designer.navigateToKnot(knot._id)
            })
            this.contextpanel.appendChild(html)
        }

        this.designer.eventQueue.listen(EventTypes.knotArrowClicked,(data) => {
            
            let knotview = this.knotviewsMap.get(data.knotid)
            if(knotview.childrenLoaded == false){
                knotview.childrenLoaded = true
                this.loadChildren(data.knotid)
            }
        })

        this.designer.eventQueue.listen(EventTypes.knotNameClicked,(data) => {
            this.setSelectedKnot(data.knotid)
        })
    }

    setSelectedKnot(knotid:string){
        if(this.knotviewsMap.get(knotid) != null){
            var oldview = this.knotviewsMap.get(this.selectedKnotId)
            oldview?.namearrowelement?.classList?.remove('selected')
            this.selectedKnotId = knotid
            var currentview = this.knotviewsMap.get(this.selectedKnotId)
            
            currentview.namearrowelement.classList.add('selected')
            this.designer.navigateToKnot(knotid)
        }
    }

    expandTowards(knotid:string){
        var current = this.knotviewsMap.get(knotid)
        while(current != null){
            current.expand()
            current = this.knotviewsMap.get(current.knot.parent)
        }
    }

    async loadAll(){
        var query = genSimpleQuery('','')
        query.filter = []
        var res = await search(query)
        return this.upsertMany(res.data)
    }
    
    async loadChildren(knotid:string){
        let children = await getChildren(knotid)
        return this.upsertMany(children.data)
    }

    async loadAncestors(knotid:string){
        let ancestors = await getAncestors(knotid)
        let knotviews = this.upsertMany(ancestors)
        knotviews.forEach(kv => kv.expand())
        return knotviews
    }

    async loadDescendants(knotid:string){
        let descendants = await getDescendants(knotid)
        let knotviews = this.upsertMany(descendants)
        knotviews.forEach(kv => kv.expand())
        return knotviews
    }

    remove(knot:Knot){
        var self = this.knotviewsMap.get(knot._id)
        var parent = this.knotviewsMap.get(knot.parent)
        this.knotviewsMap.delete(knot._id)
        parent.childrenelement.removeChild(self.rootelement)
        //todo:children of knotview should be recursively deleted from this.knotsviewMap
    }

    upsertMany(knots:Knot[]){
        let needAttaching:Knot[] = []
        for(let knot of knots){
            let view = this.knotviewsMap.get(knot._id)
            if(view == null){
                view = new KnotView(this.designer,knot).init()
                this.knotviewsMap.set(knot._id,view)
                needAttaching.push(knot)
            }else{
                view.set(knot)
            }
        }

        for(let knot of needAttaching){
            let view = this.knotviewsMap.get(knot._id)
            if(knot.parent == null){
                this.knotsElement.appendChild(view.rootelement)
            }else{
                let parentview = this.knotviewsMap.get(knot.parent)
                parentview.childrenelement.appendChild(view.rootelement)
            }
        }
        return knots.map(k => this.knotviewsMap.get(k._id))
    }

    upsert(knot:Knot){
        this.upsertMany([knot])
    }

}

//contenttree side panel with create for every objdef
