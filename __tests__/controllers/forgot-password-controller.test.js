const forgot_password_controller = require('../../controllers/forgot-password-controller.js');
const forgot_password = require('../../models/forgot_password_model.js');
const employee = require('../../models/employee_model.js');
const database = require('../../models/database.js');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/forgot_password_model.js');
jest.mock('../../models/employee_model.js');
jest.mock('../../models/database.js');

describe('fogot-password-controller', () => {
    describe('post_add_forgot_password', () => {

        let req, res;

        beforeEach(() => {
            req = httpMocks.createRequest({
                body: {
                    email: 'test@example.com',
                    cTime: new Date()
                }
            });
        });

        res = httpMocks.createResponse();

        it('should add a new forgot password record', async () => {

        const mockUser = { First_Name: 'John', Last_Name: 'Doe' };
        const mockCount = 5;
        const mockNewForgotPassword = {
            save: jest.fn().mockResolvedValue(true)
        };

        employee.findOne.mockResolvedValue(mockUser);
        database.findOne.mockResolvedValue(null);
        forgot_password.countDocuments.mockResolvedValue(mockCount);
        forgot_password.mockImplementation(() => mockNewForgotPassword);

        await forgot_password_controller.post_add_forgot_password(req, res);

        const responseData = JSON.parse(res._getData());

        expect(employee.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
        expect(database.findOne).toHaveBeenCalledWith(forgot_password, { Email: 'test@example.com' });
        expect(forgot_password.countDocuments).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual({ success: true, message: "Forgot Password Successful!" });

        });
        
        //failed
        it('should handle errors when saving the forgot password record', async () => {

            const mockUser = { First_Name: 'John', LastName: 'Doe' };
            const mockCount = 5;

            const mockNewForgotPassword = {
                save: jest.fn().mockRejectedValue(new Error('Save failed'))
            };

            employee.findOne.mockResolvedValue(mockUser);
            database.findOne.mockResolvedValue(null);
            forgot_password.countDocuments.mockResolvedValue(mockCount);
            forgot_password.mockImplementation(() => mockNewForgotPassword);

            await forgot_password_controller.post_add_forgot_password(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getData()).toEqual({ success: false, message: "Forgot Password Controller Error!" });
        });

        //fail
        it('should return an error if the email does not exist', async () => {
            
            employee.findOne.mockResolvedValue(null);

            await forgot_password_controller.post_add_forgot_password(req, res);

            const responseData = JSON.parse(res._getData());

            expect(res.statusCode).toBe(500);
            expect(responseData).toEqual({ success: false, message: "Email Does Not Exist." });
        });

        //fail
        it('should return an error if a record already exists', async () => {

            const mockUser = { First_Name: 'John', Last_Name: 'Doe' };

            employee.findOne.mockResolvedValue(mockUser);
            database.findOne.mockResolvedValue({}); //existing record

            await forgot_password_controller.post_add_forgot_password(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getData()).toEqual({ success: false, message: "Forgot Password Already Exist." });
        });
    });
});

describe('post_delete_forgot_password', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest({
            body: {
                email: 'test@example.com'
            }
        });

        res = httpMocks.createResponse();
    });

    it('should delete the record successfully', async () => {
        const mockForgotPassword = { Forgot_Password_Number: 1 };

        forgot_password.findOne.mockResolvedValue(mockForgotPassword);
        forgot_password.deleteOne.mockResolvedValue(true);
        forgot_password.updateMany.mockResolvedValue(true);

        await forgot_password_controller.post_delete_forgot_password(req, res);

        const responseData = JSON.parse(res._getData());

        expect(forgot_password.findOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
        expect(forgot_password.deleteOne).toHaveBeenCalledWith({ Email: 'test@example.com' });
        expect(forgot_password.updateMany).toHaveBeenCalledWith(
            { Forgot_Password_Number: { $gt: 1 } },
            { $inc: { Forgot_Password_Number: -1 } }
        );

        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual({ message: "Forgot Password Record Deleted Successfully." , success: true});
    });

    it('should handle errors during deletion', async () => {

        forgot_password.findOne.mockResolvedValue({ Forgot_Password_Number: 1 });
        forgot_password.deleteOne.mockRejectedValue(new Error('Deletion error'));

        await forgot_password_controller.post_delete_forgot_password(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toBe('Internal Server Error!');
    });

    it('should return an error if record is not found', async () => {
        forgot_password.findOne.mockResolvedValue(null);

        await forgot_password_controller.post_delete_forgot_password(req, res);

        const responseData = JSON.parse(res._getData());

        expect(res.statusCode).toBe(404);
        expect(responseData).toEqual({ success: false, message: "Forgot Password Record Not Found." });
    });
});