const admin_empman_emprecs = require('../controllers/admin-empman-emprecs-controller');
const employee = require('../models/employee_model.js');
const database = require('../models/database.js');
const httpMocks = require('node-mocks-http');

jest.mock('../models/database.js');
jest.mock('../models/employee_model.js');

afterEach(() => {
    jest.resetAllMocks();
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
        await admin_empman_emprecs.get_emprecs(req, res);

        //verify
        expect(database.findMany).toHaveBeenCalledWith(employee, { $or: [{ Employee_Type: "Employee" }, { Employee_Type: "Work From Home" }, { Employee_Type: "Admin" }] });
        expect(res.render).toHaveBeenCalledWith("admin-empman-emprecs", { emp_emails: employees });
    });
});