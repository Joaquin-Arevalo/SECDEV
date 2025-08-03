/*
Functions:
-Request data for Admin: Employee Management - Employee Information Page depenging on the chosen employee
*/

var curr_emp;

document.addEventListener("DOMContentLoaded", function(){
    fetch("/display_employee_records_man")
    .then(response =>{
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html =>{
        document.body.innerHTML = html;
    })
    .catch(error =>{
        console.error('Error fetching /display_employee_records_man', error);
    });
});

function displayInfo(){
    var selectedEmployee = document.getElementById("selectedEmployee");
    var selectedEmployeeEmail = selectedEmployee.options[selectedEmployee.selectedIndex].text;
    curr_emp = selectedEmployeeEmail;

    fetch('/display_specific_employee_records_man', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: selectedEmployeeEmail }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.body.innerHTML = html;
        document.getElementById("current-emp-option").innerHTML = curr_emp;
        document.getElementById('weekly-payroll').addEventListener('click', function() {
            window.location.href = 'man_empman_payroll';
            console.log('Clicked');
        });
    })
    .catch(error => {
        console.error('Error fetching /display_specific_employee_records_man', error);
    });
}
