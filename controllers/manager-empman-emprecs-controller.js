/*
Functions:
-Display the admin-empman-emprecs.hbs (Admin: Employee Management - Employee Information Page)
-Populate the page with the corresponding employee details
*/

const employee = require('../models/employee_model.js');
const database = require('../models/database.js');

const manager_empman_emprecs_controller = {
    get_emprecs: async function(req, res){
        const emp_emails = await database.findMany(employee, {$or: [{Employee_Type: "Employee"},{Employee_Type: "Work From Home"},{Employee_Type: "Admin"},{Employee_Type: "Manager"}]});

        emp_emails.sort((a, b) => {
            const emailA = (a.Email || '').toLowerCase();
            const emailB = (b.Email || '').toLowerCase();
            
            return emailA.localeCompare(emailB);
        });

    try{
        res.render("manager-empman-emprecs", {emp_emails, LCF: req.session.LCF});
    }catch (error){
        console.error("Error processing employee summary: ", error);
        res.status(500).send("Internal Server Error!");
    }
},

    post_specific_emprecs: async function(req, res){
        const emp_emails = await database.findMany(employee, {$or: [{Employee_Type: "Employee"},{Employee_Type: "Work From Home"},{Employee_Type: "Admin"},{Employee_Type: "Manager"}]});
        const email = req.body.email;
    
        emp_emails.sort((a, b) => {
            const emailA = (a.Email || '').toLowerCase();
            const emailB = (b.Email || '').toLowerCase();
            
            return emailA.localeCompare(emailB);
        });

        try {
            const emp_sum = await employee.findOne({ Email: email });
    
            res.render("manager-empman-emprecs", { emp_emails, emp_sum , LCF: req.session.LCF});
        } catch (error) {
            console.error("Error processing employee summary: ", error);
            res.status(500).send("Internal Server Error!");
        }
    }
}

module.exports = manager_empman_emprecs_controller;