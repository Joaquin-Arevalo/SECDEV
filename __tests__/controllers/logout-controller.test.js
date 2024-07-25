const httpMocks = require('node-mocks-http');
const logout_controller = require('../../controllers/logout-controller');

describe('ogout-controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest({
            session: {
                destroy: jest.fn((callback) => callback(null))
            }
        });

        res = httpMocks.createResponse();
        res.redirect = jest.fn();
    });

    it('should destroy the session and redirect to the homepage', () => {
        logout_controller.get_logout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should handle errors during session destruction', () => {
        req.session.destroy.mockImplementationOnce((callback) => callback(new Error('Session destroy error')));

        expect(() => {
            logout_controller.get_logout(req, res);
        }).toThrow('Session destroy error');
    });
});