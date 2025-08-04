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
            const isMatch = await bcrypt.compare(password, user.Password);

      if (!user) {
        logger.logLoginFailure(email);
        return res.status(404).json({ message: "Incorrect Credentials!" });
      }

      // Check if account is locked
      if (user.LockUntil && user.LockUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.LockUntil - Date.now()) / 60000);
        return res.status(403).json({ message: `Account locked. Try again in ${minutesLeft} minute(s).` });
      }

      // Wrong password
      if (password !== user.Password) {
        user.FailedAttempts = (user.FailedAttempts || 0) + 1;

        if (user.FailedAttempts >= MAX_ATTEMPTS) {
          user.LockUntil = new Date(Date.now() + LOCK_TIME_MS);
          await user.save();

          logger.logLoginFailure(email); //log lock out
          return res.status(403).json({ message: "Account locked due to too many failed attempts." });
        }

        await user.save();
        logger.logLoginFailure(email); //log incorrect password
        return res.status(401).json({ message: "Incorrect Credentials!" });
      }

      // ✅ Successful login — reset lock/attempts
      user.FailedAttempts = 0;
      user.LockUntil = null;
      await user.save();

      req.session.Email = email;
      req.session.Employee_Type = user.Employee_Type;
            if(!user_exists){
                return res.status(404).json({message: "Incorrect Credentials!"});
            }else if(!isMatch) {
                return res.status(401).json({ message: "Incorrect Credentials!" });
            }else{
                req.session.Email = email;
                req.session.Employee_Type = user_exists.Employee_Type;
                req.session.Security_Question = user_exists.Security_Questions;
                req.session.LCF = user_exists.Last_Successful_Login.toLocaleString("en-PH", { timeZone: "Asia/Manila" });

      logger.logLoginSuccess(email); //log successful login

      // Keep existing redirect logic
      if (user.Employee_Type === "Employee") {
        res.status(200).json({ success: true, type: "Employee", message: "Login Successful!" , sec_check: user_exists.Security_Questions});
      } else if (user.Employee_Type === "Work From Home") {
        res.status(200).json({ success: true, type: "Work From Home", message: "Login Successful!" , sec_check: user_exists.Security_Questions});
      } else if (user.Employee_Type === "Manager") {
        res.status(200).json({ success: true, type: "Manager", message: "Login Successful!" , sec_check: user_exists.Security_Questions});
      } else {
        res.status(200).json({ success: true, type: "Admin", message: "Login Successful!" , sec_check: user_exists.Security_Questions});
      }
                //update here

                user.Last_Successful_Login = new Date();
                await user.save();

    
  }
};

module.exports = login_controller;
