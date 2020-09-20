class TextWidget extends Widget{
    
    constructor(){
        super()
        this.rootElement = string2html(`<input type="text" />`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.value
    }
    set(val: any) {
        this.inputelement.value = val
    }
}