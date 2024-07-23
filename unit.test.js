const payroll = require('./models/payroll_model.js');
const employee = require('./models/employee_model.js');
const httpMocks = require('node-mocks-http');
const admin_dash_logs_controller = require('./controllers/admin-dash-logs-controller.js');
const { query } = require('express');
const database = require('./models/database.js');
const admin_empman_emprecs_controller = require('./controllers/admin-empman-emprecs-controller.js');

jest.mock('./models/database.js');

describe('Admin Dashboard Controller', () => {
    describe('get_admin_dash_logs', () => {

        //render admin dash view
        it('should render the admin-dash-logs view', () => {

            //mock request/response
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            //capture the call
            res.render = jest.fn();

            //call the method
            admin_dash_logs_controller.get_admin_dash_logs(req, res);

                //check if 'render' was called
                expect(res.render).toHaveBeenCalledWith("admin-dash-logs");
        });
    });

//generate employee summary
    describe('get_employee_summary', () => {

        //valid test
        it('should render the admin-dash-logs view with employee summary', async () => {
            const req = httpMocks.createRequest({
                query: {
                    s_date: '2024-07-23',
                    d_week: 'Tuesday'
                }
            });

            const res = httpMocks.createResponse();
            res.render = jest.fn();

            //simulate data retrieved from db
            const mockEmployeeSummary = [
                { id: 1, Mon_Date: '2024-07-23', employee: 'John Doe' },
                { id: 2, Tue_Date: '2024-07-23', employee: 'Jane Doe' }
            ];

            database.findMany.mockResolvedValue(mockEmployeeSummary);

            await admin_dash_logs_controller.get_employee_summary(req, res);

            expect(database.findMany).toHaveBeenCalledWith(payroll, {
                $or: [
                    { Mon_Date: '2024-07-23' },
                    { Tue_Date: '2024-07-23' },
                    { Wed_Date: '2024-07-23' },
                    { Thu_Date: '2024-07-23' },
                    { Fri_Date: '2024-07-23' },
                    { Sat_Date: '2024-07-23' },
                    { Sun_Date: '2024-07-23' },
                ]
            });

            expect(res.render).toHaveBeenCalledWith("admin-dash-logs", { emp_sum: mockEmployeeSummary, d_week: 'Tuesday' });
        });

        //error handling
        it('should handle errors gracefully', async () => {
            const req = httpMocks.createRequest({
                query: {
                    s_date: '2024-07-03',
                    d_week: 'Tuesday'
                }
            });

            const res = httpMocks.createResponse();
            res.render = jest.fn();
            res.status = jest.fn().mockReturnThis();
            res.send = jest.fn();

            database.findMany.mockRejectedValue(new Error('Database Error'));

            await admin_dash_logs_controller.get_employee_summary(req, res);

            expect(database.findMany).toHaveBeenCalledWith(payroll, {
                $or: [
                    { Mon_Date: '2024-07-23' },
                    { Tue_Date: '2024-07-23' },
                    { Wed_Date: '2024-07-23' },
                    { Thu_Date: '2024-07-23' },
                    { Fri_Date: '2024-07-23' },
                    { Sat_Date: '2024-07-23' },
                    { Sun_Date: '2024-07-23' },
                ]
            });

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal Server Error!")
        });
    });
});

describe('Admin Employee Management Controller', () => {
    //verify that method renders the page with sorted employee data
    describe('get_emprecs', () => {
        //valid query
        it('should render the admin-empman-emprecs view with sorted employee data', async () => {
            const mockEmployeeData = [
                { Email: 'b@example.com', Employee_Type: 'Employee' },
                { Email: 'a@example.com', Employee_Type: 'Admin' }
            ]

            database.findMany.mockResolvedValue(mockEmployeeData);

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            res.render = jest.fn();

            await admin_empman_emprecs_controller.get_emprecs(req, res);

            expect(database.findMany).toHaveBeenCalledWith(employee, {
                $or: [
                    { Employee_Type: "Employee" },
                    { Employee_Type: "Work From Home" },
                    { Employee_Type: "Admin" }
                ]
            });

            expect(res.render).toHaveBeenCalledWith("admin-empman-emprecs", {
                emp_emails: [
                    { Email: 'a@example.com', Employee_Type: 'Admin' },
                    { Email: 'b@example.com', Employee_Type: 'Employee' }
                ]
            });
        });

        //error handling
        it('should handle errors gracefully', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            res.render = jest.fn();
            res.status = jest.fn().mockReturnThis();
            res.send = jest.fn();

            database.findMany = jest.fn().mockRejectedValue(new Error('Database Error'));

            await admin_empman_emprecs_controller.get_emprecs(req, res);

            expect(database.findMany).toHaveBeenCalledWith(employee, {
                $or: [
                    { Employee_Type: "Employee" },
                    { Employee_Type: "Work From Home" },
                    { Employee_Type: "Admin" }
                ]
            });

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal Server Error");
        });
    });

    describe('post_specific_emprecs', () => {
        it('should render the admin-empman-emprecs view with specific employee details', async () => {
            const mockEmployeeData = [
                { Email: 'b@example.com', Employee_Type: 'Employee' },
                { Email: 'a@example.com', Employee_Type: 'Admin' }
            ];

            const mockEmployeeDetails = { Email: 'a@example.com', Employee_Type: 'Admin' };

            database.findMany.mockResolvedValue(mockEmployeeData);
            employee.findOne.mockResolvedValue(mockEmployeeDetails);

            const req = httpMocks.createRequest({
                body: {
                    email: 'a@example.com'
                }
            });

            const res = httpMocks.createResponse();
            res.render = jest.fn();

            await admin_empman_emprecs_controller.post_specific_emprecs(req, res);

            expect(database.findMany).toHaveBeenCalled(employee, {
                $or: [
                    { Employee_Type: "Employee" },
                    { Employee_Type: "Work From Home" },
                    { Employee_Type: "Admin" }
                ]
            });

            expect(employee.findOne).toHaveBeenCalledWith({ Email: 'a@example.com' });

            expect(res.render).toHaveBeenCalledWith("admin-empman-emprecs", {
                emp_emails: [
                    { Email: 'a@example.com', Employee_Type: 'Admin' },
                    { Email: 'b@example.com', Employee_Type: 'Employee' }
                ],
                emp_sum: mockEmployeeDetails
            });

            
           
        });

        //error handling
         it('should handle errors gracefully when fetching specific employee details', async () => {
                const mockEmployeeData = [
                    { Email: 'b@example.com', Employee_Type: 'Employee' },
                    { Email: 'a@example.com', Employee_Type: 'Admin' }
                ];

                database.findMany.mockResolvedValue(mockEmployeeData);
                employee.findOne.mockRejectedValue(new Error('Database Error'));

                const req = httpMocks.createRequest({
                    body: {
                        email: 'a@example.com'
                    }
                });

                const res = httpMocks.createResponse();
                res.render = jest.fn();
                res.status = jest.fn().mockReturnThis();
                res.send = jest.fn();

                await admin_empman_emprecs_controller.post_specific_emprecs(req, res);

                expect(database.findMany).toHaveBeenCalledWith(employee, {
                    $or: [
                        { Employee_Type: "Employee" },
                        { Employee_Type: "Work From Home" },
                        { Employee_Type: "Admin" }
                    ]
                });

                expect(employee.findOne).toHaveBeenCalledWith({ Email: 'a@example.com' });

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.send).toHaveBeenCalledWith("Internal Server Error");
            });
    });
});




