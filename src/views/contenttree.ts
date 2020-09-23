class ContentTree{

    // knots: Knot[]
    knotviews:KnotView[] = []
    rootElement: HTMLElement
    newbuttonElement: HTMLElement
    knotsElement: HTMLElement
    contextpanel: HTMLElement
    selectedKnot:string = null

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
            html.addEventListener('click', e => {
                let knot = new Knot('blank',this.selectedKnot,objdef._id)
                create(knot).then(id => {
                    knot._id = id
                    this.designer.navigateToKnot(knot._id)
                })
            })
            this.contextpanel.appendChild(html)
        }

        this.designer.eventQueue.listen(EventTypes.knotArrowClicked,(data) => {
            
            let knotview = this.knotviews.find(kv => kv.knot._id == data.knotid)
            if(knotview.childrenLoaded == false){
                knotview.childrenLoaded = true
                this.loadChildren(data.knotid)
            }
        })

        this.designer.eventQueue.listen(EventTypes.knotNameClicked,(data) => {
            this.selectedKnot = data.knotid
            this.designer.navigateToKnot(data.knotid)
        })
    }

    
    async loadChildren(knotid:string){
        let knotview = this.knotviews.find(k => k.knot._id == knotid)
        let children = await getChildren(knotid)
        for(let child of children.data){
            let childkv = new KnotView(this.designer,child).init()
            this.knotviews.push(childkv)
            if(knotview == null){
                this.knotsElement.appendChild(childkv.rootelement)
            }else{
                knotview.childrenelement.appendChild(childkv.rootelement)
            }
            
        }
    }
}

//contenttree side panel with create for every objdef
