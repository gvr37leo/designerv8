class IdWidget extends Widget{
    value = ""

    constructor(public attribute:Attribute, public designer:Designer){
        super()
        
        this.rootElement = string2html(`<a/>`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.value
    }
    set(val: any) {
        var rootElement = this.rootElement as HTMLAnchorElement
        this.value = val
        rootElement.href = `/data/${val}`
        rootElement.innerText = val
    }
}