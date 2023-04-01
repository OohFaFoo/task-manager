require('../src/db/mongoose')
const Task = require('../src/models/task')
const id = "642342da22b09be0472fee9b"

// Task.findByIdAndDelete(id).then((task)=>{
//     if(!task){
//         throw new Error("Unable to find Task for _id: " + id)  
//     } 
//     return Task.countDocuments({completed:false})
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async(id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})

    return count
}

deleteTaskAndCount("642342e4c99c2982fcbbbf42").then((count) => {
    console.log(count)
}).catch((e)=>{
    console.log(e)
})