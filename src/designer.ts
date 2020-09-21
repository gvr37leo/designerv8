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
    // eventforneweventinevenetqueue

    constructor(public appdef:AppDef){
        this.router = new Router()
        this.

        for(var obj of this.appdef.objdefinitions){
            var attributes = this.appdef.attributes.filter(a => a.pointsToObjectDef == obj._id)

            var dv = new DetailView(this,obj)
            var lv = new ListView(this,obj)

        }
    }





}