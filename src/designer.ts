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
    eventQueue:EventQueue

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
    selfAppdef: AppdefCollection
    dataAppdef: AppdefCollection
    // eventforneweventinevenetqueue

    constructor(public datadefknots: Knot[],public selfdefknots:Knot[],public collectionSrc:string){
        this.datadefknots = datadefknots.slice()
        this.selfdefknots = datadefknots.slice()
        this.eventQueue = new EventQueue()
        this.router = new Router()
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
        
        

        this.selfAppdef = this.organizeMetaKnots(selfdefknots,selfdefknots)
        this.dataAppdef = this.organizeMetaKnots(datadefknots,selfdefknots)

        this.appdef = this.dataAppdef.appdef as AppDef
        this.objdefinitions = this.dataAppdef.objdefs as ObjDef[]
        this.datatypes = this.dataAppdef.datatypes as Datatype[]
        this.attributes = this.dataAppdef.attributes as Attribute[]

        for(let obj of this.objdefinitions){
            this.datadefknots.push(...this.generateKnotAttributes(obj))
            let dv = new DetailView(this,obj)
            let lv = new ListView(this,obj)
            this.detalViewsMap.set(obj._id,dv)
            this.listViewsMap.set(obj._id,lv)
        }

        this.contentTree = new ContentTree(this)
        this.contenttreeElement.appendChild(this.contentTree.rootElement)
        this.contentTree.loadAll().then(views => {
            if(this.urlknotid){
                this.contentTree.expandTowards(this.urlknotid)
                this.contentTree.setSelectedKnot(this.urlknotid)
            }
        })

        this.eventQueue.listen(EventTypes.create,(data) => {
            //get currently selected node
        })

        
        this.router.listen(new RegExp(`^/data/([a-zA-Z0-9]+)$`),(res) => {
            this.urlknotid = res[1]
            get(res[1]).then(knot => {
                if(knot != null){
                    this.mountAndLoad(knot)
                }else{
                    console.log(404)
                }

                
            })
        })

        this.router.trigger(window.location.pathname)
    }

    getCurrentId(){
        return this.urlknotid
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

    getAttributeNameProp(attribute:Attribute){
        var debug  = true
        if(debug){
            return attribute.name
        }else{
            return attribute._id
        }
    }

    generateKnotAttributes(objdefKnot:ObjDef){
        var objdefinitions = this.selfAppdef.objdefs
        var datatypes = this.selfAppdef.datatypes

        var attributedef = objdefinitions.find(k => k.name == 'attribute')
        var objdef = objdefinitions.find(k => k.name == 'objdef')
        var knotdef = objdefinitions.find(k => k.name == 'knot')
        var string = datatypes.find(k => k.name == 'string')
        var date = datatypes.find(k => k.name == 'date')
        // var range = datatypes.find(k => k.name == 'range')
        // var number = datatypes.find(k => k.name == 'number')
        var pointer = datatypes.find(k => k.name == 'pointer')
        var id = datatypes.find(k => k.name == 'id')
        // var boolean = datatypes.find(k => k.name == 'boolean')
        var res:Attribute[] = []
        res.push(new Attribute('_id',objdefKnot._id,id._id,null,attributedef._id))
        res.push(new Attribute('name',objdefKnot._id,string._id,null,attributedef._id))
        res.push(new Attribute('parent',objdefKnot._id,pointer._id,knotdef._id,attributedef._id))
        res.push(new Attribute('objdef',objdefKnot._id,pointer._id,objdef._id,objdef._id))
        res.push(new Attribute('lastupdate',objdefKnot._id,date._id,null,attributedef._id))
        res.push(new Attribute('createdAt',objdefKnot._id,date._id,null,attributedef._id))
        return res
    }

    organizeMetaKnots(dataknots:Knot[],metaknots:Knot[]){
        var knotmap = new Map<string,Knot>()
        metaknots.forEach(k => knotmap.set(k._id,k))
        return new AppdefCollection(
            dataknots.find(k => knotmap.get(k.objdef).name  == 'appdef') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'objdef') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'attribute') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'datatype') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'knot') as any,
        )
    }
}

class AppdefCollection{
    constructor(
        public appdef:AppDef,
        public objdefs:ObjDef[],
        public attributes:Attribute[],
        public datatypes:Datatype[],
        public knots:Knot[],
    ){

    }

}