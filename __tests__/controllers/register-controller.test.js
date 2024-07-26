const httpMocks = require('node-mocks-http');
const register_controller = require('../../controllers/register-controller.js');
const employee = require('../../models/employee_model.js');
const payroll = require('../../models/payroll_model.js');

jest.mock('../../models/employee_model.js');
jest.mock('../../models/payroll_model.js');

describe('register-controller', () => {

    describe('get_register', () => {

        it('should render the register page', () => {

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const renderSpy = jest.spyOn(res, 'render');

            register_controller.get_register(req, res);

            expect(renderSpy).toHaveBeenCalledWith('register');
        });
    });

    describe('post_register', () => {

        let req, res;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
        });

        it('should return 400 if email already exists', async () => {
            
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Street',
                contactNumber: '1234567890',
                employee_type: 'Employee'
            };

            employee.findOne.mockResolvedValue({});

            await register_controller.post_register(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getData()).toEqual(JSON.stringify({ message: "Email Already Exists!" }));
        });

        it('should return 400 if password is missing', async () => {
            req.body = {
                email: 'test@example.com',
                password: '', //missing pw
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Street',
                contactNumber: '1234567890',
                employee_type: 'Employee'
            };

            employee.findOne.mockResolvedValue(null);

            await register_controller.post_register(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getData()).toEqual(JSON.stringify({ message: "Missing Password!" }));
        });

        it('should create a new employee and payroll record', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Street',
                contactNumber: '1234567890',
                employee_type: 'Employee'
            };

            employee.findOne.mockResolvedValue(null); //new email
            
            const saveMock = jest.fn().mockResolvedValue({});
            employee.mockImplementation(() => ({
                save: saveMock
            }));

            const payrollSaveMock = jest.fn().mockResolvedValue({});
            payroll.mockImplementation(() => ({
                save: payrollSaveMock
            }));

            await register_controller.post_register(req, res);

            expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
            expect(saveMock).toHaveBeenCalled();

            expect(payroll.mock.instances.length).toBeGreaterThanOrEqual(3);
            expect(payrollSaveMock).toHaveBeenCalledTimes(3);

            expect(res.statusCode).toBe(200);
            expect(res._getData()).toEqual(JSON.stringify({ success: true, message: "Registration Successful!" }));
        });

        it('should hander errors during registration', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Street',
                contactNumber: '1234567890',
                employee_type: 'Employee'
            };

            employee.findOne.mockResolvedValue(null);

            employee.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('Database Error'))
            }));

            await register_controller.post_register(req, res);

            expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
            expect(res.statusCode).toBe(500);
            expect(res._getData()).toEqual(JSON.stringify({ success: false, message: "Registration Controller Error!" }));
        });
    });
});