const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    try{
        sgMail.send({
            to: email,
            from: "alanmstrong@hotmail.com",
            subject: "Welcome to the Task App",
            text: `Wecome ${name} to the Task App. You'll make a lota friends and have a lota fun!`
        })
    }catch(e){
        console.log(e)
    }
}

const sendCancellationEmail = (email, name)=>{
    try{
        sgMail.send({
            to: email,
            from: "alanmstrong@hotmail.com",
            subject: "Subscription cancelled",
            text: `${name} we are sorry to see you go. We'd hoped you'd make a lota friends and have a lota fun!`
        })
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}