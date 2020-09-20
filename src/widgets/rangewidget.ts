class RangeWidget extends Widget{
    constructor(){
        super()
        this.rootElement = string2html(`<input type="range" min="0" max="1" step="0.01" />`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.valueAsNumber
    }
    set(val: any) {
        this.inputelement.valueAsNumber = val
    }
}