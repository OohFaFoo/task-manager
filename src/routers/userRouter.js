const express = require('express')
const {User, UserFields} = require('../models/user')
const bcrypt = require('bcryptjs')

const router = express.Router()

const isValidUpdate = (req, validFields)=>{
    const updates = Object.keys(req.body)
    return updates.every((update)=> validFields.includes(update))
}

router.post("/users", async (req, res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user)
    } catch(e){
        let msg = e
        if(e.code === 11000){
            msg = "User already exists"
        }
        res.status(400).send(msg)
    }
})

router.post('/users/login',async (req, res)=> {
    try{
        const email = req.body.email
        const password = req.body.password

        const user = await User.findByCredentials(email, password)
        res.send(user)
    } catch(e){
        res.status(400).send(e.message)
    }
})

router.get("/users", async (req, res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send(e)
    }
})

router.get("/users/:id", async (req, res)=>{
    try{
        const _id = req.params.id;
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send();
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async(req, res) => {
    try {
        if(!isValidUpdate(req, UserFields)){
            return res.status(404).send("Invalid field(s) in request.")
        }
        const updates = Object.keys(req.body)


        id = req.params.id
        const user = await User.findById(id);
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()

        if(!user){
            return res.status(404).send("Unable to update user")
        }
        res.send(user)

    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send("Unable to delete user with the id given")
        }
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }

})

module.exports = router