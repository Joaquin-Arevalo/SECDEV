/*
Functions:
-Display the register.hbs (Admin: Add Employee Page)
-Create new employee and weekly payroll
*/

// const employee = require('../models/employee_model.js');
const task = require('../models/task_model.js');
const employee = require('../models/employee_model.js');
const database = require('../models/database.js');

const manager_task_controller = {
    get_task: function(req, res){
        res.render('manager-empman-task');
    }, 

    get_emp_total: async function(req, res){
        try{
            const emp_total = await database.findMany(employee, {$or: [{Employee_Type: "Employee"},{Employee_Type: "Work From Home"}]});

            emp_total.sort((a, b) => {
                const emailA = (a.Email || '').toLowerCase();
                const emailB = (b.Email || '').toLowerCase();
                
                return emailA.localeCompare(emailB);
            });

            res.render("manager-empman-task", {emp_total});
        }catch(error){
            console.error("Error processing employee total: ", error);
            res.status(500).send("Internal Server Error!");
        }
    },

    get_specific_emp_task: async function(req, res) {
        try {
            const email = req.query.employee;

            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            // Find selected employee
            const emp = await employee.findOne({ Email: email });
            if (!emp) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            // Get all tasks for this employee
            const r_tasks = await task.find({
                Email: email,
                Task_isDeleted: false
            });

            const statusList = r_tasks.map(t => t.Task_isCompleted === true ? "Complete" : "Incomplete");

            // Also fetch all employees (again)
            const emp_total = await employee.find({
                $or: [
                    { Employee_Type: "Employee" },
                    { Employee_Type: "Work From Home" }
                ]
            });

            emp_total.sort((a, b) => {
                return (a.Email || '').localeCompare(b.Email || '');
            });

            // Render with all data
            res.render("manager-empman-task", {r_tasks, emp_total, statusList});

        } catch (error) {
            console.error("Error fetching specific employee tasks:", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    },



    post_register_task: async function(req, res) {
        const { email, taskName, taskDescription } = req.body;
        try {
            const user_exists = await employee.findOne({ Email: email });

            if (user_exists) {
                const { First_Name, Last_Name, Employee_Type } = user_exists;

                const new_task = new task({
                    First_Name,
                    Last_Name,
                    Email: email,
                    Employee_Type,
                    Task_Name: taskName,
                    Task_Description: taskDescription,
                    Task_isCompleted: false,
                    Task_isDeleted: false
                });

                await new_task.save();

                res.json({ success: true, message: "Task registered successfully!" });
            } else {
                res.status(404).json({ success: false, message: "Employee not found." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Registration Controller Error!" });
        }
    },


    delete_task: async function(req, res) {
        const taskId = req.body.taskId;
        try {
            const updated = await task.findByIdAndUpdate(taskId, {
                Task_isDeleted: true
            });

            if (!updated) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }

            res.json({ success: true, message: "Task marked as deleted." });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ success: false, message: "Server error." });
        }
    },

    complete_task: async function(req, res) {
        const taskId = req.body.taskId;
        try {
            const updated = await task.findByIdAndUpdate(taskId, {
                Task_isCompleted: true
            });

            if (!updated) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }

            res.json({ success: true, message: "Task marked as complete." });
        } catch (error) {
            console.error("Error completing task:", error);
            res.status(500).json({ success: false, message: "Server error." });
        }
    },

    edit_task: async function(req, res) {
        const { taskID, taskName, taskDescription, email } = req.body;

        try {
            const emp = await employee.findOne({ Email: email });
            if (!emp) {
                return res.status(404).json({ success: false, message: "Employee not found." });
            }

            const updatedTask = await task.findByIdAndUpdate(taskID, {
                Task_Name: taskName,
                Task_Description: taskDescription,
                Email: emp.Email,
                First_Name: emp.First_Name,
                Last_Name: emp.Last_Name,
                Employee_Type: emp.Employee_Type
            });

            if (!updatedTask) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }

            res.json({ success: true, message: "Task updated successfully." });
        } catch (error) {
            console.error("Error editing task:", error);
            res.status(500).json({ success: false, message: "Server error." });
        }
    }

} 

module.exports = manager_task_controller;
