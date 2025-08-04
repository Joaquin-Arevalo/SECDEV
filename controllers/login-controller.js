/*
Functions:
-Login the Employee
-Create session email and employee type depending on the employee the logged in
*/

const employee = require('../models/employee_model.js');
const bcrypt = require('bcrypt');

const login_controller = {
    post_login: async function(req, res){
        const {email, password} = req.body;

        try{
            const user_exists = await employee.findOne({Email: email});
            const isMatch = await bcrypt.compare(password, user_exists.Password);

            if(!user_exists){
                return res.status(404).json({message: "Incorrect Credentials!"});
            }else if(!isMatch) {
                return res.status(401).json({ message: "Incorrect Credentials!" });
            }else{
                req.session.Email = email;
                req.session.Employee_Type = user_exists.Employee_Type;
                req.session.Security_Question = user_exists.Security_Questions;
                req.session.LCF = user_exists.Last_Successful_Login.toLocaleString("en-PH", { timeZone: "Asia/Manila" });

                if(user_exists.Employee_Type === "Employee"){
                    res.status(200).json({success: true, type: "Employee", message: "Login Successful!", sec_check: user_exists.Security_Questions});
                }else if(user_exists.Employee_Type === "Work From Home"){
                    res.status(200).json({success: true, type: "Work From Home", message: "Login Successful!", sec_check: user_exists.Security_Questions});
                }else if(user_exists.Employee_Type === "Manager"){
                    res.status(200).json({success: true, type: "Manager", message: "Login Successful!", sec_check: user_exists.Security_Questions});
                }else{
                    res.status(200).json({success: true, type: "Admin", message: "Login Successful!", sec_check: user_exists.Security_Questions});
                }
                //update here

                user_exists.Last_Successful_Login = new Date();
                await user_exists.save();
            }
        }catch(error){
            console.error("Error in post_login:", error);
            res.status(500).json({success: false, message: "Server Error!"});
        }

    }
}

module.exports = login_controller;
