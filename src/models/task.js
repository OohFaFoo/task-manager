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
        },
        owner: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    } )

const TaskFields = Object.keys(Task.schema.obj)

module.exports = {
    Task,
    TaskFields
}