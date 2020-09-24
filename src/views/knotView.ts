class KnotView{

    expanded = false
    selected = false
    rootelement:HTMLElement
    arrowelement:HTMLElement
    nameelement:HTMLElement
    childrenelement:HTMLElement
    namearrowelement: HTMLElement
    childrenLoaded = false

    constructor(public designer:Designer,public knot:Knot){
        
        
    }

    set(knot:Knot){
        this.knot = knot
        this.arrowelement.innerText = this.getMarker()
        this.nameelement.innerText = this.knot.name
    }

    init(){
        this.rootelement = string2html(`
            <div>
                <div style="display:flex;" id="namearrow">
                    <button id="arrow" style="flex-grow:0; cursor:pointer; width:28px;">arrow</button>
                    <div id="name" style="flex-grow:1;" >name</div>
                </div>
                <div id="children" style="display:none; margin-left:20px;"></div>
            </div>
        `)

        this.arrowelement = this.rootelement.querySelector('#arrow')
        this.nameelement = this.rootelement.querySelector('#name')
        this.namearrowelement = this.rootelement.querySelector('#namearrow')
        this.childrenelement = this.rootelement.querySelector('#children')

        this.set(this.knot)

        this.arrowelement.addEventListener('click', e => {
            this.toggle()
            this.designer.eventQueue.trigger(EventTypes.knotArrowClicked,{knotid:this.knot._id})
        })

        this.nameelement.addEventListener('click', e => {
            this.designer.eventQueue.trigger(EventTypes.knotNameClicked,{knotid:this.knot._id})
        })
        
        return this
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
    
    hasChildren(){
        return true
    }
}