/*
Functions:
-Request to server-side for Admin: Employee Management - Weekly Payroll data depending on the employee and week chosen
-Request to server-side for updating the employee payroll data depending on the employee and week chosen
*/

var curr_emp;

document.addEventListener("DOMContentLoaded", function(){
    fetch("/man_employee_total")
    .then(response =>{
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html =>{
        document.body.innerHTML = html; 
        //document.getElementById("select-week-dropdown-id").style.visibility = "hidden";
        dropdown();
        taskSubmit();
    })
    .catch(error =>{
        console.error('Error fetching /man_employee_total:', error);
    });
    
});

function dropdown(){
    var emp_dropdown_select = document.getElementById("emp-dropdown-id");

    emp_dropdown_select.addEventListener('change', function(){
        const selected_emp = emp_dropdown_select.value;
        curr_emp = selected_emp;

        fetch(`/man_specific_employee_task?employee=${selected_emp}`)
        .then(response =>{
            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html =>{
            document.body.innerHTML = html;
            document.getElementById("current-emp-option").innerHTML = curr_emp;
            // document.getElementById("current-week-option").innerHTML = curr_week;
            dropdown();
            taskSubmit();
        })
        .catch(error =>{
            console.error('Error fetching /man_specific_employee_task:', error);
        });
    })
}

async function taskSubmit(){
    const confirmBtn = document.getElementById("task-button");
    confirmBtn.addEventListener("click", async function () {
        const employee = document.getElementById("emp-dropdown-id-task").value;
        const taskName = document.getElementById("taskName").value;
        const taskDesc = document.getElementById("taskDesc").value;

        console.log("employee: ", employee);

        if (employee === "Select" || !taskName || !taskDesc) {
            alert("Please complete all fields.");
            togglePopup(); // close popup if needed
            return;
        }

        try {
            const response = await fetch("/man_assign_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: employee,
                    taskName: taskName,
                    taskDescription: taskDesc
                })
            });

            const result = await response.json();
            if (result.success) {
                togglePopup();  // close first popup
                togglePopup2(); // open success popup
                document.getElementById("task-register-form").reset();
                dropdown();
                taskSubmit();
            } else {
                alert("Failed to assign task: " + result.message);
                togglePopup();  // close popup
            }
        } catch (err) {
            console.error("Error submitting task:", err);
            alert("Error submitting task.");
            togglePopup();  // close popup
        }
    });
}

function togglePopup(){
    document.getElementById("popup-2").classList.toggle("active");
}
function togglePopup2(){
    document.getElementById("popup-3").classList.toggle("active");
};