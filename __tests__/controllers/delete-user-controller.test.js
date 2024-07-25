const delete_user_controller = require('../../controllers/delete-user-controller.js'); 
const httpMocks = require('node-mocks-http');
const database = require('../../models/database.js');
const employee = require('../../models/employee_model.js');
const forgot_password = require('../../models/forgot_password_model.js');

jest.mock('../../models/database.js');
jest.mock('../../models/employee_model.js');
jest.mock('../../models/forgot_password_model.js');

it('should render the delete-user page', () => {
    
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const renderSpy = jest.spyOn(res, 'render');

    delete_user_controller.get_delete_user_page(req, res);

    expect(renderSpy).toHaveBeenCalledWith('delete-user');
});

it('should render delete-user page with employee emails', async () => {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const renderSpy = jest.spyOn(res, 'render');
    
    const mockEmployees = [
        { Email: 'test1@example.com' },
        { Email: 'test2@example.com' }
    ];

    database.findMany.mockResolvedValue(mockEmployees);

    await delete_user_controller.get_delete_user(req, res);

    expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
    expect(renderSpy).toHaveBeenCalledWith('delete-user', { emp_emails: mockEmployees });
});

it('should render delete-user page with specific employee details', async () => {

    const req = httpMocks.createRequest({ body: { email: 'test@example.com' } });
    const res = httpMocks.createResponse();
    const renderSpy = jest.spyOn(res, 'render');
    const mockEmployee = { Email: 'test@example.com', Name: 'John Doe' };
    const mockEmployees = [{ Email: 'test@example.com' }];

    database.findMany.mockResolvedValue(mockEmployees);
    employee.findOne.mockResolvedValue(mockEmployee);

    await delete_user_controller.post_display_info(req, res);

    expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(renderSpy).toHaveBeenCalledWith('delete-user', { emp_sum: mockEmployee, emp_emails: mockEmployees });
});


it('should delete user and forgot_password entry and update forgot password numbers', async () => {

    const req = httpMocks.createRequest({ body: { email: 'test@example.com' } });
    const res = httpMocks.createResponse();
    const mockEmployee = { Email: 'test@example.com' };
    const mockForgotPassword = { Forgot_Password_Number: 1 };

    employee.findOne.mockResolvedValue(mockEmployee);
    forgot_password.findOne.mockResolvedValue(mockForgotPassword);
    forgot_password.deleteOne.mockResolvedValue();
    forgot_password.updateMany.mockResolvedValue();
    employee.deleteOne.mockResolvedValue();

    await delete_user_controller.post_delete_user(req, res);

    expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(forgot_password.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(forgot_password.deleteOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(forgot_password.updateMany).toHaveBeenCalledWith({ Forgot_Password_Number: { $gt: 1 } }, { $inc: { Forgot_Password_Number: -1 } });

    expect(employee.deleteOne).toHaveBeenCalledWith(mockEmployee);
    expect(res._getData()).toEqual(JSON.stringify({ success: true, message: "Deletion successful!" }));
});


it('should delete user without updating forgot_password count', async () => {

    const req = httpMocks.createRequest({ body: { email: 'test@example.com' } });
    const res = httpMocks.createResponse();
    const mockEmployee = { Email: 'test@example.com' };

    employee.findOne.mockResolvedValue(mockEmployee);
    forgot_password.findOne.mockResolvedValue(null);
    employee.deleteOne.mockResolvedValue();

    await delete_user_controller.post_delete_user(req, res);

    expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(forgot_password.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
    expect(employee.deleteOne).toHaveBeenCalledWith(mockEmployee);
    expect(res._getData()).toEqual(JSON.stringify({ success: true, message: "Deletion successful!" }));
});

it('should return 400 if user does not exist', async () => {
    
    const req = httpMocks.createRequest({ body: { email: 'nonexistent@example.com' } });
    const res = httpMocks.createResponse();
    const statusSpy = jest.spyOn(res, 'status');
    const jsonSpy = jest.spyOn(res, 'json');

    employee.findOne.mockResolvedValue(null);

    await delete_user_controller.post_delete_user(req, res);

    expect(employee.findOne).toHaveBeenCalledWith({ Email: 'nonexistent@example.com' });
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ message: "There are no Existing Users!" });
});



