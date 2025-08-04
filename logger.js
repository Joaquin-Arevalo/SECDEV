// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'security.log');

// Ensure logs directory exists
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'));
}

function writeLog(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  fs.appendFile(logFilePath, entry, (err) => {
    if (err) console.error('Failed to write to log:', err);
  });
}

module.exports = {
  logLoginSuccess: (email) => writeLog(`LOGIN SUCCESS - ${email}`),
  logLoginFailure: (email) => writeLog(`LOGIN FAILURE - ${email}`),
  logOTPVerification: (email, success) => writeLog(`OTP ${success ? 'SUCCESS' : 'FAILURE'} - ${email}`),
  logPasswordChange: (email, success) => writeLog(`PASSWORD CHANGE ${success ? 'SUCCESS' : 'FAILURE'} - ${email}`),
  logDataUpdate: (email, action, target) => writeLog(`DATA ${action.toUpperCase()} by ${email} on ${target}`),
  logAccessDenied: (email, page) => writeLog(`ACCESS DENIED - ${email} tried to access ${page}`),
  logGeneric: writeLog,
  logFilePath
};
