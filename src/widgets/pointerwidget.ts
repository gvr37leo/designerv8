class PointerWidget extends Widget{
    anchorelement: HTMLAnchorElement
    newbutton: HTMLButtonElement
    selectelement: HTMLSelectElement
    // value:string

    constructor(public attribute:Attribute, public designer:Designer){
        super()
        this.rootElement = string2html(`<span><a href="">goto</a> <select></select><input/><span/>`)
        this.anchorelement = this.rootElement.querySelector('a')
        this.inputelement = this.rootElement.querySelector('input') as HTMLInputElement
        this.selectelement = this.rootElement.querySelector('select') as HTMLSelectElement
        this.selectelement.addEventListener('change', e => {
            this.inputelement.value = this.selectelement.value
            this.anchorelement.href = `/data/${this.inputelement.value}`
        })

        this.inputelement.addEventListener('change',e => {
            this.anchorelement.href = `/data/${this.inputelement.value}`
        })
        this.anchorelement.addEventListener('click', e => {
            e.preventDefault()
            this.designer.navigateToKnot(this.inputelement.value)
        })

        
        //gaat nu fout omdat hier gezocht wordt in de database terwijl data hardcoded is
        //misschien een toggle om te kunnen switchen
        //of gewoon ook in desigmetadataknots kijken
        //of point naar de database id
        search(genSimpleQuery('parent',this.attribute.selectKnot)).then(res => {
            for(var item of res.data){
                this.selectelement.appendChild(string2html(`<option value="${item._id}">${item.name}</option>`))
            }
        })
        
        // this.anchorelement.addEventListener()
    }

    get() {
       return this.inputelement.value
    }

    set(val: any) {
        // this.value = val
        this.anchorelement.href = `/data/${val}`
        this.inputelement.value = val
        this.selectelement.value = val
    }

}