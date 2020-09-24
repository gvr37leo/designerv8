/// <reference path="./definition.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/ListView.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./views/table.ts" />
/// <reference path="./router.ts" />
/// <reference path="./views/contenttree.ts" />
/// <reference path="./views/knotView.ts" />
/// <reference path="./eventqueue.ts" />
/// <reference path="./utils.ts" />
/// <reference path="../node_modules/vectorx/vector.ts" />
/// <reference path="../node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="../node_modules/utilsx/utils.ts" />


class Designer{
    
    
    router:Router
    contentTree:ContentTree
    detalViewsMap = new Map<string,DetailView>()
    listViewsMap = new Map<string,ListView>()
    eventQueue:EventQueue = new EventQueue()

    appdef: AppDef
    objdefinitions: ObjDef[]
    datatypes: Datatype[]
    attributes: Attribute[]
    navbarelement: HTMLElement
    viewcontainer: HTMLElement
    contenttreeElement: HTMLElement
    rootElement: HTMLElement
    currentView: DetailView
    urlknotid: string
    // eventforneweventinevenetqueue

    constructor(public knots: Knot[],public collectionSrc:string){

        this.rootElement = string2html(`
            <div>
                <div id="navbar"></div>
                <div style="display:flex;">
                    <div id="contenttree"></div>
                    <div id="viewcontainer"></div>
                </div>
            </div>
        `)
        this.navbarelement = this.rootElement.querySelector('#navbar')
        this.viewcontainer = this.rootElement.querySelector('#viewcontainer')
        this.contenttreeElement = this.rootElement.querySelector('#contenttree')
        
        this.router = new Router()

        this.appdef = knots.find(k => k.objdef == '1') as AppDef
        this.objdefinitions = knots.filter(k => k.objdef == '2') as ObjDef[]
        this.datatypes = knots.filter(k => k.objdef == '4') as Datatype[]
        this.attributes = knots.filter(k => k.objdef == '3') as Attribute[]

        for(let obj of this.objdefinitions){
            let objattributes = this.attributes.filter(k => k.parent == obj._id)

            let dv = new DetailView(this,obj)
            let lv = new ListView(this,obj)
            this.detalViewsMap.set(obj._id,dv)
            this.listViewsMap.set(obj._id,lv)

        }

        this.contentTree = new ContentTree(this)
        this.contenttreeElement.appendChild(this.contentTree.rootElement)
        this.contentTree.loadAll().then(views => {
            // views.forEach(v => {
            //     v.expand()
            // })
            this.contentTree.expandTowards(this.urlknotid)
            this.contentTree.setSelectedKnot(this.urlknotid)
        })

        this.eventQueue.listen(EventTypes.create,(data) => {
            //get currently selected node
        })

        this.router.listen(new RegExp(`^/data/([a-zA-Z0-9]+)$`),(res) => {
            this.urlknotid = res[1]
            get(res[1]).then(knot => {
                this.mountAndLoad(knot)
            })
        })

        this.router.trigger(window.location.pathname)
    }


    mount(view:DetailView){
        this.currentView = view
        emptyHtmlElement(this.viewcontainer)
        this.viewcontainer.appendChild(view.rootelement)
    }

    mountAndLoad(knot:Knot){
        let dv = this.detalViewsMap.get(knot.objdef)
        this.mount(dv)
        dv.loadData(knot)
        
    }

    getObjDef(objdefid:string):ObjDef{
        return this.objdefinitions.find(o => o._id == objdefid)
    }

    getAttributes(objdefid:string):Attribute[]{
        return this.attributes.filter(a => a.parent == objdefid)
    }

    navigateToKnot(knotid:string){
        this.router.navigate(`/data/${knotid}`)
    }

}