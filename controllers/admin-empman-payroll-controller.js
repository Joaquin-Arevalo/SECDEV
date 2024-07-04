/*
Functions: 
-Display the admin-empman-payroll.hbs (Admin: Employee Management - Weekly Payroll Page)
-Populate the page with the employee's weekly payroll summary corresponding with the chosen employee and week
-Update/Edit the weekly payroll of the chosen employee and week
*/

const employee = require('../models/employee_model.js');
const payroll = require('../models/payroll_model.js');
const database = require('../models/database.js');

const admin_empman_payroll_controller = {
    get_admin_empman_payroll: function(req, res){
        res.render("admin-empman-payroll");
    },

    get_emp_total: async function(req, res){
        try{
            const emp_total = await database.findMany(employee, {$or: [{Employee_Type: "Employee"},{Employee_Type: "Work From Home"}]});

            emp_total.sort((a, b) => {
                const emailA = (a.Email || '').toLowerCase();
                const emailB = (b.Email || '').toLowerCase();
                
                return emailA.localeCompare(emailB);
            });

            res.render("admin-empman-payroll", {emp_total});
        }catch(error){
            console.error("Error processing employee total: ", error);
            res.status(500).send("Internal Server Error!");
        }
    }, 

    get_emp_wpay: async function(req, res){
        const selected_employee = req.query.employee;
        const selected_week = req.query.week;
        try{
            const emp_wpay = await database.findOne(payroll, {Email: selected_employee, Week: selected_week});//default is week 0
            const emp_total = await database.findMany(employee, {$or: [{Employee_Type: "Employee"},{Employee_Type: "Work From Home"}]});

            emp_total.sort((a, b) => {
                const emailA = (a.Email || '').toLowerCase();
                const emailB = (b.Email || '').toLowerCase();
                
                return emailA.localeCompare(emailB);
            });

            var Weekly_Minute_Rate = (emp_wpay.Weekly_Hourly_Rate/60).toFixed(2);
            var Total_Hour_Rate = [];
            var Total_Minute_Rate = [];
            for(let i = 0; i < 7; i++){
                if(i === 0){
                    Total_Hour_Rate[i] = emp_wpay.Sun_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Sun_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 1){
                    Total_Hour_Rate[i] = emp_wpay.Mon_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Mon_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 2){
                    Total_Hour_Rate[i] = emp_wpay.Tue_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Tue_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 3){
                    Total_Hour_Rate[i] = emp_wpay.Wed_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Wed_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 4){
                    Total_Hour_Rate[i] = emp_wpay.Thu_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Thu_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 5){
                    Total_Hour_Rate[i] = emp_wpay.Fri_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Fri_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }else if(i === 6){
                    Total_Hour_Rate[i] = emp_wpay.Sat_Hours * emp_wpay.Weekly_Hourly_Rate;
                    Total_Minute_Rate[i] = (emp_wpay.Sat_Minutes * Weekly_Minute_Rate).toFixed(2);;
                }
            }

            function padZero(num){
                if (num < 10){
                    num = "0" + num
                }
                return num
            }

            emp_wpay.Mon_Minutes =  padZero(emp_wpay.Mon_Minutes.toString());
            emp_wpay.Tue_Minutes =  padZero(emp_wpay.Tue_Minutes.toString());
            emp_wpay.Wed_Minutes =  padZero(emp_wpay.Wed_Minutes.toString());
            emp_wpay.Thu_Minutes =  padZero(emp_wpay.Thu_Minutes.toString());
            emp_wpay.Fri_Minutes =  padZero(emp_wpay.Fri_Minutes.toString());
            emp_wpay.Sat_Minutes =  padZero(emp_wpay.Sat_Minutes.toString());
            emp_wpay.Sun_Minutes =  padZero(emp_wpay.Sun_Minutes.toString());

            res.render("admin-empman-payroll", {emp_wpay, emp_total, Total_Hour_Rate, Total_Minute_Rate});
        }catch(error){
            console.error("Error processing weekly payroll: ", error);
            res.status(500).send("Internal Server Error!");
        }
    },

    post_update_payroll: async function(req, res){
        const {PPH, PPM, Additional, Advance, Deduction, Payroll_ID, cur_email, cur_week} = req.body;
        const upd_pay = await database.findOne(payroll, {_id: Payroll_ID});

        const calculatePayComponents = (hours, minutes, lateHours, otHours) => {
            const regularPay = (hours * PPH) + (minutes * PPM);
            const lateDeduction = lateHours * PPH;
            const overtimeRate = PPH * 1.5;
            const overtimePay = otHours * overtimeRate;
            const totalPay = regularPay + overtimePay - lateDeduction;
            return { totalPay, overtimePay, lateDeduction };
        };

        const mon_pay = calculatePayComponents(upd_pay.Mon_Hours, upd_pay.Mon_Minutes, upd_pay.Mon_Late_Hours, upd_pay.Mon_OT_Hours);
        const tue_pay = calculatePayComponents(upd_pay.Tue_Hours, upd_pay.Tue_Minutes, upd_pay.Tue_Late_Hours, upd_pay.Tue_OT_Hours);
        const wed_pay = calculatePayComponents(upd_pay.Wed_Hours, upd_pay.Wed_Minutes, upd_pay.Wed_Late_Hours, upd_pay.Wed_OT_Hours);
        const thu_pay = calculatePayComponents(upd_pay.Thu_Hours, upd_pay.Thu_Minutes, upd_pay.Thu_Late_Hours, upd_pay.Thu_OT_Hours);
        const fri_pay = calculatePayComponents(upd_pay.Fri_Hours, upd_pay.Fri_Minutes, upd_pay.Fri_Late_Hours, upd_pay.Fri_OT_Hours);
        const sat_pay = calculatePayComponents(upd_pay.Sat_Hours, upd_pay.Sat_Minutes, upd_pay.Sat_Late_Hours, upd_pay.Sat_OT_Hours);
        const sun_pay = calculatePayComponents(upd_pay.Sun_Hours, upd_pay.Sun_Minutes, upd_pay.Sun_Late_Hours, upd_pay.Sun_OT_Hours);

        // var mon_t_pay = upd_pay.Mon_Total_Pay;
        // var tue_t_pay = upd_pay.Tue_Total_Pay;
        // var wed_t_pay = upd_pay.Wed_Total_Pay;
        // var thu_t_pay = upd_pay.Thu_Total_Pay;
        // var fri_t_pay = upd_pay.Fri_Total_Pay;
        // var sat_t_pay = upd_pay.Sat_Total_Pay;
        // var sun_t_pay = upd_pay.Sun_Total_Pay;

        // if(Additional === false && Advance === false && Deduction === false){
        //     mon_t_pay = (upd_pay.Mon_Hours * PPH) + (upd_pay.Mon_Minutes * PPM);
        //     tue_t_pay = (upd_pay.Tue_Hours * PPH) + (upd_pay.Tue_Minutes * PPM);
        //     wed_t_pay = (upd_pay.Wed_Hours * PPH) + (upd_pay.Wed_Minutes * PPM);
        //     thu_t_pay = (upd_pay.Thu_Hours * PPH) + (upd_pay.Thu_Minutes * PPM);
        //     fri_t_pay = (upd_pay.Fri_Hours * PPH) + (upd_pay.Fri_Minutes * PPM);
        //     sat_t_pay = (upd_pay.Sat_Hours * PPH) + (upd_pay.Sat_Minutes * PPM);
        //     sun_t_pay = (upd_pay.Sun_Hours * PPH) + (upd_pay.Sun_Minutes * PPM);
        // }

        // var weekly_pay_total = mon_t_pay + tue_t_pay + wed_t_pay + 
        //     thu_t_pay + fri_t_pay + sat_t_pay + sun_t_pay;

        let weekly_pay_total = mon_pay.totalPay + tue_pay.totalPay + wed_pay.totalPay + thu_pay.totalPay + fri_pay.totalPay + sat_pay.totalPay + sun_pay.totalPay;

        var add;
        var adv;
        var ded;

        if(Additional === false){
            weekly_pay_total += upd_pay.Weekly_Total_Additional;
            add = upd_pay.Weekly_Total_Additional;
        }else{
            weekly_pay_total += Additional;
            add = Additional;
        }

        if(Advance === false){
            weekly_pay_total += upd_pay.Weekly_Total_Advance;
            adv = upd_pay.Weekly_Total_Advance;
        }else{
            weekly_pay_total += Advance;
            adv = Advance;
        }

        if(Deduction === false){
            weekly_pay_total -= upd_pay.Weekly_Total_Deduction;
            ded = upd_pay.Weekly_Total_Deduction;
        }else{
            weekly_pay_total -= Deduction;
            ded = Deduction;
        }
        
        try{
            await database.updateOne(payroll, {_id: Payroll_ID}, {
                $set: {
                    Weekly_Total_Pay: weekly_pay_total,
                    Weekly_Total_Additional: add,
                    Weekly_Total_Advance: adv,
                    Weekly_Total_Deduction: ded,
                    Mon_Total_Pay: mon_pay.totalPay,
                    Mon_OT_Compensation: mon_pay.overtimePay,
                    Mon_Late_Deduction: mon_pay.lateDeduction,
                    Tue_Total_Pay: tue_pay.totalPay,
                    Tue_OT_Compensation: tue_pay.overtimePay,
                    Tue_Late_Deduction: tue_pay.lateDeduction,
                    Wed_Total_Pay: wed_pay.totalPay,
                    Wed_OT_Compensation: wed_pay.overtimePay,
                    Wed_Late_Deduction: wed_pay.lateDeduction,
                    Thu_Total_Pay: thu_pay.totalPay,
                    Thu_OT_Compensation: thu_pay.overtimePay,
                    Thu_Late_Deduction: thu_pay.lateDeduction,
                    Fri_Total_Pay: fri_pay.totalPay,
                    Fri_OT_Compensation: fri_pay.overtimePay,
                    Fri_Late_Deduction: fri_pay.lateDeduction,
                    Sat_Total_Pay: sat_pay.totalPay,
                    Sat_OT_Compensation: sat_pay.overtimePay,
                    Sat_Late_Deduction: sat_pay.lateDeduction,
                    Sun_Total_Pay: sun_pay.totalPay,
                    Sun_OT_Compensation: sun_pay.overtimePay,
                    Sun_Late_Deduction: sun_pay.lateDeduction,
                    Weekly_Hourly_Rate: PPH,
                }
            });
            res.json({ success: true, message: "Payroll updated successfully!" });
        }catch(error){
            console.error(error);
            res.status(500).json({ success: false, message: "Error updating payroll!" });
        }
    }
}

module.exports = admin_empman_payroll_controller;