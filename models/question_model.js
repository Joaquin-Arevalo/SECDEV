/*
Functions:
Task model/attributes
*/

var mongoose = require('mongoose');

var question_schema = new mongoose.Schema({
    Email: {
        type: String,
        required: true
    },
    Question_1: {
        type: String,
        required: true
    },
    Answer_1: {
        type: String,
        required: true
    },
    Question_2: {
        type: String,
        required: true
    },
    Answer_2: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('question', question_schema);
