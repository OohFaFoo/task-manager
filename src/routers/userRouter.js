const express = require('express')
const bcrypt = require('bcryptjs')
const {User, UserFields} = require('../models/user')
const auth = require('../middleware/auth')


const router = express.Router()

const isValidUpdate = (req, validFields)=>{
    const updates = Object.keys(req.body)
    return updates.every((update)=> validFields.includes(update))
}

router.post("/users", async (req, res)=>{
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        //await user.save()
        res.status(201).send({user, token})
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
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch(e){
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth, async(req, res)=>{
    try{
        const currentToken = req.token
        if(!req.user){
            res.status(401).send("Invalid user")
        }
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== currentToken
        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send("Error occurred logging out: ", e)
    }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.get("/users/me", auth, async (req, res)=>{
    // the custom express middleware auth method checks that the user is who they say they are and updates 
    // the request instance with the users information; therefore we just send back the the user
    res.send(req.user)
})


router.patch('/users/me', auth, async(req, res) => {
    try {
        if(!isValidUpdate(req, UserFields)){
            return res.status(404).send("Invalid field(s) in request.")
        }
        const updates = Object.keys(req.body)

        user = req.user
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(400).send("Unable to delete user with the id given")
        // }
        await User.deleteOne(req.user._id)
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }

})

module.exports = router