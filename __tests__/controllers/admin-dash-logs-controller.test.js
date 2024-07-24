const payroll = require('../../models/payroll_model.js');
const employee = require('../../models/employee_model.js');
const httpMocks = require('node-mocks-http');
const admin_dash_logs_controller = require('../../controllers/admin-dash-logs-controller.js');
const { query } = require('express');
const database = require('../../models/database.js');
const admin_empman_emprecs_controller = require('../../controllers/admin-empman-emprecs-controller.js');

jest.mock('../../models/database.js');
jest.mock('../../models/employee_model.js')

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






