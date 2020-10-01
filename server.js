
let mongodb = require('mongodb')
let express = require("express")
let bodyParser = require("body-parser")
let path = require("path")

let url = 'mongodb+srv://admin:as@cluster0.bai64.gcp.mongodb.net/database1?retryWrites=true&w=majority';
let databasename = 'company'
let app = express();
app.use(bodyParser.json());//for json encoded http body's
app.use(bodyParser.urlencoded({ extended: false }));//for route parameters
app.use(express.static('./'));

let port = 8000;
// let exampledefinition = JSON.parse(fs.readFileSync('./public/definition.json','utf8'));
start()

app.listen(port, function(){
    console.log('listening on ' + port)
})

function start(){
    const client = new mongodb.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

    client.connect().then(() => {
        console.log('connected to mongo');
        let db = client.db(databasename)
        
        app.post('/api/search/:object',async function(req, res){
            let collection = db.collection(req.params.object)
            let query = req.body;
            
            var filter = {}
            var filtertypes = {
                '>':'$gt',
                '<':'$lt',
                '=':'$eq',
                '!=':'$ne',
                'like':'$regex',
                'regex':'$regex',
            }
            for(var opt of query.filter){
                if(opt.propname == '_id'){
                    try {
                        filter[opt.propname] = {[[filtertypes[opt.type]]]:new mongodb.ObjectID(opt.value)}
                    } catch (error) {
                    }
                }else{
                    filter[opt.propname] = {[[filtertypes[opt.type]]]:opt.value}
                }
            }
            var sort = {}
            for(var opt of query.sort){
                sort[opt.propname] = opt.direction 
            }


            try {
                var result = await collection.find(filter).sort(sort).skip(query.paging.skip * query.paging.limit).limit(query.paging.limit).toArray()
                var count = await collection.countDocuments()
                res.send({
                    data:result,
                    collectionSize:count,
                    prelimitsize:1,
                });    
            } catch (error) {
                res.status(500).send(error)
            }
            

        })



                
        // type Query = {
        //     filter:Filter[]
        //     sort:QuerySort[]
        //     dereferences:Dereference[]
        //     paging:{
        //         skip:number
        //         limit:number
        //     }
        // }

        // enum FilterType{//range is done with multiple filters
        //     equal = '=',less = '<',bigger = '>',notequal = '!=',regex = 'regex',like = 'like'
        // }

        // type QuerySort = {
        //     propname:string
        //     direction:number
        // }

        // type Filter = {
        //     propname:string
        //     type:FilterType
        //     value:string
        // }
        // type Dereference = {
        //     attribute:string
        //     dereferences:Dereference[]
        // }
        // type QueryResult<T> = {
        //     data:T[]
        //     collectionSize:number
        //     prelimitsize:number
        //     reffedObjects:any[]
        // }

    
        app.post('/api/:object',async function(req, res){
            let collection = db.collection(req.params.object)
    
            for(let item of req.body){
                delete item._id
                item.createdAt = Date.now()
            }
            try {
                var result = await collection.insertMany(req.body)
                res.send(Object.values(result.insertedIds).map(id => id.toString()))
            } catch (error) {
                res.status(500).send(error)
            }
            

        })
    
        app.put('/api/:object/:id',async function(req, res){
            let collection = db.collection(req.params.object)
    
            delete req.body._id
            req.body.lastupdate = new Date().getTime()
            try {
                var result = await collection.updateOne({_id:new mongodb.ObjectID(req.params.id)}, {$set:req.body})
                res.send({status:'success'});
            } catch (error) {
                res.status(500).send(error)
            }
        })


        //todo delete children
        // https://stackoverflow.com/questions/50767930/mongodb-graphlookup-get-children-all-levels-deep-nested-result


        app.delete('/api/:object',async function(req, res){

            let collection = db.collection(req.params.object)
            try {
                for(var knotid of req.body){
                    var descendants = await findDescendants(knotid)
                    await collection.deleteMany({_id: { $in: descendants.map(knot => mongodb.ObjectID(knot._id))}})
                }
                var result = await collection.deleteMany({_id: { $in: req.body.map(id => mongodb.ObjectID(id))}})
                
                res.send({status:'success'});
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get('/api/:object/:id/ancestors',async function(req, res){
            try {
                var ancestors = await findAncestors(req.params.id)
                res.send(ancestors);
            } catch (error) {
                res.status(500).send(error)
            }
        })

        app.get('/api/:object/:id/descendants',async function(req, res){
            try {
                var descendants = await findDescendants(req.params.id)
                res.send(descendants);
            } catch (error) {
                res.status(500).send(error)
            }
        })

        async function findAncestors(knot){
            var res = []
            var parent = findParent(knot)
            while(parent != null){
                res.push(parent)
                parent = await findParent(parent)
            }
            return res
        }

        async function findParent(knot){
            var res = await db.collection('data').findOne({_id:knot.parent})
            return res
        }

        async function findKnot(knotid){
            return await db.collection('data').findOne({_id:new mongodb.ObjectID(knotid)})
        }

        async function findDescendants(knotid){
            var children = await findChildren(knotid)
            var res = children.slice()

            for(var child of children){
                var childsdescendants = await findDescendants(child._id.toString())
                res = res.concat(childsdescendants)
            }
            return res
        }

        async function findChildren(knotid){
            var res = await db.collection('data').find({parent:knotid}).toArray()
            return res
        }

        
        app.get('/*', function(req, res, next) {
            res.sendFile(path.resolve('index.html'));
        });





    },(reason) => {
        console.log(reason)
        console.log('error connecting to mongodb retrying in 5 seconds')
        
        setTimeout(start,5000)
    })

}

function assignifnull(object,propertyname,value){
    if(object[propertyname] == null){
        object[propertyname] = value
        return value
    }else{
        return object[propertyname]
    }
}
