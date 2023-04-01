const express = require('express')
const {Task ,TaskFields} = require('../models/task')
const router = express.Router()

const isValidUpdate = (req, validFields)=>{
    const updates = Object.keys(req.body)
    return updates.every((update)=> validFields.includes(update))
}

router.post("/tasks", async (req, res)=>{
    try{
        const task = new Task(req.body)
        task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/tasks", async (req, res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", async (req, res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async(req, res) => {
    try{
        const body = req.body
        if(!isValidUpdate(req, TaskFields)){
            return res.status(400).send("Invalid field(s) in request")
        }

        const updates = Object.keys(req.body)

        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        
        if(!task){
            return res.status(400).send("Unable to update task")
        }

        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async(req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send("Unable to delete task with the id given")
        }
        res.send(task)
    } catch(e){
        send.status(500).send(e)
    }
})

module.exports = router
