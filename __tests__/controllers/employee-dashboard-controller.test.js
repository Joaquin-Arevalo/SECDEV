const employee_dashboard_controller = require('../../controllers/employee-dashboard-controller.js');
const payroll = require('../../models/payroll_model.js');
const employee = require('../../models/employee_model.js');
const database = require('../../models/database.js');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/database.js');
jest.mock('../../models/employee_model.js');
jest.mock('../../models/payroll_model.js');

describe('get_employee_dashboard', () => {

    it('should render employee dashboard with employee details', async () => {
        
        const mockEmployeeRecord = { Email: 'a@example.com', Employee_Type: 'Admin' };
        database.findOne.mockResolvedValue(mockEmployeeRecord);

        const req = httpMocks.createRequest({
            session: {
                Email: 'a@example.com',
                Employee_type: 'Admin',
                ETI_weekdayIndex: 1
            }
        });

        const res = httpMocks.createResponse();
        res.render = jest.fn();

        await employee_dashboard_controller.get_employee_dashboard(req, res);

        expect(database.findOne).toHaveBeenCalledWith(employee, { Email: 'a@example.com' });
        expect(res.render).toHaveBeenCalledWith('employee-dashboard', {
            email: 'a@example.com',
            emp_type: 'Admin',
            ETI_weekdayIndex: 1,
            emp_rec: mockEmployeeRecord
        });
    });

    //failed
    it('should handle error gracefully when rendering employee dashboard', async () => {

        database.findOne.mockRejectedValue(new Error('Database error'));

        const req = httpMocks.createRequest({
            session: {
                Email: 'a@example.com',
                Employee_type: 'Admin',
                ETI_weekdayIndex: 1
            }
        });

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnThis();
        res.send = jest.fn();

        await employee_dashboard_controller.get_employee_dashboard(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error!");
    });
});

describe('get_employee_details', () => {

    //failed
    it('should render employee details with payroll information', async () => {

        const mockPayrollRecord = {
            Email: 'a@example.com',
            Week: '2024-07-03',
            Weekly_Hourly_Rate: 20,
            Sun_Hours: 1,
            Sun_Minutes: 30
        };

        const mockEmployeeRecord = { Email: 'a@example.com', Employee_Type: 'Employee' };

        database.findOne.mockImplementation((model, query) => {
            if (model == payroll) return Promise.resolve(mockPayrollRecord);
            if (model == employee) return Promise.resolve(mockEmployeeRecord);
        });

        const req = httpMocks.createRequest({
            session: {
                Email: 'a@example.com',
                Employee_type: 'Employee',
                ETI_weekdayIndex: 1
            },
            body: { week: '2024-07-23' }
        });

        const res = httpMocks.createResponse();
        res.render = jest.fn();

        await employee_dashboard_controller.get_employee_details(req, res);

        expect(database.findOne).toHaveBeenCalledWith(payroll, { Email: 'a@example.com', Week: '2024-07-23' });
        expect(database.findOne).toHaveBeenCalledWith(employee, { Email: 'a@example.com' });
        expect(res.render).toHaveBeenCalledWith('employee-dashboard', {
            email: 'a@example.com',
            emp_type: 'Employee',
            ETI_weekdayIndex: 1,
            emp_det: mockPayrollRecord,
            emp_rec: mockEmployeeRecord,
            Total_Hour_Rate: expect.any(Array),
            Total_Minute_Rate: expect.any(Array)
        });
    });

    it('should handle errors gracefully when rendering employee details', async () => {

        database.findOne.mockRejectedValue(new Error('Database error'));

        const req = httpMocks.createRequest({
            session: {
                Email: 'a@example.com',
                Employee_type: 'Employee',
                ETI_weekdayIndex: 1
            },
            body: { week: '2024-07-23' }
        });

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnThis();
        res.send = jest.fn();

        await employee_dashboard_controller.get_employee_details(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error!");
    });
});