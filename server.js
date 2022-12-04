const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Student = require('./models/students')
const dateFormatter = require('date-format-conversion')
const getAge = require('get-age')

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/StudentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', (err)=>console.log(err))
db.once('open',()=>console.log("Connected to database."))

app.set('view engine','ejs')
app.use(express.urlencoded({ extended : false }))

app.get('/', (req,res)=>{
    res.render('menu')
})

//CREATE

app.get('/create', (req,res)=>{
    res.render('create', { done : false })
})

app.post('/create', async (req,res)=>{
    try{
        const dob = req.body.dob
        const age = getAge(dateFormatter(dob,'yyyy-MM-dd'))
        await Student.create({
            studentName: req.body.name,
            studentID: req.body.id,
            gender: req.body.gender,
            dateOfBirth: req.body.dob,
            age: age,
            grade: req.body.grade,
            email: req.body.email
        })
        const done = true
        res.render('create',{ done : done})
    } catch(err){
        res.send("Unable to process request")
        console.log(err)
    }
})

var links = ['/read','/update','/delete']

//READ

app.get(links, async (req,res)=>{
    const students = await Student.find()
    res.render('read', { students : students, done : false })
})

//UPDATE#

app.get('/update/:id', async (req,res)=>{
    let student = await Student.findById(req.params.id)
    //student.dateOfBirth = await dateFormatter(student.dateOfBirth, 'dd-MM-yyyy')
    const newDate = await dateFormatter(student.dateOfBirth, 'dd-MM-yyyy')
    res.render('update', { student : student , newDate : newDate})
})

app.post('/update/:id', async (req,res)=>{
    try{
        let student = await Student.findById(req.params.id)

        const dob = req.body.dob
        const age = getAge(dateFormatter(dob,'yyyy-MM-dd'))
        student.studentName = req.body.name
        student.studentID = req.body.id
        student.gender = req.body.gender
        student.dateOfBirth = req.body.dob
        student.age = age
        student.grade = req.body.grade
        student.email = req.body.email

        await student.save()

        const students = await Student.find()
        res.render('read', { students : students, done : true })
    } catch(err) {
        res.send("Unable to process request")
        console.log(err)
    }
})

//DELETE

app.get('/delete/:id', async (req,res)=>{
    await Student.findByIdAndDelete(req.params.id)
    res.redirect('/read')
})

app.listen(process.env.PORT || 2000, ()=>console.log("Server started."))