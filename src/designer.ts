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

    // appdef: AppDef
    // objdefinitions: ObjDef[]
    // datatypes: Datatype[]
    // attributes: Attribute[]
    navbarelement: HTMLElement
    viewcontainer: HTMLElement
    contenttreeElement: HTMLElement
    rootElement: HTMLElement
    currentView: DetailView
    urlknotid: string
    selfAppdef: AppdefCollection
    dataAppdef: AppdefCollection
    importbtn: HTMLElement
    importtextarea: HTMLTextAreaElement
    // eventforneweventinevenetqueue

    constructor(datadefknots: Knot[],selfdefknots:Knot[],public collectionSrc:string){
        // this.datadefknots = datadefknots.slice()
        // this.selfdefknots = datadefknots.slice()
        this.eventQueue = new EventQueue()
        this.router = new Router()
        this.rootElement = string2html(`
            <div>
                <div id="navbar"></div>
                <div style="display:flex; flex-direction:column; align-items:start">
                    <button id="importbtn">import</button>
                    <label>
                        <textarea id="importtextarea"></textarea>
                    </label>
                </div>
                <div style="display:flex;">
                    <div id="contenttree"></div>
                    <div id="viewcontainer"></div>
                </div>
            </div>
        `)
        this.navbarelement = this.rootElement.querySelector('#navbar')
        this.viewcontainer = this.rootElement.querySelector('#viewcontainer')
        this.contenttreeElement = this.rootElement.querySelector('#contenttree')
        this.importbtn = this.rootElement.querySelector('#importbtn')
        this.importtextarea = this.rootElement.querySelector('#importtextarea')
        
        this.importbtn.addEventListener('click', e => {
            var knots = JSON.parse(this.importtextarea.value) 
            importdata(knots)
        })

        this.selfAppdef = this.organizeMetaKnots(selfdefknots,selfdefknots)
        this.dataAppdef = this.organizeMetaKnots(datadefknots,selfdefknots)

        // this.appdef = this.dataAppdef.appdef as AppDef
        // this.objdefinitions = this.dataAppdef.objdefs as ObjDef[]
        // this.datatypes = this.dataAppdef.datatypes as Datatype[]
        // this.attributes = this.dataAppdef.attributes as Attribute[]

        for(let obj of this.dataAppdef.objdefs){
            this.dataAppdef.attributes.push(...this.generateKnotAttributes(obj))
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

        document.addEventListener('keydown',e => {
            if(e.key == 's' && e.ctrlKey == true){
                e.preventDefault()
                this.currentView.save()
            }
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
        return this.dataAppdef.objdefs.find(o => o._id == objdefid)
    }

    getAttributes(objdefid:string):Attribute[]{
        return this.dataAppdef.attributes.filter(a => a.parent == objdefid)
    }

    navigateToKnot(knotid:string){
        this.router.navigate(`/data/${knotid}`)
    }

    getAttributeNameProp(attribute:Attribute){
        let debug  = true
        if(debug){
            return attribute.name
        }else{
            return attribute._id
        }
    }

    generateKnotAttributes(objdefKnot:ObjDef){
        let objdefinitions = this.selfAppdef.objdefs
        let datatypes = this.selfAppdef.datatypes
        
        let attributedef = objdefinitions.find(k => k.name == 'attribute')
        let objdef = objdefinitions.find(k => k.name == 'objdef')
        let folderdef = objdefinitions.find(k => k.name == 'folder')
        let objfolder = this.selfAppdef.folders.find(k => k.name == 'objdefs')
        let string = datatypes.find(k => k.name == 'string')
        let date = datatypes.find(k => k.name == 'date')
        // let range = datatypes.find(k => k.name == 'range')
        // let number = datatypes.find(k => k.name == 'number')
        let pointer = datatypes.find(k => k.name == 'pointer')
        let id = datatypes.find(k => k.name == 'id')
        // let boolean = datatypes.find(k => k.name == 'boolean')
        let res:Attribute[] = []
        res.push(new Attribute('_id',objdefKnot._id,id._id,null,attributedef._id))
        res.push(new Attribute('name',objdefKnot._id,string._id,null,attributedef._id))
        res.push(new Attribute('parent',objdefKnot._id,pointer._id,objfolder._id,attributedef._id))
        res.push(new Attribute('objdef',objdefKnot._id,pointer._id,objfolder._id,objdef._id))
        res.push(new Attribute('lastupdate',objdefKnot._id,date._id,null,attributedef._id))
        res.push(new Attribute('createdAt',objdefKnot._id,date._id,null,attributedef._id))
        return res
    }

    organizeMetaKnots(dataknots:Knot[],metaknots:Knot[]){
        let knotmap = new Map<string,Knot>()
        metaknots.forEach(k => knotmap.set(k._id,k))
        return new AppdefCollection(
            dataknots.find(k => knotmap.get(k.objdef).name  == 'appdef') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'objdef') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'attribute') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'datatype') as any,
            dataknots.filter(k => knotmap.get(k.objdef).name == 'folder') as any,
        )
    }

    
    createWidget(attribute:Attribute,designer:Designer){
        let boolean = designer.selfAppdef.datatypes.find(d => d.name == 'boolean')
        let date = designer.selfAppdef.datatypes.find(d => d.name == 'date')
        let id = designer.selfAppdef.datatypes.find(d => d.name == 'id')
        let number = designer.selfAppdef.datatypes.find(d => d.name == 'number')
        let pointer = designer.selfAppdef.datatypes.find(d => d.name == 'pointer')
        let range = designer.selfAppdef.datatypes.find(d => d.name == 'range')
        let string = designer.selfAppdef.datatypes.find(d => d.name == 'string')

        if(attribute.dataType == boolean._id){
            return new BooleanWidget()
        }
        if(attribute.dataType == date._id){
            return new DateWidget()
        }
        if(attribute.dataType == id._id){
            return new IdWidget(attribute,designer)
        }
        if(attribute.dataType == number._id){
            return new NumberWidget()
        }
        if(attribute.dataType == pointer._id){
            return new PointerWidget(attribute,designer)
        }
        if(attribute.dataType == range._id){
            return new RangeWidget()
        }
        if(attribute.dataType == string._id){
            return new TextWidget()
        }
    }
}

class AppdefCollection{
    constructor(
        public appdef:AppDef,
        public objdefs:ObjDef[],
        public attributes:Attribute[],
        public datatypes:Datatype[],
        public folders:FolderDef[],
    ){

    }

}