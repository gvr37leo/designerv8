class KnotView{

    expanded = false
    selected = false
    rootelement:HTMLElement
    arrowelement:HTMLElement
    nameelement:HTMLElement
    childrenelement:HTMLElement
    childrenLoaded = false

    constructor(public designer:Designer,public knot:Knot){
        
        
    }

    init(){
        this.rootelement = string2html(`
            <div>
                <div style="display:flex;">
                    <div id="arrow" style="flex-grow:0; width:10px; cursor:pointer">arrow</div>
                    <div id="name" style="flex-grow:1;" >name</div>
                </div>
                <div id="children" style="display:none; margin-left:20px;"></div>
            </div>
        `)

        this.arrowelement = this.rootelement.querySelector('#arrow')
        this.nameelement = this.rootelement.querySelector('#name')
        this.childrenelement = this.rootelement.querySelector('#children')

        this.arrowelement.innerText = this.getMarker()
        this.nameelement.innerText = this.knot.name

        this.arrowelement.addEventListener('click', e => {
            this.toggle()
        })

        this.nameelement.addEventListener('click', e => {
            this.designer.eventQueue.trigger(EventTypes.knotClicked,{knotid:this.knot._id})
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