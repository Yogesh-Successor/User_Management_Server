const express = require('express')
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://guvimern:yogeshmern@cluster0.4tjmfgg.mongodb.net/')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    dob: String,
    contact : Number,
    age: Number
})

const UserModel = mongoose.model("users", UserSchema)



app.get('/', (req, res)=>{
    res.end("Login connected")
})
let tempUser;
app.post("/",async(req, res)=>{
        const {email, password} = req.body
        const checkUser = UserModel.findOne({email : email})
        .then((user)=>{
            if(user){
                if(user.password === password){
                    tempUser = user
                    console.log("User logged in successfully")
                    res.json({status: "Success", id: user._id})
                }
                else{
                    console.log("Password was wrong")
                    res.json('Wrong')
                }
            }
            else{
                console.log("Username was not matching")
                res.json('NA')
            }
        })
    })
app.post("/home/:id", (req,res)=>{
    const userId = req.body.id;
    UserModel.findOne({_id: userId})
    .then(user =>{
        res.json(user)
    })
    .catch(err =>{
        console.log('Error occured while accesing user profile', err)
    })
})
app.put("/update/:id", (req,res)=>{
    const userId = req.body.id
     UserModel.findByIdAndUpdate({_id: userId}, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        dob: req.body.dob,
        contact: req.body.contact
    })
    .then((updatedData)=>{
        res.json({data: updatedData, status: 'Success'})

    })
    .catch(err =>{
        console.log("Error occured while updating user info", err)
    }) 
})

app.post("/signup",async(req,res)=>{
  const data = {
    name : req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }

  UserModel.findOne({email: req.body.email})
  .then((userData)=>{
    if(userData == null){
        UserModel.insertMany([data])
        .then(()=>{
            console.log(`User ${req.body.email} is created`)
            res.json('Success')
        })
        .catch((err)=>{
            console.log(err)
            res.json('Error')
        })
    }
    else{
        console.log(`${req.body.email} already exists`);
        res.json('Exists')
    }
})
  .catch((err)=>{
    console.log(err)
  })
})
app.listen(8000, ()=>{
    console.log("Server is running")
})