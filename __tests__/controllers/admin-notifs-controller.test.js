const admin_notifs_controller = require('../../controllers/admin-notifs-controller');
const database = require('../../models/database');
const forgot_password = require('../../models/forgot_password_model');

jest.mock('../../models/database');
jest.mock('../../models/forgot_password_model');

describe('get_admin_notifs', () => {
    it('should render the admin-notifs page', () => {

        const req = {};
        const res = { render: jest.fn() };

        admin_notifs_controller.get_admin_notifs(req, res);

        expect(res.render).toHaveBeenCalledWith('admin-notifs');
    });
});

describe('get_forgot_password', () => {
    it('should render the admin-notifs page with sorted forgot password data', async () => {
        const req = {};
        const res = { render: jest.fn() };
        const mockData = [
            { Forgot_Password_Number: 2, otherData: 'A' },
            { Forgot_Password_Number: 1, otherData: 'B' },
            { Forgot_Password_Number: 3, otherData: 'C' },
        ];

        database.findMany.mockResolvedValue(mockData);

        await admin_notifs_controller.get_forgot_password(req, res);

        expect(res.render).toHaveBeenCalledWith('admin-notifs', {
            emp_forgot_password: [
                { Forgot_Password_Number: 1, otherData: 'B' },
                { Forgot_Password_Number: 2, otherData: 'A' },
                { Forgot_Password_Number: 3, otherData: 'C' },
            ]
        });
    });

    //failed
    it('should handle errors and return 500 status', async () => {
        
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        //mock error
        database.findMany.mockRejectedValue(new Error('Database error'));

        await admin_notifs_controller.get_forgot_password(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error!'); 
    })
});