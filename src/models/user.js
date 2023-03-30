const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model("User", 
    {
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
            type: String
        }
    }
)

module.exports = User