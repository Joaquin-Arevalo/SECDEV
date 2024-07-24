const employee = require('../../models/employee_model.js');
const database = require('../../models/database.js');
const httpMocks = require('node-mocks-http');
const admin_empman_emprecs_controller = require('../../controllers/admin-empman-emprecs-controller.js');

jest.mock('../../models/database.js');
jest.mock('../../models/employee_model.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('get_emprecs', () => {
    it('should render employee management page with employee details', async () => {

        //setup
        const employees = [
            { Email: 'b@example.com', Employee_Type: 'Employee' },
            { Email: 'a@example.com', Employee_Type: 'Admin' }
        ];

        database.findMany.mockResolvedValue(employees);

        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        res.render = jest.fn();

        //execute
        await admin_empman_emprecs_controller.get_emprecs(req, res);

        //verify
        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
        expect(res.render).toHaveBeenCalledWith("admin-empman-emprecs", { emp_emails: employees });
    });

    //failed
    it('should handle errors and return 500 status code', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        res.status = jest.fn().mockReturnThis();
        res.send = jest.fn();

        database.findMany.mockRejectedValue(new Error('Database Error'));

        await admin_empman_emprecs_controller.get_emprecs(req, res);

        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error!");
    });

});

describe('post_specific_emprecs', () => {
    it('should render admin-empman-emprecs with sorted employee emails and specific employee summary', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { email: 'a@example.com' }
        });

        const res = httpMocks.createResponse();
        const mockEmployees = [
            { Email: 'z@example.com', Employee_Type: 'Employee' },
            { Email: 'a@example.com', Employee_Type: 'Work From Home' },
            { Email: 'm@example.com', Employee_Type: 'Admin' },
        ];

        const mockEmployeeSummary = { Email: 'a@example.com', Name: 'Alice' };

        database.findMany.mockResolvedValue(mockEmployees);
        employee.findOne.mockResolvedValue(mockEmployeeSummary);

        await admin_empman_emprecs_controller.post_specific_emprecs(req, res);

        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
        expect(employee.findOne).toHaveBeenCalledWith({ Email: 'a@example.com' });
        expect(res._getRenderView()).toBe('admin-empman-emprecs');
        expect(res._getRenderData()).toEqual({
            emp_emails: [
                { Email: 'a@example.com', Employee_Type: 'Work From Home' },
                { Email: 'm@example.com', Employee_Type: 'Admin' },
                { Email: 'z@example.com', Employee_Type: 'Employee' },
            ],
            emp_sum: mockEmployeeSummary,

        });
    });

    //failed
    it('should handle errors and return 500 status code', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { email: 'a@example.com' }
        });

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnThis();
        res.send = jest.fn();

        database.findMany.mockRejectedValue(new Error('Database Error'));

        await admin_empman_emprecs_controller.post_specific_emprecs(req, res);

        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error!");
    });
});