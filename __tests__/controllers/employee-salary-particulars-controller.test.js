const employee_salary_particulars_controllers = require('../../controllers/employee-salary-particulars-controller.js');
const employee = require('../../models/employee_model.js');
const database = require('../../models/database.js');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/database.js');

describe('employee_salary_particulars_controller', () => {
    describe('get_salary_particulars', () => {
        
        let req, res;

        beforeEach(() => {
            req = httpMocks.createRequest({
                session: {
                    Email: 'test@example.com',
                    Employee_type: 'Employee',
                    ETI_weekdayIndex: 3
                }
            });
            
            res = httpMocks.createResponse;
        });

        it('should render the employee-salaryParticulars page with data', async () => {

            const mockEmpRec = { name: 'Test Employee', email: 'test@example.com' };
            database.findOne.mockResolvedValue(mockEmpRec);

            await employee_salary_particulars_controllers.get_salary_particulars(req, res);

            expect(database.findOne).toHaveBeenCalledWith(employee, { Email: 'test@example.com' });
            expect(res.render).toHaveBeenCalledWith('employee-salaryParticulars', {
                email: 'test@example.com',
                emp_type: 'full-time',
                ETI_weekdayIndex: 3,
                emp_rec: mockEmpRec
            });
        });

        it('should handle errors and send 500 status code', async () => {

            database.findOne.mockRejectedValue(new Error('Database error'));

            await employee_salary_particulars_controllers.get_salary_particulars(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getData()).toBe('Internal Server Error!');
        });

    });
});