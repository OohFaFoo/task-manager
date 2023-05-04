const express = require('express')
const bcrypt = require('bcryptjs')
const multer = require("multer")
const sharp = require('sharp')
const {User, UserFields} = require('../models/user')
const auth = require('../middleware/auth')
const mail = require('../emails/account')

const upload = multer({
    limits: { fileSize: 1000000},
    fileFilter(req, file, cb){
        if(!file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload a jpg, jpeg or png'))
        }
        cb(undefined,true)
    }
})

const router = express.Router()

const isValidUpdate = (req, validFields)=>{
    const updates = Object.keys(req.body)
    return updates.every((update)=> validFields.includes(update))
}

router.post("/users", async (req, res)=>{
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        mail.sendWelcomeEmail(user.email, user.name)

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
        const email = req.user.email
        const name = req.user.name
        await req.user.deleteOne()// all user tasks are removed by the middleware
        mail.sendCancellationEmail(email, name)
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req,res)=>{
    try{
        if(req.user !== undefined){
            req.user.avatar = undefined;
            await req.user.save()
            res.send(req.user)
        } else {
            res.status(400).send({error: "invalid user"})
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router