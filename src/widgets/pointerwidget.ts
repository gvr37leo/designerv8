class PointerWidget extends Widget{
    anchorelement: HTMLAnchorElement
    newbutton: HTMLButtonElement
    constructor(public attribute:Attribute, public designer:Designer){
        super()
        this.rootElement = string2html(`<span><a href="">goto</a> <select></select><span/>`)
        this.anchorelement = this.rootElement.querySelector('a')
        this.inputelement = this.rootElement.querySelector('select') as any
        // this.newbutton = this.rootElement.querySelector('button')

        // this.newbutton.addEventListener('click',() => {
        //     // create(this.designer.getObjDef(this.attribute.pointsToObject).name,{}).then(id => {
        //     //     this.set(id)
        //     //     //open detailview in modal
        //     // })
        // })
        this.inputelement.addEventListener('change',e => {
            this.anchorelement.href = `/${this.designer.getObjDef(this.attribute.pointsToObject).name}/${this.inputelement.value}`
        })
        // this.anchorelement.addEventListener()
    }
    get() {
        return this.inputelement.value
    }
    set(val: any) {
        this.anchorelement.href = `/${this.designer.getObjDef(this.attribute.pointsToObject).name}/${val}`
        this.inputelement.value = val
    }

    fillOptions(){
        var object = this.designer.getObjDef(this.attribute.pointsToObject)
        return getList(object.name,{filter:{},paging:{limit:0,skip:0,},sort:{},dereferences:[]}).then((res) => {
            this.inputelement.innerHTML = ''
            for(let item of res.data){
                let displayAttribute = this.designer.getAttribute(object.displayAttribute)
                this.inputelement.insertAdjacentHTML('beforeend',`<option value="${item._id}">${item[displayAttribute.name]}</option>`)
            }
            // this.set(val[attribute.name])
        })
    }
}