const update_payroll_controller = require('../../controllers/update-payroll-controller.js');
const database = require('../../models/database.js');
const payroll = require('../../models/payroll_model.js');
const employee = require('../../models/employee_model.js');
const { HttpStatusCode } = require('axios');
const { json } = require('body-parser');

jest.mock('../../models/database.js');
jest.mock('../../models/payroll_model.js');
jest.mock('../../models/employee_model.js');

describe('update-payroll-controller', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should update payroll records correctly', async () => {
        
        const mockEmployeeData = [
            { Email: 'employee1@example.com', Employee_Type: 'Employee' },
            { Email: 'employee2@example.com', Employee_Type: 'Work From Home' }
        ];

        const mockWeek0Data = {
            Mon_Hours: 0,
            Mon_Minutes: 0,
            // Other fields with default values...
            Weekly_Hourly_Rate: 10
        };

        const mockWeek1Data = {
            Mon_Hours: 8,
            Mon_Minutes: 30,
            // Other fields with week 1 values...
            Weekly_Hourly_Rate: 15
        };

        database.findMany.mockResolvedValue(mockEmployeeData);
        database.findOne.mockImplementation((model, query) => {

            if (query.Week === 0) {
                return Promise.resolve(mockWeek0Data);
            } else if (query.Week === 1) {
                return Promise.resolve(mockWeek1Data);
            }

            return Promise.resolve(null);
        });

        database.updateOne.mockResolvedValue(true);

        const req = {};
        const res = {
            HttpStatusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update_payroll_controller.post_update_employee_payroll(req, res);

        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }] });
        expect(database.findOne).toHaveBeenCalledTimes(4); // Each employee will have two calls to findOne (week 0 and week 1)
        expect(database.updateOne).toHaveBeenCalledTimes(6); // Each employee will have three calls to updateOne (week 2, week 1, and week 0)

        expect(database.updateOne).toHaveBeenCalledWith(payroll, { Email: 'employee1@example.com', Week: 2 }, expect.any(Object));
        expect(database.updateOne).toHaveBeenCalledWith(payroll, { Email: 'employee1@example.com', Week: 1 }, expect.any(Object));
        expect(database.updateOne).toHaveBeenCalledWith(payroll, { Email: 'employee1@example.com', Week: 0 }, expect.any(Object));
        
       expect(res.statusCode).toBe(200);
    });
});