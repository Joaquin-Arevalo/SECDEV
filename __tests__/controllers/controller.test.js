const controller = require('../../controllers/controller.js'); 
const httpMocks = require('node-mocks-http');

describe('controller tests', () => {

    it('should set status 204 for favicon', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        controller.getFavicon(req, res);

        expect(res.statusCode).toBe(204);
    })

    it('should render login-page', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const renderSpy = jest.spyOn(res, 'render');

        controller.get_index(req, res);

        expect(renderSpy).toHaveBeenCalledWith('login-page');
    })
})