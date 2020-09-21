/// <reference path="./definition.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/ListView.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./views/table.ts" />
/// <reference path="./router.ts" />
/// <reference path="./views/contenttree.ts" />
/// <reference path="./views/knotView.ts" />
// / <reference path="../node_modules/eventsystemx/EventSystem.ts" />
// / <reference path="../node_modules/utilsx/utils.ts" />
/// <reference path="./utils.ts" />

enum Events{save,update,get,delete,detailviewmounted,listviewmounted}

class Designer{
    
    
    router:Router
    contentTree:ContentTree
    detalViews = new Map<string,DetailView>()
    listViews = new Map<string,ListView>()
    eventQueue
    appdef: AppDef
    objdefinitions: ObjDef[]
    datatypes: Datatype[]
    attributes: Attribute[]
    // eventforneweventinevenetqueue

    constructor(public knots: Knot[],public collectionSrc:string){
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
    }





}