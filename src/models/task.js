const mongoose = require('mongoose')

const Task = mongoose.model("Task", 
    {  
        description:{
            type: String, 
            trim: true, 
            required:true
        }, 
        completed:{
            type: Boolean, 
            default:false
        }
    } )

const TaskFields = Object.keys(Task.schema.obj)

module.exports = {
    Task,
    TaskFields
}