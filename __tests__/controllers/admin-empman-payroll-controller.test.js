const database = require('../../models/database');
const employee = require('../../models/employee_model');
const payroll = require('../../models/payroll_model');
const admin_empman_payroll_controller = require('../../controllers/admin-empman-payroll-controller');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/database');

describe('admin_empman_payroll_controller', () => {
    beforeEach(() => {
        database.findMany.mockClear();
        database.findOne.mockClear();
        database.updateOne.mockClear();
    });

    it('should render the payroll page', () => {

        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        res.render = jest.fn();

        admin_empman_payroll_controller.get_admin_empman_payroll(req, res);

        expect(res.render).toHaveBeenCalledWith('admin-empman-payroll');
    });

    it('should render with employee totals', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        res.render = jest.fn();

        const employees = [
            { Email: 'john@example.com', Employee_Type: 'Employee' },
            { Email: 'doe@example.com', Employee_Type: 'Work From Home' }
        ];

        database.findMany.mockResolvedValue(employees); 

        await admin_empman_payroll_controller.get_emp_total(req, res);

        expect(database.findMany).toHaveBeenCalledWith(employee, expect.any(Object));
        expect(res.render).toHaveBeenCalledWith('admin-empman-payroll', { emp_total: employees });
    });

    //failed
    it('should render with employee weekly payroll', async () => {
        
        const req = httpMocks.createRequest({
            query: { employee: 'john@example.com', week: '1' }
        });

        const res = httpMocks.createResponse();
        res.render = jest.fn();

        const emp_wpay = {
            Weekly_Hourly_Rate: 20,
            Mon_Hours: 8,
            Mon_Minutes: 30,
            Mon_Late_Hours: 1,
            Mon_OT_Hours: 2,
        };

        const employees = [
            { Email: 'john@example.com', Employee_Type: 'Employee' }
        ];

        database.findOne.mockResolvedValue(emp_wpay);
        database.findMany.mockResolvedValue(employees);

        await admin_empman_payroll_controller.get_emp_wpay(req, res);

       expect(database.findOne).toHaveBeenCalledWith(payroll, { Email: 'john@example.com', Week: '1' });
       expect(database.findMany).toHaveBeenCalledWith(employee, expect.any(Object));

        
        expect(res.render).toHaveBeenCalledWith('admin-empman-payroll', {
            emp_total: expect.any(Array),
            emp_wpay: expect.objectContaining({ Mon_Hours: 8 }),
            Total_Hour_Rate: expect.any(Array),
            Total_Minute_Rate: expect.any(Array)
        });
    });

    it('should update payroll and respond with success', async () => {
        const req = httpMocks.createRequest({
            body: {
                PPH: 20, PPM: 0.33, Additional: false, Advance: false, Deduction: false, Payroll_ID: '1', cur_email: 'john@example.com', cur_week: '1'
            }
        });

        const res = httpMocks.createResponse();
        res.json = jest.fn();

        const upd_pay = {
            _id: '1',
            Weekly_Hourly_Rate: 20,
            Mon_Hours: 8,
            Mon_Minutes: 30,
            Mon_Late_Hours: 1,
            Mon_OT_Hours: 2,
            Weekly_Total_Additional: 50,
            Weekly_Total_Advance: 0,
            Weekly_Total_Deduction: 0
        };

        database.findOne.mockResolvedValue(upd_pay);
        database.updateOne.mockResolvedValue({});

        await admin_empman_payroll_controller.post_update_payroll(req, res);

        expect(database.findOne).toHaveBeenCalledWith(payroll, { _id: '1' });
        expect(database.updateOne).toHaveBeenCalledWith(payroll, { _id: '1' }, expect.any(Object));
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Payroll updated successfully!" });
    });

    //failed
    it('should handle errors and respond with failure', async () => {
        const req = httpMocks.createRequest({
            body: {
                PPH: 20, PPM: 0.33, Additional: false, Advance: false, Deduction: false, Payroll_ID: '1', cur_email: 'john@example.com', cur_week: '1'
            }
        });

        const res = httpMocks.createResponse();
        res.json = jest.fn();

        database.findOne.mockRejectedValue(new Error('Database error'));

        await admin_empman_payroll_controller.post_update_payroll(req, res);

        expect(database.findOne).toHaveBeenCalledWith(payroll, { _id: '1' });
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error updating payroll!" });
    });

});