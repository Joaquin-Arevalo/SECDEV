/*
Functions:
Task model/attributes
*/

var mongoose = require('mongoose');

var task_schema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Employee_Type: { // not sure
        type: String,
        default: 'Employee'
    },
    Task_Name: {
        type: String,
        required: true
    },
    Task_Description: {
        type: String,
        required: true
    },
    Task_isCompleted: {
        type: Boolean,
        default: false
    },
    Task_isDeleted: { // not sure
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('task', task_schema);
