/// <reference path="../widgets/booleanwidget.ts" />
/// <reference path="../widgets/datewidget.ts" />
/// <reference path="../widgets/idwidget.ts" />
/// <reference path="../widgets/numberwidget.ts" />
/// <reference path="../widgets/rangewidget.ts" />
/// <reference path="../widgets/textwidget.ts" />
/// <reference path="../widgets/pointerwidget.ts" />
/// <reference path="../widgets/widget.ts" />
/// <reference path="tabs.ts" />



class DetailView{

    widgetMap:Map<string,Widget> = new Map<string,Widget>()
    tabs:Tabs
    attributes: Attribute[]
    backrefs: Attribute[]
    // onMountFinished: EventSystem<unknown>
    
    rootelement:HTMLElement
    duplicatebuttonElement: HTMLElement
    savebuttonElement: HTMLElement
    deletebuttonElement: HTMLElement
    upbuttonElement: HTMLElement
    widgetcontainer: HTMLElement
    tabscontainer: HTMLElement

    constructor(public designer:Designer,public objdef:ObjDef){

        
        //(duplicate)
        //save
        //delete
        //up

        //create widgets for attributes
        //create tabs
        //fill tabs with tables
        // this.onMountFinished = new EventSystem()
        // var idattribute = this.designer.definition.attributes.find(a => a.belongsToObject == this.definition._id && a.dataType==DataType.id && a.name == "_id")
        this.rootelement = string2html(`
            <div>
                <h1>${objdef.name}</h1>

                <div style="margin:10px;">
                    <button id="duplicatebutton">duplicate</button>
                    <button id="savebutton">save</button>
                    <button id="deletebutton">delete</button>
                </div>
                <div id="widgetcontainer" style="display:flex; flex-direction:column;"></div>
                <div id="tabscontainer"></div>
            </div>
        `)

        this.duplicatebuttonElement = this.rootelement.querySelector('#duplicatebutton')
        this.savebuttonElement = this.rootelement.querySelector('#savebutton')
        this.deletebuttonElement = this.rootelement.querySelector('#deletebutton')
        this.upbuttonElement = this.rootelement.querySelector('#upbutton')
        this.widgetcontainer = this.rootelement.querySelector('#widgetcontainer')
        this.tabscontainer = this.rootelement.querySelector('#tabscontainer')

        this.duplicatebuttonElement.addEventListener('click',() => {
            //duplicate everything except for _id and createdAt
            create(this.collectData()).then(res => {
                this.designer.navigateToKnot(res)
            })
            //just straight up collect the data from view and sent it to create
        })
        this.savebuttonElement.addEventListener('click',async () => {
            this.save()
            //get data from view and send it to update
        })
        this.deletebuttonElement.addEventListener('click',async () => {
            var data = this.collectData()
            await remove(data._id)
            this.designer.navigateToKnot(data.parent)
            this.designer.contentTree.remove(data)
            this.designer.contentTree.loadChildren(data.parent)
            this.designer.contentTree.setSelectedKnot(data.parent)
            
        })

        this.attributes = this.designer.getAttributes(objdef._id)
        for(var attribute of this.attributes){
            var widget:Widget = this.designer.createWidget(attribute,designer)
            this.widgetMap.set(attribute._id,widget)
            var widgethull = string2html(`
                <div>
                    <label>
                        ${attribute.name}
                        <div id="widgetspot"/>
                    </label>
                </div>
            `)
            widgethull.querySelector('#widgetspot').appendChild(widget.rootElement)
            this.widgetcontainer.appendChild(widgethull)
        }
        var listview = new ListView(this.designer,objdef)
        this.tabscontainer.appendChild(listview.rootelement)
    }

    async save(){
        var data = this.collectData()
        await update(data)
        this.designer.contentTree.loadChildren(data.parent)
    }

    loadData(data:any){
        var attributes = this.designer.getAttributes(this.objdef._id)
        for(var attribute of attributes){
            this.setAttributeData(attribute._id,data[this.designer.getAttributeNameProp(attribute)])
        }
    }

    collectData():Knot{
        var res:any = {}
        var attributes = this.designer.getAttributes(this.objdef._id)
        for(var attribute of attributes){
            res[this.designer.getAttributeNameProp(attribute)] = this.getAttributeData(attribute._id)
        }
        return res
    }
    

    getAttributeData(attributeid:string):any{
        return this.widgetMap.get(attributeid).get()
    }

    setAttributeData(attributeid:string,data:any){
        this.widgetMap.get(attributeid).set(data)
    }
}