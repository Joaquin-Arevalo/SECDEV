/*
Functions:
-Display the register.hbs (Admin: Add Employee Page)
-Create new employee and weekly payroll
*/

// const employee = require('../models/employee_model.js');
const task = require('../models/task_model.js');

const register_controller = {
    get_task: function(req, res){
        res.render('register');
    }, 

    post_register: async function(req, res){
        const {firstName, lastName, address, contactNumber, email, password, employee_type} = req.body;

        const user_exists = await employee.findOne({Email: email});
        if(user_exists){
            return res.status(400).json({message: "Email Already Exists!"});
        }else if(!password){
            return res.status(400).json({message: "Missing Password!"});
        }else{
            try{
                const new_task = new task({
                    First_Name: firstName,
                    Last_Name: lastName,
                    Contact_Number: contactNumber,
                    Email: email,
                    Password: password,
                    Address: address,
                    Employee_Type: employee_type,
                    IsTimedIn: false
                });
                await new_employee.save();
                
                //changes: end here
                res.json({success: true, message: "Registration Successful!"});
            }catch(error){
                console.error(error);
                res.status(500).json({success: false, message: "Registration Controller Error!"});
            }
        }
    }
} 

module.exports = manager_task_controller;
