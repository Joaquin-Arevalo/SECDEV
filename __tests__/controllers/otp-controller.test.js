const httpMocks = require('node-mocks-http');
const otp_controller = require('../../controllers/otp-controller.js');
const Current_otp = require('../../models/otp_model.js');

jest.mock('../../models/otp_model.js');

describe('otp-controller', () => {

    describe('post_generate-otp', () => {
        //fail
        it('should generate and store OTP successfully', async () => {
            
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            Current_otp.findOneAndDelete = jest.fn().mockResolvedValue(null);

            const mockSave = jest.fn().mockResolvedValue();
            Current_otp.mockImplementation(() => ({
                save: mockSave
            }));
           
            await otp_controller.post_generate_otp(req, res);

            expect(Current_otp.findOneAndDelete).toHaveBeenCalled();
            expect(mockSave).toHaveBeenCalled();
            expect(res.statusCode).toBe(201);
            expect(res._getData()).toEqual(JSON.stringify({ message: 'otp generated and stored successfully' }));
        });

         it('should handle errors when generating OTP', async () => {
            
            Current_otp.findOneAndDelete.mockRejectedValue(new Error('Database Error'));

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            
            await otp_controller.post_generate_otp(req, res);

            // Assertions
            expect(res.statusCode).toBe(500);
            expect(res._getData()).toBe('Internal Server Error!');
        });
    });

    describe('post_verify_otp', () => {

        //fail
        it('should retrieve the correct OTP', async () => {
            const mockOtp = { current_otp: 1234 };
            Current_otp.findOne.mockResolvedValue(mockOtp);

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await otp_controller.post_verify_otp(req, res);

            expect(Current_otp.findOne).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res._getData()).toEqual(JSON.stringify({ correctNumber: 1234 }));
        });

        //fail
        it('should return 404 if no OTP has been generated', async () => {

            Current_otp.findOne.mockResolvedValue(null);

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await otp_controller.post_verify_otp(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getData()).toEqual(JSON.stringify({ message: 'No otp generated yet' }));
        });

        //fail
        it('should return 500 if an error occurs during OTP verification', async () => {
            
            Current_otp.findOne.mockRejectedValue(new Error('Database Error'));

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await otp_controller.post_verify_otp(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getData()).toBe("Internal Server Error!");
        });


    });
});