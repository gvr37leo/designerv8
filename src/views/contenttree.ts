class ContentTree{

    // knots: Knot[]
    knotviews:KnotView[]
    rootElement: HTMLElement
    newbuttonElement: HTMLElement
    knotsElement: HTMLElement

    constructor(public designer:Designer){

        this.rootElement = string2html(`<div style="border:1px solid black; margin:10px; padding:10px;" >
            <div>
                <button id="newbutton">new</button>
            </div>
            <div id="knots"></div>
        </div>`)
        this.newbuttonElement = this.rootElement.querySelector('#newbutton')
        this.knotsElement = this.rootElement.querySelector('#knots')
        this.newbuttonElement.addEventListener('click',e => {

            
        })
    }
}

//contenttree side panel with create for every objdef
