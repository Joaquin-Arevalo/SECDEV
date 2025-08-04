const employee = require('../models/employee_model.js');
const bcrypt = require('bcrypt');
const logger = require('../logger');

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const login_controller = {
  post_login: async function(req, res) {
    const { email, password } = req.body;

    try {
      const user = await employee.findOne({ Email: email });

      if (!user) {
        logger.logLoginFailure(email);
        return res.status(404).json({ message: "Incorrect Credentials!" });
      }

      // Account locked check
      if (user.LockUntil && user.LockUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.LockUntil - Date.now()) / 60000);
        return res.status(403).json({ message: `Account locked. Try again in ${minutesLeft} minute(s).` });
      }

      // Password check
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        user.FailedAttempts = (user.FailedAttempts || 0) + 1;

        if (user.FailedAttempts >= MAX_ATTEMPTS) {
          user.LockUntil = new Date(Date.now() + LOCK_TIME_MS);
          await user.save();

          logger.logLoginFailure(email);
          return res.status(403).json({ message: "Account locked due to too many failed attempts." });
        }

        await user.save();
        logger.logLoginFailure(email);
        return res.status(401).json({ message: "Incorrect Credentials!" });
      }

      // ✅ Successful login
      req.session.Email = email;
      req.session.Employee_Type = user.Employee_Type;
      req.session.Security_Question = user.Security_Questions;
      req.session.LCF = user.Last_Successful_Login.toLocaleString("en-PH", { timeZone: "Asia/Manila" });

      user.FailedAttempts = 0;
      user.LockUntil = null;
      user.Last_Successful_Login = new Date();
      await user.save();

      logger.logLoginSuccess(email);

      // Respond based on role
      res.status(200).json({
        success: true,
        type: user.Employee_Type,
        message: "Login Successful!",
        sec_check: user.Security_Questions
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
};

module.exports = login_controller;
