function createList( data:Knot[]):Promise<{insertedIds:string[],status:string}>{
    return fetch(`/api/data`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(data)
    }).then(res => res.json())
}

async function create(data:Knot):Promise<string>{
    var res = await createList([data])
    return res[0]
}


async function get(knotid:string):Promise<Knot>{
    var res = await search(genSimpleQuery('_id',knotid))
    return res.data[0]
}

function getChildren(knotid:string):Promise<QueryResult<Knot>>{
    return search(genSimpleQuery('parent',knotid))
}

async function getAncestors(knotid:string):Promise<Knot[]>{
    return fetch(`/api/data/${knotid}/ancestors`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    }).then(res => res.json())
}

async function getDescendants(knotid:string):Promise<Knot[]>{
    return fetch(`/api/data/${knotid}/descendants`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    }).then(res => res.json())
}

function search(query:Query):Promise<QueryResult<Knot>>{
    return fetch(`/api/search/data`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(query)
    }).then(res => res.json())
}


function update(knot:Knot):Promise<any>{
    return fetch(`/api/data/${knot._id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'PUT',
        body:JSON.stringify(knot)
    })
}



function remove(knotid:string):Promise<any>{
    return removeList([knotid])
}

function removeList(knotids:string[]){
    return fetch(`/api/data`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'DELETE',
        body:JSON.stringify(knotids)
    })
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
    type:string
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