const httpMocks = require('node-mocks-http');
const logout_controller = require('../../controllers/logout-controller');

describe('logout-controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            session: {
                destroy: jest.fn((callback) => callback()) 
            }
        };
        res = {
            redirect: jest.fn() 
        };
    });
    
    describe('get_logout', () => {
        it('should destroy the session and redirect to the homepage', () => {
            logout_controller.get_logout(req, res);

            //verify that the session was destroyed
            expect(req.session.destroy).toHaveBeenCalled();
            //verify that the user was redirected to another page
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should handle errors during session destruction', () => {
            //simulate error 
            const error = new Error('Session destroy failed');
            req.session.destroy = jest.fn((callback) => callback(error));

            //verify that an error was thrown
            expect(() => logout_controller.get_logout(req, res)).toThrow(error);
        });
    })
});