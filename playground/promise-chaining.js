require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('642350288de94a38be8a0df4', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 60 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async(id, age) =>{
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('642350288de94a38be8a0df4',16).then((count) => {
    console.log(count)
}).catch((e)=>{
    console.log(e)
})