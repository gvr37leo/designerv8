class PointerWidget extends Widget{
    anchorelement: HTMLAnchorElement
    newbutton: HTMLButtonElement
    value:string

    constructor(public attribute:Attribute, public designer:Designer){
        super()
        this.rootElement = string2html(`<span><a href="">goto</a> <select></select><span/>`)
        this.anchorelement = this.rootElement.querySelector('a')
        this.inputelement = this.rootElement.querySelector('select') as any
        this.inputelement.addEventListener('change',e => {
            this.anchorelement.href = `/data/${this.inputelement.value}`
        })
        this.anchorelement.addEventListener('click', e => {
            e.preventDefault()
            this.designer.navigateToKnot(this.value)
        })
        // this.anchorelement.addEventListener()
    }

    get() {
       return this.value
    }

    set(val: any) {
        this.value = val
        this.anchorelement.href = `/data/${val}`
        this.inputelement.value = val
    }

}