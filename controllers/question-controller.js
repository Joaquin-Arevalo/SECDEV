/*
Functions:
-Display the register.hbs (Admin: Add Employee Page)
-Create new employee and weekly payroll
*/

const employee = require('../models/employee_model.js');
const question = require('../models/question_model.js');
const bcrypt = require('bcrypt');


const question_controller = {
    get_question: function(req, res){
        res.render('question');
    }, 

    post_question: async function(req, res){
        const {questionOne, answerOne, questionTwo, answerTwo} = req.body;
        const email = req.session.Email
        
        try{
            const user_exists = await employee.findOne({Email: email});

            const saltRounds = 10;
            const hashedAnsOne = await bcrypt.hash(answerOne, saltRounds);
            const hashedAnsTwo = await bcrypt.hash(answerTwo, saltRounds);

            const new_question = new question({
                Email: email,
                Question_1: questionOne,
                Answer_1: hashedAnsOne,
                Question_2: questionTwo,
                Answer_2: hashedAnsTwo,
            });
            await new_question.save();

            user_exists.Security_Questions = true;
            await user_exists.save();
            req.session.Security_Question = user_exists.Security_Questions;

            res.json({success: true, message: "Action Successful!"});
        }catch(error){
            console.error(error);
            res.status(500).json({success: false, message: "Server Error!"});
        }
    }
} 

module.exports = question_controller;

