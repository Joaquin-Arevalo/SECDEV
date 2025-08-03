const employee = require('../models/employee_model.js');

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const login_controller = {
  post_login: async function(req, res) {
    const { email, password } = req.body;

    try {
      const user = await employee.findOne({ Email: email });

      if (!user) {
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
          return res.status(403).json({ message: "Account locked due to too many failed attempts." });
        }

        await user.save();
        return res.status(401).json({ message: "Incorrect Credentials!" });
      }

      // ✅ Successful login — reset lock/attempts
      user.FailedAttempts = 0;
      user.LockUntil = null;
      await user.save();

      req.session.Email = email;
      req.session.Employee_Type = user.Employee_Type;

      // Keep existing redirect logic
      if (user.Employee_Type === "Employee") {
        res.status(200).json({ success: true, type: "Employee", message: "Login Successful!" });
      } else if (user.Employee_Type === "Work From Home") {
        res.status(200).json({ success: true, type: "Work From Home", message: "Login Successful!" });
      } else if (user.Employee_Type === "Manager") {
        res.status(200).json({ success: true, type: "Manager", message: "Login Successful!" });
      } else {
        res.status(200).json({ success: true, type: "Admin", message: "Login Successful!" });
      }

    } catch (error) {
      console.error("Error in post_login:", error);
      res.status(500).json({ success: false, message: "Login Controller Error!" });
    }
  }
};

module.exports = login_controller;
