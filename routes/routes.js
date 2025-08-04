/*
Functions:
-Routing of the web service pages and CRUD operations
-Routing access limitations depending if the employee is logged in and employee type
*/

const controllers = require('../controllers/controller');
const login = require('../controllers/login-controller');
const empDash = require('../controllers/employee-dashboard-controller');
const empClock = require('../controllers/employee-clockpage-controller');
const logout = require('../controllers/logout-controller');
const otp = require('../controllers/otp-controller');
const adminLogs = require('../controllers/admin-dash-logs-controller');
const delUser = require('../controllers/delete-user-controller');
const adminEmpRecs = require('../controllers/admin-empman-emprecs-controller');
const adminPayroll = require('../controllers/admin-empman-payroll-controller');
const updatePayroll = require('../controllers/update-payroll-controller');
const forgotPwd = require('../controllers/forgot-password-controller');
const adminNotifs = require('../controllers/admin-notifs-controller');
const registerCtl = require('../controllers/register-controller');

const empSP = require('../controllers/employee-salary-particulars-controller');
const adminSP = require('../controllers/admin-salary-particulars-controller');

// secdev ++
const emp_register = require('../controllers/emp-register-controller');
const manLogs = require('../controllers/manager-dash-logs-controller');
const manEmpRecs = require('../controllers/manager-empman-emprecs-controller');
const manPayroll = require('../controllers/manager-empman-payroll-controller');
const manTasks = require('../controllers/manager-task-controller');
const manSP = require('../controllers/manager-salary-particulars-controller');
const empTasks = require('../controllers/employee-task-controller');
const que = require('../controllers/question-controller');
const cha = require('../controllers/change-controller');
 
const express = require('express');
const router = express.Router();
router.use(express.json());

/* ---------- Auth/Role middleware ---------- */

const redirectByRole = (req, res) => {
  const t = req.session?.Employee_Type;
  if (t === 'Admin')   return res.redirect('/admin_dashboard');
  if (t === 'Manager') return res.redirect('/manager_dashboard');
  if (t === 'Employee') return res.redirect('/employee_clockpage');
  if (t === 'Work From Home') return res.redirect('/work_from_home_clockpage');
  return res.redirect('/');
};


// const isAuthenticated = (req, res, next) =>
//   req.session?.Email ? next() : res.redirect('/');


const isAuthenticated = (req, res, next) => {
  const path = req.path;

  if (!req.session?.Email) {
    return res.redirect('/');
  }

  const bypassPaths = ['/question', '/save_question'];

  if (req.session?.Security_Question === false && !bypassPaths.includes(path)) {
    return res.redirect('/question');
  }

  next();
};



const isLoggedOut = (req, res, next) =>
  !req.session?.Email ? next() : redirectByRole(req, res);

const allowRoles = (...roles) => (req, res, next) =>
  roles.includes(req.session?.Employee_Type) ? next() : redirectByRole(req, res);

/* ---------- Public routes (no auth) ---------- */
router.get('/', isLoggedOut, controllers.get_index);
router.post('/login_account', isLoggedOut, login.post_login);
router.post('/add_forgot_password', isLoggedOut, forgotPwd.post_add_forgot_password);

/* ---------- security questions [SECDEV] ---------- */
router.get('/question', isAuthenticated, que.get_question);
router.post('/save_question', isAuthenticated, que.post_question);

/* ---------- password change [SECDEV] ---------- */
router.get('/display_change', isAuthenticated, cha.get_question);
router.post('/save_change', isAuthenticated, cha.post_change);


/* ---------- self registration [SECDEV] ---------- */
router.get('/emp_register', isLoggedOut, emp_register.get_register);
router.post('/emp_register_employee', isLoggedOut, emp_register.post_register);

/* ---------- Session management ---------- */
router.get('/logout', isAuthenticated, logout.get_logout);

/* ---------- WFH-only ---------- */
router.get('/work_from_home_clockpage',
  isAuthenticated,
  allowRoles('Work From Home'),
  empClock.get_wfh_clockpage
);

/* ---------- Employee-only ---------- */
router.get('/employee_clockpage',
  isAuthenticated,
  allowRoles('Employee'),
  empClock.get_employee_clockpage
);
router.post('/generate_otp',
  isAuthenticated,
  allowRoles('Employee'),
  otp.post_generate_otp
);
router.post('/verify_otp',
  isAuthenticated,
  allowRoles('Employee'),
  otp.post_verify_otp
);

/* ---------- Employee & WFH (common employee functions) ---------- */
router.get('/time_in_status',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empClock.get_employee_time_in_status
);
router.get('/employee_dashboard',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empDash.get_employee_dashboard
);
router.post('/employee_time_in',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empClock.post_employee_time_in
);
router.post('/employee_time_out',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empClock.post_employee_time_out
);
router.post('/retrieve_employee_payroll',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empDash.get_employee_details
);
router.get('/employee_task',
    isAuthenticated,
    allowRoles('Employee', 'Work From Home'),
    empTasks.get_specific_emp_task
)
router.post('/emp_assign_task', isAuthenticated, allowRoles('Employee', 'Work From Home'), empTasks.post_register_task);
router.post('/emp_delete_task', isAuthenticated, allowRoles('Employee', 'Work From Home'), empTasks.delete_task);
router.post('/emp_complete_task', isAuthenticated, allowRoles('Employee', 'Work From Home'), empTasks.complete_task);
router.post('/emp_edit_task', isAuthenticated, allowRoles('Employee', 'Work From Home'), empTasks.edit_task);

/* ---------- Salary Particulars ---------- */
router.get('/salary_particulars',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empSP.get_salary_particulars
);
router.post('/print_salary_particulars',
  isAuthenticated,
  allowRoles('Employee', 'Work From Home'),
  empSP.post_print_salary_particulars
);

router.get('/admin_salary_particulars',
  isAuthenticated,
  allowRoles('Admin'),
  adminSP.get_salary_particulars
);
router.get('/admin_retrieve_employee_total_sp',
  isAuthenticated,
  allowRoles('Admin'),
  adminSP.get_emp_total
);
router.get('/admin_salary_particulars_employee',
  isAuthenticated,
  allowRoles('Admin'),
  adminSP.get_salary_particulars_employee
);
router.post('/admin_print_salary_particulars',
  isAuthenticated,
  allowRoles('Admin'),
  adminSP.post_print_salary_particulars
);

/* ---------- Admin-only ---------- */
router.get('/admin_dashboard', isAuthenticated, allowRoles('Admin'), adminLogs.get_admin_dash_logs);
router.get('/register',        isAuthenticated, allowRoles('Admin'), registerCtl.get_register);
router.post('/register_employee', isAuthenticated, allowRoles('Admin'), registerCtl.post_register);

router.get('/retrieve_employee_summary',  isAuthenticated, allowRoles('Admin'), adminLogs.get_employee_summary);

router.get('/delete_user',                isAuthenticated, allowRoles('Admin'), delUser.get_delete_user_page);
router.get('/delete_user_employee',       isAuthenticated, allowRoles('Admin'), delUser.get_delete_user);
router.post('/delete_chosen_user',        isAuthenticated, allowRoles('Admin'), delUser.post_delete_user);
router.post('/display_delete_info',       isAuthenticated, allowRoles('Admin'), delUser.post_display_info);

router.get('/admin_empman_payroll',       isAuthenticated, allowRoles('Admin'), adminPayroll.get_admin_empman_payroll);
router.get('/admin_empman_emprecs',       isAuthenticated, allowRoles('Admin'), adminEmpRecs.get_emprecs);
router.post('/display_specific_employee_records', isAuthenticated, allowRoles('Admin'), adminEmpRecs.post_specific_emprecs);
router.get('/admin_retrieve_employee_total_wp',   isAuthenticated, allowRoles('Admin'), adminPayroll.get_emp_total);
router.get('/admin_retrieve_emp_wpay',            isAuthenticated, allowRoles('Admin'), adminPayroll.get_emp_wpay);
router.post('/admin_update_payroll',               isAuthenticated, allowRoles('Admin'), adminPayroll.post_update_payroll);

router.get('/admin_notifs',               isAuthenticated, allowRoles('Admin'), adminNotifs.get_admin_notifs);
router.get('/display_forgot_password',    isAuthenticated, allowRoles('Admin'), adminNotifs.get_forgot_password);
router.post('/delete_forgot_password',    isAuthenticated, allowRoles('Admin'), forgotPwd.post_delete_forgot_password);

/* ------------ Manager-only (SECDEV) ------------ */
router.get('/manager_dashboard', isAuthenticated, allowRoles('Manager'), manLogs.get_manager_dash_logs);

/* ------------ Manager employee records (SECDEV) ------------ */
router.get('/man_empman_emprecs', isAuthenticated, allowRoles('Manager'), manEmpRecs.get_emprecs);
router.post('/display_specific_employee_records_man', isAuthenticated, allowRoles('Manager'), manEmpRecs.post_specific_emprecs);

/* ------------ Manager salary particulars (SECDEV) ------------ */
router.get('/man_salary_particulars', isAuthenticated, allowRoles('Manager'), manSP.get_salary_particulars);
router.get('/man_retrieve_employee_total_sp', isAuthenticated, allowRoles('Manager'), manSP.get_emp_total);
router.get('/man_salary_particulars_employee', isAuthenticated, allowRoles('Manager'), manSP.get_salary_particulars_employee);
router.post('/man_print_salary_particulars', isAuthenticated, allowRoles('Manager'), manSP.post_print_salary_particulars);

/* ------------ Manager payroll (SECDEV) ------------ */
router.get('/man_empman_payroll', isAuthenticated, allowRoles('Manager'), manPayroll.get_man_empman_payroll);
router.get('/man_retrieve_employee_total_wp', isAuthenticated, allowRoles('Manager'), manPayroll.get_emp_total);
router.get('/man_retrieve_emp_wpay', isAuthenticated, allowRoles('Manager'), manPayroll.get_emp_wpay);
router.post('/man_update_payroll', isAuthenticated, allowRoles('Manager'), manPayroll.post_update_payroll);

/* ------------ Manager tasks (SECDEV) ------------ */
router.get('/man_emp_task', isAuthenticated, allowRoles('Manager'), manTasks.get_task);
router.get('/man_employee_total', isAuthenticated, allowRoles('Manager'), manTasks.get_emp_total);
router.get('/man_specific_employee_task', isAuthenticated, allowRoles('Manager'), manTasks.get_specific_emp_task);
router.post('/man_assign_task', isAuthenticated, allowRoles('Manager'), manTasks.post_register_task);
router.post('/man_delete_task', isAuthenticated, allowRoles('Manager'), manTasks.delete_task);
router.post('/man_complete_task', isAuthenticated, allowRoles('Manager'), manTasks.complete_task);
router.post('/man_edit_task', isAuthenticated, allowRoles('Manager'), manTasks.edit_task);

module.exports = router; 