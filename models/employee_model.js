/*
Functions:
Employee model/attributes
*/

var mongoose = require('mongoose');

var employee_schema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    Contact_Number: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    },
    Employee_Type: {
        type: String,
        default: 'Employee'
    },
    IsTimedIn: {
        type: Boolean,
        default: false
    },
    FailedAttempts: { 
        type: Number, 
        default: 0 
    },
    LockUntil: { 
        type: Date, 
        default: null 
    }

    },
    Password_Age: {
        type: Date,
        default: Date.now
    },
    Last_Successful_Login: {
        type: Date
    },
    Security_Questions: {
        type: Boolean,
        default: false
    },
    Last_Password_Change: {
        type: Date
    },
});

module.exports = mongoose.model('employee', employee_schema);
