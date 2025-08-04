/*
Functions:
-Display the register.hbs (Admin: Add Employee Page)
-Create new employee and weekly payroll
*/

const employee = require('../models/employee_model.js');
const question = require('../models/question_model.js');
const bcrypt = require('bcrypt');


const change_controller = {
    get_question: async function(req, res){
        const email = req.session.Email;

        try {
            const employeeData = await employee.findOne({ Email: email });
            const questionData = await question.findOne({ Email: email });

            if (!employeeData || !questionData) {
                return res.status(404).send("Server Error.");
            }

            res.render('change', {employeeData, questionData, LCF: req.session.LCF, empType: req.session.Employee_Type});
        } catch (error) {
            console.error("Error in get_question:", error);
            res.status(500).send("Server error.");
        }
    },


    post_change: async function(req, res){
        const {A1, A2, CP, NP, NP2} = req.body;
        const email = req.session.Email
        
        try{
            const user_exists = await employee.findOne({Email: email});
            const user_exists_q = await question.findOne({Email: email});

            const now = new Date();
            const passwordAge = new Date(user_exists.Password_Age);
            const diffInMs = now - passwordAge;
            const oneDayInMs = 24 * 60 * 60 * 1000;

            if (diffInMs < oneDayInMs) {
                return res.status(403).json({ message: "Password was changed less than a day ago." });
            }

            const isMatchCP = await bcrypt.compare(CP, user_exists.Password);
            const isMatchA1 = await bcrypt.compare(A1, user_exists_q.Answer_1);
            const isMatchA2 = await bcrypt.compare(A2, user_exists_q.Answer_2);

            if(!isMatchCP || !isMatchA1 || !isMatchA2){
                return res.status(404).json({message: "Incorrect Credentials! 1"});
            }

            if(NP !== NP2){
                return res.status(404).json({message: "Incorrect Credentials! 2"});
            }

            const saltRounds = 10;
            const hashedNP = await bcrypt.hash(NP, saltRounds);

            user_exists.Password = hashedNP;
            user_exists.Password_Age = now;
            await user_exists.save();

            res.json({success: true, message: "Action Successful!"});
        }catch(error){
            console.error(error);
            res.status(500).json({success: false, message: "Server Error!"});
        }
    }
} 

module.exports = change_controller;

