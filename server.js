
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
        

        app.post('/api/export', function(req, res){
            let appdef = req.body.appdef
            let promises = []
            let exportresult = {}
            for(let objdef of appdef.objdefinitions){
                promises.push(db.collection(objdef.name).find({}).toArray())
            }
            Promise.all(promises).then(collections => {
                for(let i = 0; i < collections.length; i++){
                    exportresult[appdef.objdefinitions[i].name] = collections[i]
                }
                res.send(exportresult)
            })
        })

        app.post('/api/search/:object', function(req, res){
            let collection = db.collection(req.params.object)
            let query = req.body;
            if(query.filter._id){
                query.filter._id = new mongodb.ObjectID(query.filter._id)
            }
            collection.find(query.filter).sort(query.sort).skip(query.paging.skip * query.paging.limit).limit(query.paging.limit).toArray(function(err, result){
                collection.countDocuments({}).then((count) => {

                    let reffedObjectPointers = {}
                    let reffedObjectsResult = {}

                    for(let dereference of query.dereferences){
                        let set = assignifnull(reffedObjectPointers,dereference.collection,new Set())
                        let foreignkeys = result.filter(item => item[dereference.attribute]).map(item => item[dereference.attribute])
                        foreignkeys.forEach(fk => set.add(fk))
                    }

                    let promises = []
                    for(let [key,values] of Object.entries(reffedObjectPointers)){
                        let derefcollection = db.collection(key)
                        promises.push(new Promise((res,rej) => {
                            derefcollection.find({_id:{$in:Array.from(values.values()).map(fk => new mongodb.ObjectID(fk))}}).toArray((err,result2) => {
                                reffedObjectsResult[key] = result2
                                res()
                            })
                        }))
                    }

                    Promise.all(promises).then(() => {
                        for(let key of Object.keys(reffedObjectsResult)){
                            reffedObjectsResult[key] = reffedObjectsResult[key].reduce((acc,obj) => {
                                acc[obj._id] = obj
                                return acc
                            },{})
                        }
                        res.send({
                            data:result,
                            collectionSize:count,
                            prelimitsize:1,
                            reffedObjects:reffedObjectsResult,
                        });
                    })
                    // for(let dereference of query.dereferences){
                        
                        
                    //     let derefcollection = db.collection(dereference.collection)
                    //     derefcollection.find({_id:{$in:foreignkeys}}).toArray((err,result2) => {
                            
                    //     })
                    // }


                    // type Dereference = {
                    //     attribute:string
                    //     collection:string
                    //     dereferences:Dereference[]
                    // }

                    // {
                    //     persoon:set[id,id,id],
                    //     bedrijf:set[id,id,id],
                    // }

                    // {
                    //     persoon:{
                    //         id:{},
                    //         id:{},
                    //     },
                    //     bedrijf:{
                    //         id:{},
                    //         id:{},
                    //     }
                    // }

                    
                })

                
            })

            
        })
    
        app.get('/api/:object/:id', function(req, res){
            let collection = db.collection(req.params.object)
            collection.findOne({_id:new mongodb.ObjectID(req.params.id)}).then(function(doc){
                res.send(doc);
            })
        })
    
        app.post('/api/:object', function(req, res){
            let collection = db.collection(req.params.object)
    
            for(let item of req.body){
                delete item._id
                item.createdAt = Date.now()
            }
            
            collection.insertMany(req.body, function(err, result){
                if(err)res.send(err)
                else res.send({
                    status:'success',
                    insertedIds:Object.values(result.insertedIds).map(id => id.toString()),
                });
            });
        })
    
        app.put('/api/:object/:id', function(req, res){
            let collection = db.collection(req.params.object)
    
            delete req.body._id
            req.body.lastupdate = new Date().getTime()
            collection.updateOne({_id:new mongodb.ObjectID(req.params.id)}, {$set:req.body}, function(err, result){
                if(err)res.send(err);
                else res.send({status:'success'});
            })
        })
    
        app.delete('/api/:object', function(req, res){
            let collection = db.collection(req.params.object)
    
            collection.deleteMany({_id: { $in: req.body.map(id => mongodb.ObjectID(id))}}, function(err, result){
                if(err)res.send(err)
                else res.send({status:'success'});
            })
        })
        
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
