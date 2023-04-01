const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// create the schema
const userSchema = new mongoose.Schema( {
    name: {
        type: String
    }, 
    password:{
        type: String,   
        trim: true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannont contain the word 'password'")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    age:{
        type: Number
    }
})

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})
        if(!user){
            throw new Error("Invalid login credentials")
        }
        
        const isValidLogin = await bcrypt.compare(password, user.password)
        if(!isValidLogin){
            throw new Error("Invalid login credentials")
        }
        return user
}

// all schema pre/post proessing must be defined before the schema is added to the model
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

// create the schema and add the schema into it
const User = mongoose.model("User", userSchema)

// contains the list of fields in the schema
const UserFields = Object.keys(User.schema.obj)

module.exports = { 
    User,
    UserFields,
}