const {MongoClient, ObjectId} = require('mongodb-legacy')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const testMongo = async()=>{
//     const client = new MongoClient(connectionURL);
//     await client.connect();

//     const db = client.db(databaseName)
    
//     db.collection("user").insertOne({name:"Alan",age:21});
// }

// testMongo()

// const id = new ObjectId();
// console.log("id: " + id)
// console.log("timestamp: " + id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser:true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database: ' + error);
    }

    console.log("connected")
    const db = client.db(databaseName)
    const tasksColl = db.collection("tasks")
    const usersColl = db.collection("user")

    // usersColl.insertOne({
    //     name: 'jasper',
    //     age: 10
    // },(error, res)=>{
    //     console.log(error)
    //     console.log(res)
    // })

    // const tasks = [{description:"wash car", completed:false},{description:"make scones", completed:false},{description:"have shower", completed:true}]
    // db.collection("tasks").insertMany(tasks, (error, result)=>{
    //     if(error){
    //         return console.log("error occurred: " + error)
    //     }
    //     console.log(result.insertedIds) 
    // })
    // const searchId = new ObjectId("64220c1a458cb38d6d6c6b70")
    // db.collection("user").findOne({_id:searchId}, (error, result)=>{
    //     console.log(result);
    // })  
    
    // const searchId = new ObjectId("6422a728cf5df7bbd6a81fa1")
    // db.collection("tasks").findOne({_id: searchId }, (error, task)=>{
    //     console.log(task);
    // })    
    // db.collection("tasks").find({completed: false}).toArray((error, tasks)=>{
    //     console.log(tasks);
    // })   
    // tasksColl.updateMany({completed: false},{$set:{completed:true}}, ).then((response)=>{
    //     console.log(response)
    // }).catch((error)=>{
    //     console.log(error)
    // })
    // usersColl.deleteMany({age:70}).then((response)=>{
    //     console.log(response)
    // }).catch((e)=>{
    //     console.log(e)
    // })
    // usersColl.deleteOne({age:10}).then((response)=>{
    //     console.log(response)
    // }).catch((e)=>{
    //     console.log(e)
    // })
})

// console.log(prom)
console.log("end")