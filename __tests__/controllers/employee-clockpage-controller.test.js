const httpMocks = require('node-mocks-http');
const employee_clockpage_controller = require('../../controllers/employee-clockpage-controller.js');
const database = require('../../models/database.js');
const employee = require('../../models/employee_model.js');
const payroll = require('../../models/payroll_model.js');

jest.mock('../../models/database.js');


describe('get_employee_clockpage', () => {

    it('should rendeer employee-clockage with correct session data', () => {
        const req = httpMocks.createRequest({
            session: {
                Email: 'test@example.com',
                Employee_type: 'Employee'
            }
        });

        const res = httpMocks.createResponse();

        employee_clockpage_controller.get_employee_clockpage(req, res);
        
        expect(res._getRenderView()).toBe('employee-clockpage');
        expect(res._getRenderData()).toEqual({
            email: 'test@example.com',
            emp_type: 'Employee'
        });
    });

});

describe('get_wfh_clockpage', () => {

    it('should render wfh employee-clockpage with correct session data', () => {
        const req = httpMocks.createRequest({
            session: {
                Email: 'test@example.com',
                Employee_type: 'WFH'
            }
        });

        const res = httpMocks.createResponse();

        employee_clockpage_controller.get_wfh_clockpage(req, res);

        expect(res._getRenderView()).toBe('work-from-home-clockpage');
        expect(res._getRenderData()).toEqual({
            email: 'test@example.com',
            emp_type: 'WFH'
        });
        
    });
});

describe('get_employee_time_in_status', () => {

    it('should return time-in status of the employee', async () => {
        const req = httpMocks.createRequest({
            session: { Email: 'test@example.com' }
        });

        const res = httpMocks.createResponse();

        database.findOne.mockResolvedValue({ IsTimedIn: true });

        await employee_clockpage_controller.get_employee_time_in_status(req, res);

        expect(res._getJSONData()).toEqual({ time_in_status: true });
        expect(res.statusCode).toBe(200);
    });

    //fail
    it('should return 500 if there is an error', async () => {

        const req = httpMocks.createRequest({
            session: { Email: 'test@example.com' }
        });

        const res = httpMocks.createResponse();

        database.findOne.mockRejectedValue(new Error('Database error'));

        await employee_clockpage_controller.get_employee_time_in_status(req, res);

        expect(res._getData()).toBe("Internal Server Error!");
        expect(res.statusCode).toBe(500);
    });
});

describe('post_employee_time_in', () => {

    it('should update employee time-in status and payroll', async () => {

        const req = httpMocks.createRequest({
            session: { Email: 'test@example.com' },
            body: { Time_in: '09:00', TI_weekdayIndex: 1, Time_In_Date: '2024-07-24' }
        });

        const res = httpMocks.createResponse();

        await employee_clockpage_controller.post_employee_time_in(req, res);

        expect(database.updateOne).toHaveBeenCalledTimes(2);
        expect(database.updateOne).toHaveBeenCalledWith(expect.anything(), { Email: 'test@example.com' }, { IsTimedIn: true });
        expect(res._getRenderView()).toBe('employee-clockpage');
        expect(res._getRenderData()).toEqual({
            email: 'test@example.com',
            emp_type: undefined,
            ETI_weekdayIndex: undefined
        });
    });
});

describe('post_employee_time_out', () => {
    //failed
    it('should update payroll with time-out data', async () => {

        const req = httpMocks.createRequest({
            session: { Email: 'test@example.com' },
            body: { TO_hour: '17', TO_minute: '00', TO_weekdayIndex: 1 }
        });

        const res = httpMocks.createResponse();

        const dayData = {
            Weekly_Hourly_Rate: 20,
            Mon_Time_In: '09:00',
            Weekly_Total_Pay: 0,
            Time_In_Weekday_Index: 1
        };

        const employeeData = {
            Employee_Type: 'Employee'
        };

        database.findOne
            .mockResolvedValue(dayData)
            .mockResolvedValue(employeeData);
        
        await employee_clockpage_controller.post_employee_time_out(req, res);

        expect(database.updateOne).toHaveBeenCalled();
        expect(res._getJSONData()).toEqual({ success: true, type: "Emp", message: "Time out recorded successfully!" });
    });

    //failed
    it('should handle errors during time-out process', async () => {

        const req = httpMocks.createRequest({
            session: { Email: 'test@example.com' },
            body: { TO_hour: '17', TO_minute: '00', TO_weekdayIndex: 1 }
        });

        const res = httpMocks.createResponse();
        res.json = jest.fn();

        database.findOne.mockRejectedValueOnce(new Error('Database error'));

        await employee_clockpage_controller.post_employee_time_out(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ success: false, message: "Error recording time out!" });
    });
});