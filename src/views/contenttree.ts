class ContentTree{

    // knots: Knot[]
    knotviews:KnotView[]
    rootElement: HTMLElement
    newbuttonElement: HTMLElement
    knotsElement: HTMLElement
    onKnotCreated = new EventSystem<string>()

    constructor(public designer:Designer){

        this.rootElement = string2html(`<div style="border:1px solid black; margin:10px; padding:10px;" >
            <div>
                <button id="newbutton">new</button>
            </div>
            <div id="knots"></div>
        </div>`)
        this.newbuttonElement = this.rootElement.querySelector('#newbutton')
        this.knotsElement = this.rootElement.querySelector('#knots')
        this.newbuttonElement.addEventListener('click',e => {

            this.addKnot(null,'persoon',{name:'dummy person'}).then(e => {
                this.onKnotCreated.trigger(e.knot._id)
            })
        })
    }

    reloadKnots(){
        return getList('knot',{dereferences:[],filter:{},paging:{limit:0,skip:0},sort:{createdAt:1}}).then((res:QueryResult<Knot>) => {
            this.knotsElement.innerHTML = ''
            var knots = res.data
            // this.knots = knots
            this.knotviews = knots.map(k => new KnotView(this.designer,k))
            this.knotviews.forEach(kv => kv.init())
            
            for(var knotview of this.knotviews){
                var parent = this.knotviews.find(kv => kv.knot._id == knotview.knot.parent)
                if(parent != null){
                    parent.childrenelement.appendChild(knotview.rootelement)
                }
                knotview.onKnotCreated.listen(e => {
                    this.reloadKnots()
                })
            }
            
            var rootnodes = this.knotviews.filter(k => k.knot.parent == null)
            for(var rootnode of rootnodes){
                this.knotsElement.appendChild(rootnode.rootelement)
            }
        })
    }

    async addKnot(parent:string,objname:string,object:any){
        //add knot to knots knotviews and to contenttree

        var knotid = await createKnotAndObjectByName(this.designer,parent,objname,object)
        var knot:Knot = await get('knot',knotid)
        var newknotview = new KnotView(this.designer,knot)
        newknotview.init()
        this.knotviews.push(newknotview)
        var parentknotview = this.knotviews.find(k => k.knot._id == knot.parent)
        if(parentknotview){
            parentknotview.childrenelement.appendChild(newknotview.rootelement)
            parentknotview.expand()
        }else{
            this.knotsElement.appendChild(newknotview.rootelement)
        }
        return newknotview
    }

    async removeKnot(knotid:string){
        //remove knot from knots knotviews and contenttree
        //find all descendants and delete those too

        var knotview = this.knotviews.find(kv => kv.knot._id == knotid)
        var parent = this.getParent(knotid)
        if(parent){
            parent.childrenelement.removeChild(knotview.rootelement)
            remove(this.knotviews,knotview)
            parent.updateMarker()
        }else{
            this.knotsElement.removeChild(knotview.rootelement)
        }

        //delete child nodes
        var nodes2delete = [knotid]
        nodes2delete = nodes2delete.concat(this.getDescendants(knotid).map(kv => kv.knot._id))
        
        var promises = nodes2delete.map(knotid2 => del('knot',knotid2))
        var knotviews2delete = nodes2delete.map(id => this.knotviews.find(kv => kv.knot._id == id))
        var objdeletepromises = knotviews2delete.map(kv => {
            var def = this.designer.definition.objdefinitions.find(od => od._id == kv.knot.objdef)
            return del(def.name, kv.knot.objid)
        })
        //delete corresponding objects
        var allknotpromises = Promise.all(promises)
        var allobjpromies = Promise.all(objdeletepromises)
        return await Promise.all([allknotpromises,allobjpromies])
    }


    //all this stuff should be implemented on the server

    getRoot(knot:string){
        var current = this.knotviews.find(k => k.knot._id == knot)
        while(current.knot.parent != null){
            current = this.knotviews.find(k => k.knot._id == current.knot.parent)
        }
        return current
    }

    getView(knot:string){
        return this.knotviews.find(kv => kv.knot._id == knot)
    }

    getParent(knot:string){
        var self = this.getView(knot)
        return this.knotviews.find(kv => kv.knot._id == self.knot.parent)
    }

    getChildren(knot:string){
        return this.knotviews.filter(kv => kv.knot.parent == knot)
    }

    getDescendants(knot:string):KnotView[]{
        var children = this.getChildren(knot)
        var descendants = children.slice()

        for(var child of children){
            var childdescendants = this.getDescendants(child.knot._id)
            descendants = descendants.concat(childdescendants)
        }
        
        return descendants
    }

    getPath(knot:string):string[]{
        var knotids = []
        var current = this.knotviews.find(k => k.knot._id == knot)
        while(current.knot.parent != null){
            knotids.unshift(current.knot._id)
            current = this.knotviews.find(k => k.knot._id == current.knot.parent)
        }
        return knotids
    }

    getDanglingKnots(){
        //get knots whose parent points to a non existing knot
        //null is fine means it is a rootnode
    }

    searchup(knot:Knot,objdef:string):Knot{
        return null
    }

    searchdown(knot:Knot,objdef:string):Knot{
        return null
    }
}