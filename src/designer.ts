/// <reference path="./definition.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/ListView.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./views/table.ts" />
/// <reference path="./router.ts" />
/// <reference path="./views/contenttree.ts" />
/// <reference path="./views/knotView.ts" />
/// <reference path="../node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="../node_modules/utilsx/utils.ts" />
/// <reference path="./utils.ts" />

enum EventTypes{create,save,update,get,delete,detailviewmounted,listviewmounted,knotClicked}
class QueueEvent{

    constructor(
        public eventtype:EventTypes,
        public data:any,
    ){

    }
}

class Listener{
    constructor(public type:EventTypes,public cb:(data:any) => void){

    }
}

class EventQueue{
    listeners:Listener[] = []
    queue:QueueEvent[] = []

    listen(type:EventTypes,cb:(data:any) => void){
        this.listeners.push(new Listener(type,cb))
    }

    pushEvent(event:EventTypes,data:any){
        this.queue.push(new QueueEvent(event,data))
    }

    process(){
        while(this.queue.length > 0){
            var event = this.queue.shift()
            var l = this.listeners.filter(l => l.type == event.eventtype)
            for(var listener of l){
                listener.cb(event.data)
            }
        }
    }

    trigger(event:EventTypes,data:any){
        this.pushEvent(event,data)
        this.process()
    }
}

class Designer{
    
    
    router:Router
    contentTree:ContentTree
    detalViews = new Map<string,DetailView>()
    listViews = new Map<string,ListView>()
    eventQueue:EventQueue = new EventQueue()

    appdef: AppDef
    objdefinitions: ObjDef[]
    datatypes: Datatype[]
    attributes: Attribute[]
    navbarelement: HTMLElement
    viewcontainer: HTMLElement
    contenttreeElement: HTMLElement
    rootElement: HTMLElement
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

        for(var obj of this.objdefinitions){
            var objattributes = this.attributes.filter(k => k.parent == obj._id)

            var dv = new DetailView(this,obj)
            var lv = new ListView(this,obj)

        }

        this.eventQueue.listen(EventTypes.create,(data) => {
            
            var knot = new Knot('blank',this.contentTree.selectedKnot,data.objdefid,false,null)
            create(knot).then(id => {
                knot._id = id
                this.mountAndLoad(knot)
                
            })
            //get currently selected node
        })

        this.router.listen(new RegExp(`^/data/([a-zA-Z0-9]+)$`),(res) => {
            get(res[2]).then(knot => {
                this.mountAndLoad(knot)
            })
        })

        this.router.trigger(window.location.pathname)
    }


    mount(view:DetailView){
        emptyHtmlElement(this.viewcontainer)
        this.viewcontainer.appendChild(view.rootelement)
    }

    mountAndLoad(knot:Knot){
        var dv = this.detalViews.get(knot.objdef)
        this.mount(dv)
        dv.load(knot)
        
    }

    getAttributes(objdefid:string):Attribute[]{
        return this.attributes.filter(a => a.objdef == objdefid)
    }

}