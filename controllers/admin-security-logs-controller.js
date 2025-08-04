const fs = require('fs');
const path = require('path');
const logger = require('../logger');

exports.get_admin_security_logs = (req, res) => {
  fs.readFile(logger.logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading logs:', err);
      return res.status(500).send('Unable to load logs.');
    }

    // Trim to remove any trailing newline
    const logLines = data.trim().split('\n').reverse();
    res.render('admin-security-logs', { logs: logLines });
  });
};

//module.exports = admin_security_logs_controller;
