
const payroll = require('../models/payroll_model.js');
const employee = require('../models/employee_model.js');
const database = require('../models/database.js');

const employee_salary_particulars_controllers = {
    get_salary_particulars: async function (req, res){
        employee_email = req.session.Email;
        try{
            const emp_rec = await database.findOne(employee, {Email: employee_email});
            res.render("employee-salaryParticulars", {email: req.session.Email, emp_type: req.session.Employee_type, ETI_weekdayIndex: req.session.ETI_weekdayIndex, emp_rec});
        }catch (err){
            console.error("Error processing employee details: ", err);
            res.status(500).send("Internal Server Error!");
        }
    },
}

 module.exports = employee_salary_particulars_controllers;