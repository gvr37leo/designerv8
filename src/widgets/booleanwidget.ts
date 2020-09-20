/// <reference path="widget.ts" />


class BooleanWidget extends Widget{
    constructor(){
        super()
        this.rootElement = string2html(`<input type="checkbox" />`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.checked
    }
    set(val: any) {
        this.inputelement.checked = val
    }
}