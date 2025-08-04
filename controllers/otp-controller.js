/*
Functions:
- Generate and store a new OTP
- Verify if the submitted OTP is valid
*/

const Current_otp = require('../models/otp_model.js');
const logger = require('../logger');

const MAX_OTP_LENGTH = 4;

const otp_controller = {
  // Generate a 4-digit numeric OTP and store it
  post_generate_otp: async (req, res) => {
    try {
      const randomNumber = Math.floor(Math.random() * 9000 + 1000); // Generates 1000-9999

      // Optional: remove previous OTP to ensure only 1 active
      await Current_otp.findOneAndDelete().sort({ _id: 1 });

      const number = new Current_otp({ current_otp: randomNumber });
      await number.save();

      const userEmail = req.session?.Email || 'Unknown User';
      logger.logGeneric(`OTP GENERATED for ${userEmail}`);
      res.status(201).json({ message: 'OTP generated and stored successfully' });
    } catch (err) {
      console.error("OTP Generation Error:", err);
      res.status(500).send("Internal Server Error!");
    }
  },

  // Verify the OTP submitted by user
  post_verify_otp: async (req, res) => {
    try {
      const { otp } = req.body;

      // Input validation: must be a 4-digit number
      if (!otp || !/^\d{4}$/.test(otp)) {
        logger.logOTPVerification(userEmail, false); //invalid input
        return res.status(400).json({ message: 'Invalid OTP format. Must be a 4-digit number.' });
      }

      const storedNumber = await Current_otp.findOne().sort({ _id: -1 });

      if (!storedNumber) {
        logger.logOTPVerification(userEmail, false); //no otp yet
        return res.status(404).json({ message: 'No OTP generated yet.' });
      }

      const correctNumber = storedNumber.current_otp;

      if (parseInt(otp) === correctNumber) {
        logger.logOTPVerification(userEmail, true); //Success
        return res.status(200).json({ success: true, message: 'OTP verified successfully!' });
      } else {
        logger.logOTPVerification(userEmail, false); //fail
        return res.status(401).json({ success: false, message: 'Incorrect OTP.' });
      }

    } catch (err) {
      console.error("OTP Verification Error:", err);
      res.status(500).send("Internal Server Error!");
    }
  }
};

module.exports = otp_controller;
