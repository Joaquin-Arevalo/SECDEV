const mongoose = require('mongoose');

const Payroll = require('./models/payroll_model.js');
const DB = require('./models/database.js')
const add_data_payroll = {
    populate_payroll: function(){
        var payrolls = [
            {
                Email: 'john.doe@example.com',
                Week: 0,
                Time_In_Weekday_Index: 6,
                
                Mon_Time_In: '08:00',
                Mon_Time_Out: '16:00',
                Mon_Hours: 8,
                Mon_Minutes: 30,
                Mon_Total_Pay: 85,
                Mon_Date: '2024-06-24',
                
                Tue_Time_In: '08:15',
                Tue_Time_Out: '16:45',
                Tue_Hours: 8,
                Tue_Minutes: 30,
                Tue_Total_Pay: 85,
                Tue_Date: '2024-06-25',
                
                Wed_Time_In: '08:30',
                Wed_Time_Out: '17:00',
                Wed_Hours: 8,
                Wed_Minutes: 30,
                Wed_Total_Pay: 85,
                Wed_Date: '2024-06-26',
                
                Thu_Time_In: '09:00',
                Thu_Time_Out: '17:30',
                Thu_Hours: 8,
                Thu_Minutes: 30,
                Thu_Total_Pay: 85,
                Thu_Date: '2024-06-27',
                
                Fri_Time_In: '09:15',
                Fri_Time_Out: '17:45',
                Fri_Hours: 8,
                Fri_Minutes: 30,
                Fri_Total_Pay: 85,
                Fri_Date: '2024-06-28',

                Sat_Time_In: '10:00',
                Sat_Time_Out: '14:00',
                Sat_Hours: 4,
                Sat_Minutes: 0,
                Sat_Total_Pay: 40,
                Sat_Date: '2024-06-29',

                Sun_Time_In: '10:30',
                Sun_Time_Out: '14:30',
                Sun_Hours: 4,
                Sun_Minutes: 0,
                Sun_Total_Pay: 40,
                Sun_Date: '2024-06-30',

                Weekly_Total_Advance: 50,
                Weekly_Total_Additional: 20,
                Weekly_Total_Deduction: 10,
                Weekly_Total_Pay: 590,
                Weekly_Hourly_Rate: 10
            },
            {
                Email: 'john.doe@example.com',
                Week: 1,
                Time_In_Weekday_Index: 6,
                
                Mon_Time_In: '09:00',
                Mon_Time_Out: '17:00',
                Mon_Hours: 8,
                Mon_Minutes: 0,
                Mon_Total_Pay: 80,
                Mon_Date: '2024-07-01',
                
                Tue_Time_In: '09:15',
                Tue_Time_Out: '17:15',
                Tue_Hours: 8,
                Tue_Minutes: 0,
                Tue_Total_Pay: 80,
                Tue_Date: '2024-07-02',
                
                Wed_Time_In: '09:30',
                Wed_Time_Out: '17:30',
                Wed_Hours: 8,
                Wed_Minutes: 0,
                Wed_Total_Pay: 80,
                Wed_Date: '2024-07-03',
                
                Thu_Time_In: '09:45',
                Thu_Time_Out: '17:45',
                Thu_Hours: 8,
                Thu_Minutes: 0,
                Thu_Total_Pay: 80,
                Thu_Date: '2024-07-04',
                
                Fri_Time_In: '10:00',
                Fri_Time_Out: '18:00',
                Fri_Hours: 8,
                Fri_Minutes: 0,
                Fri_Total_Pay: 80,
                Fri_Date: '2024-07-05',

                Sat_Time_In: '10:15',
                Sat_Time_Out: '14:15',
                Sat_Hours: 4,
                Sat_Minutes: 0,
                Sat_Total_Pay: 40,
                Sat_Date: '2024-07-06',

                Sun_Time_In: '10:30',
                Sun_Time_Out: '14:30',
                Sun_Hours: 4,
                Sun_Minutes: 0,
                Sun_Total_Pay: 40,
                Sun_Date: '2024-07-07',

                Weekly_Total_Advance: 50,
                Weekly_Total_Additional: 20,
                Weekly_Total_Deduction: 10,
                Weekly_Total_Pay: 590,
                Weekly_Hourly_Rate: 10
            },
            {
                Email: 'john.doe@example.com',
                Week: 2,
                Time_In_Weekday_Index: 6,
                
                Mon_Time_In: '08:45',
                Mon_Time_Out: '16:45',
                Mon_Hours: 8,
                Mon_Minutes: 0,
                Mon_Total_Pay: 80,
                Mon_Date: '2024-07-08',
                
                Tue_Time_In: '08:00',
                Tue_Time_Out: '16:30',
                Tue_Hours: 8,
                Tue_Minutes: 30,
                Tue_Total_Pay: 85,
                Tue_Date: '2024-07-09',
                
                Wed_Time_In: '08:15',
                Wed_Time_Out: '16:45',
                Wed_Hours: 8,
                Wed_Minutes: 30,
                Wed_Total_Pay: 85,
                Wed_Date: '2024-07-10',
                
                Thu_Time_In: '08:30',
                Thu_Time_Out: '17:00',
                Thu_Hours: 8,
                Thu_Minutes: 30,
                Thu_Total_Pay: 85,
                Thu_Date: '2024-07-11',
                
                Fri_Time_In: '09:00',
                Fri_Time_Out: '17:30',
                Fri_Hours: 8,
                Fri_Minutes: 30,
                Fri_Total_Pay: 85,
                Fri_Date: '2024-07-12',
            
                Sat_Time_In: '09:15',
                Sat_Time_Out: '13:45',
                Sat_Hours: 4,
                Sat_Minutes: 30,
                Sat_Total_Pay: 45,
                Sat_Date: '2024-07-13',
            
                Sun_Time_In: '09:30',
                Sun_Time_Out: '14:00',
                Sun_Hours: 4,
                Sun_Minutes: 30,
                Sun_Total_Pay: 45,
                Sun_Date: '2024-07-14',
            
                Weekly_Total_Advance: 50,
                Weekly_Total_Additional: 20,
                Weekly_Total_Deduction: 10,
                Weekly_Total_Pay: 590,
                Weekly_Hourly_Rate: 10
            }
        ]
        DB.insertMany(Payroll, payrolls)
    }
}

module.exports = add_data_payroll;