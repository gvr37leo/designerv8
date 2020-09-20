class DateWidget extends Widget{
    constructor(){
        super()
        this.rootElement = string2html(`<input type="date" />`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.valueAsNumber
    }
    set(val: any) {
        this.inputelement.valueAsNumber = val
    }
}