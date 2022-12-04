const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    studentName: {type: String, required: true},
    studentID: {type: Number, required: true},
    gender: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    age: {type: Number, required: true},
    grade: {type: Number, required: true, min: 1, max: 12},
    email: {type: String, required: true}
})

const studentModel = mongoose.model('Students', studentSchema)

module.exports = studentModel