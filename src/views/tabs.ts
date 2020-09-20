class Tabs{

    rootelement:HTMLElement
    tabs:Map<string,HTMLElement> = new Map()
    tabbuttons: HTMLElement
    tabcontainer: HTMLElement
    listviews: Map<string,ListView> = new Map()
    currentprimarykey:string


    constructor(public designer:Designer,public backrefsAttributes:Attribute[]){
        
        this.rootelement = string2html(`<div style="margin-top:10px; padding:10px; border:1px solid black;">
            <div id="tabbuttons"></div>
            <div id="tabcontainer" style="padding:10px; border:1px solid black; margin:10px 0 0 0;"></div>
        </div>`)
        this.tabbuttons = this.rootelement.querySelector('#tabbuttons')
        this.tabcontainer = this.rootelement.querySelector('#tabcontainer')



        for(let attribute of this.backrefsAttributes){
            let backrefobject = this.designer.getObjDef(attribute.belongsToObject)
            let name = `${backrefobject.name}-${attribute.name}`
            let button = string2html(`<button style="margin-right:10px;">${name}</button>`)
            this.tabbuttons.appendChild(button)
            let listview = new ListView(designer,backrefobject)
            this.listviews.set(attribute._id,listview)
            

            listview.newbuttonelment.removeEventListener('click',listview.newbuttononclick)
            listview.newbuttonelment.addEventListener('click',() => {
                let obj = {}
                obj[attribute.name] = this.currentprimarykey
                create(backrefobject.name,obj).then(id => {
                    this.designer.router.navigate(`/${backrefobject.name}/${id}`)
                })
            })

            button.addEventListener('click',e => {
                this.loadView(listview)
            })
        }
        var listview = Array.from(this.listviews.values())[0]
        if(listview){
            this.loadView(listview)
        }
    }

    mount(primarykey:string){
        this.currentprimarykey = primarykey

        for(let attribute of this.backrefsAttributes){
            var listview = this.listviews.get(attribute._id)
            
            let query = listview.getQuery()
            query.filter[attribute.name] = this.currentprimarykey
            listview.setQueryAndReload2(query)
        }
    }

    loadView(listview:ListView){
        emptyhtml(this.tabcontainer)
        this.tabcontainer.appendChild(listview.rootelement)
    }
}
