class KnotView{

    expanded = false
    selected = false
    rootelement:HTMLElement
    arrowelement:HTMLElement
    nameelement:HTMLElement
    childrenelement:HTMLElement
    onKnotCreated = new EventSystem<string>()
    deletebutton: HTMLElement
    newbutton: HTMLElement

    constructor(public designer:Designer,public knot:Knot){
        
        
    }

    init(){
        this.rootelement = string2html(`
            <div>
                <div style="display:flex;">
                    <div id="arrow" style="flex-grow:0; width:10px; cursor:pointer">arrow</div>
                    <div id="name" style="flex-grow:1;" >name</div>
                    <button id="newbutton">newchild</button>
                    <button id="deletebutton">delete</button>
                </div>
                <div id="children" style="display:none; margin-left:20px;"></div>
            </div>
        `)

        this.arrowelement = this.rootelement.querySelector('#arrow')
        this.nameelement = this.rootelement.querySelector('#name')
        this.childrenelement = this.rootelement.querySelector('#children')
        this.deletebutton = this.rootelement.querySelector('#deletebutton')
        this.newbutton = this.rootelement.querySelector('#newbutton')

        this.arrowelement.innerText = this.getMarker()
        this.nameelement.innerText = this.knot.name

        this.arrowelement.addEventListener('click', e => {
            this.toggle()
        })

        this.newbutton.addEventListener('click', e => {
            this.designer.contenttree.addKnot(this.knot._id,'persoon',{
                name:'dummy person'
            })
        })

        this.deletebutton.addEventListener('click', e => {
            this.designer.contenttree.removeKnot(this.knot._id)
        })

        this.nameelement.addEventListener('click', e => {
            var def = this.designer.definition.objdefinitions.find(def => def._id == this.knot.objdef)
            this.designer.router.navigate(`/${def.name}/${this.knot.objid}`)
        })
    }

    

    expand(){
        this.expanded = true
        this.arrowelement.innerText = this.getMarker()
        this.childrenelement.style.display = ''
    }

    collapse(){
        this.expanded = false
        this.arrowelement.innerText = this.getMarker()
        this.childrenelement.style.display = 'none'
    }

    toggle(){
        if(this.expanded){
            this.collapse()
        }else{
            this.expand()
        }
    }

    updateMarker(){
        this.arrowelement.innerText = this.getMarker()
    }

    hasChildren(){
        var firstchild = this.designer.contenttree.knotviews.find(k => k.knot.parent == this.knot._id)
        return firstchild != null
    }

    getMarker(){
        if(this.hasChildren()){
            if(this.expanded){
                return 'V'
            }else{
                return '>'
            }
        }else{
            return ''
        }
    }

    getAllKnots():Promise<Knot[]>{
        return new Promise((reso,rej) => {
            getAll('knot').then(res => {
                reso(res.data)
            })
        })

        
    }

    
}