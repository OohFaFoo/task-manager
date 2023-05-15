const request = require('supertest')
const {User} = require("../src/models/user")
const app = require('../src/app')
const {userOne, userOneId, setupDatabase} = require("./fixtures/db")

beforeEach(setupDatabase)

test("should sign up a new user", async()=>{
    const response = await request(app).post('/users/').send({
        name:"alan",
        email: "alanmstrong@hotmail.com",
        password: "12345Abcde"
    }).expect(201)
})

test("should login", async()=>{     
   const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById({_id: userOne._id})
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("should not login", async()=>{
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password + 1
    }).expect(400)
})

test("get my profile", async() => {
    await request(app)
        .get('/users/me')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("delete my account", async() =>{
    await request(app)
        .delete('/users/me')
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById({_id: userOneId})
    expect(user).toBeNull()
})

test("delete my account to fail", async() =>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test("upload avatar test", async() =>{
    const response = await request(app)
        .post("/users/me/avatar")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("update valid field", async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({name: "trevor"})
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("trevor")
})

test("update invalid field not allowed", async()=>{
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({location: "claddaghduff"})
        .expect(404)
})



