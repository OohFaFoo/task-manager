const express = require('express')
const mongoose = require('mongoose')
const {Task ,TaskFields} = require('../models/task')
const router = express.Router()

// each call has middleware preprocessing to ensure the user is authorised via auth,
// in doing so the user object is populated from the database when the user is valid 
const auth = require('../middleware/auth') 

const isValidUpdate = (req, validFields)=>{
    const updates = Object.keys(req.body)
    return updates.every((update)=> validFields.includes(update))
}

router.post("/tasks", auth, async (req, res)=>{
    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res)=>{
    try{
        const match = {}

        //const tasks = await Task.find({owner: req.user._id})
        // or
        if(req.query.completed!== undefined){
            match["completed"] = req.query.completed === 'true'
        }

        const sort = {}
        if(req.query.sortBy !== undefined){
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }

        const user = await req.user.populate({
            path:"tasks",
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.send(user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", auth, async (req, res)=>{
    try{
        const _id = req.params.id
        
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        await task.populate("owner")
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    try{
        const body = req.body
        if(!isValidUpdate(req, TaskFields)){
            return res.status(400).send("Invalid field(s) in request")
        }

        const updates = Object.keys(req.body)

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(400).send("Unable to delete task with id provided")
        }
        res.send(task)
    } catch(e){
        send.status(500).send(e)
    }
})

module.exports = router
