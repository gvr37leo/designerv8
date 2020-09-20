

abstract class Widget{
    inputelement:HTMLInputElement
    rootElement:HTMLElement
    definition:Attribute

    abstract get():any
    abstract set(val:any)
}