

class Column<T>{
    renderer:(obj:T, i:number) => HTMLElement
    headerRenderers:(() => HTMLElement)[]

    constructor(headerRenderers:(() => HTMLElement)[], renderer:(obj:T, i:number) => HTMLElement){
        this.headerRenderers = headerRenderers
        this.renderer = renderer
    }
}

class Table<T>{

    rootelement: HTMLTableElement;
    head: HTMLTableSectionElement;
    body: HTMLTableSectionElement;
    headerRows:HTMLTableRowElement[] = []

    constructor(public columns:Column<T>[]){
        this.columns = columns
        this.rootelement = string2html(`
            <table class="table table-bordered table-striped">
                <thead>
                </thead>
                <tbody></tbody>
            </table>`) as HTMLTableElement
        this.head = this.rootelement.querySelector('thead')
        this.body = this.rootelement.querySelector('tbody')
        this.addHeader()
    }

    addHeader(){
        this.head.innerHTML = ''
        var rows:HTMLElement[] = []
        for(var column of this.columns){
            rows.push(document.createElement('tr'))
            this.head.insertAdjacentElement('beforeend',last(rows))
        }
        for(var column of this.columns){
            column.headerRenderers.forEach((renderer,i) => {
                var row = rows[i]
                this.appendCell(row,renderer())
            })
        }
    }

    load(objects:T[]){
        this.body.innerHTML = ''
        for(let i = 0; i < objects.length; i++){
            var object = objects[i]
            var row = document.createElement('tr')
            this.body.appendChild(row)            
            for(var column of this.columns){
                this.appendCell(row,column.renderer(object, i))
            }
        }
    }

    appendCell(row,element){
        var cell = document.createElement('td')
        row.appendChild(cell)
        cell.appendChild(element)
    }

}