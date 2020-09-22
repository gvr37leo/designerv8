function create(knot:Knot):Promise<string>{
    return null
}

function search(query:Query):Promise<Knot[]>{
    return null
}

async function get(knotid:string):Promise<Knot>{
    var res = await search(genSimpleQuery('_id',knotid))
    return res[0]
}

function getChildren(knotid:string):Promise<any[]>{
    return search(genSimpleQuery('parent',knotid))
}

function remove(knotid:string):Promise<any>{
    return null
}

function genSimpleQuery(prop:string,value:any):Query{
    return {
        filter:[{
            propname:prop,
            type:FilterType.equal,
            value:value,
        }],
        sort:[{
            propname:'createdAt',
            direction:-1,
        }],
        paging:{
            skip:0,
            limit:0,
        },
        dereferences:[]
    }
}

type Query = {
    filter:Filter[]
    sort:QuerySort[]
    dereferences:Dereference[]
    paging:{
        skip:number
        limit:number
    }
}

enum FilterType{//range is done with multiple filters
    equal = '=',less = '<',bigger = '>',notequal = '!=',regex = 'regex',like = 'like'
}

type QuerySort = {
    propname:string
    direction:number
}

type Filter = {
    propname:string
    type:FilterType
    value:string
}

type Dereference = {
    attribute:string
    collection:string
    dereferences:Dereference[]
}

type QueryResult<T> = {
    data:T[]
    collectionSize:number
    prelimitsize:number
    reffedObjects:any[]
}