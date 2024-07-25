const login_controller = require('../../controllers/login-controller');
const employee = require('../../models/employee_model');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/employee_model');

describe('login-controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest({
            body: {
                email: 'test@example.com',
                password: 'password123'
            },
            session: {}
        });

        res = httpMocks.createResponse();
    });

    it('should login the employee successfully', async () => {
        const mockEmployee = {
            Email: 'test@example.com',
            Password: 'password123',
            Employee_Type: 'Employee'
        };

        employee.findOne.mockResolvedValue(mockEmployee);

        await login_controller.post_login(req, res);

        const responseData = JSON.parse(res._getData());

        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual({
            success: true,
            type: 'Employee',
            message: 'Login Successful!'
        });
        

        expect(req.session.Email).toBe('test@example.com');
        expect(req.session.Employee_Type).toBe('Employee');
    });

    it('should return 404 if the user does not exist', async () => {
        req.body = {
            email: 'nonexistent@example.com',
            password: 'password123'
        };

        employee.findOne.mockResolvedValue(null);

        await login_controller.post_login(req, res);

        const responseData = JSON.parse(res._getData());

        expect(res.statusCode).toBe(404);
        expect(responseData).toEqual({
            message: 'Incorrect Credentials!'
        });
    });

    it('should return 401 if the password is incorrect', async () => {
        const mockEmployee = {
            Email: 'test@example.com',
            Password: 'wrongpassword'
        };

        req.body = {
            email: 'test@example.com',
            password: 'password123'
        };

        employee.findOne.mockResolvedValue(mockEmployee);

        await login_controller.post_login(req, res);

        const responseData = JSON.parse(res._getData());
        
        expect(res.statusCode).toBe(401);
        expect(responseData).toEqual({
            message: 'Incorrect Credentials!'
        });
    });

    it('should return 500 if there is an error in the server', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'password123'
        };

        employee.findOne.mockRejectedValue(new Error('Database Error'));

        await login_controller.post_login(req, res);

        const responseData = JSON.parse(res._getData());

        expect(res.statusCode).toBe(500);
        expect(responseData).toEqual({
            success: false,
            message: 'Login Controller Error!'
        });
    });
});