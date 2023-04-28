const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
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
    }, { 
        timestamps: true
    }
)

const Task = mongoose.model("Task", taskSchema)

const TaskFields = Object.keys(Task.schema.obj)

module.exports = {
    Task,
    TaskFields
}