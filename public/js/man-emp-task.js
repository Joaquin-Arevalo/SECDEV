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
        attachActnBtns();
        taskUpdate();
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
            attachActnBtns();
            taskUpdate();
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
                attachActnBtns();
                taskUpdate();
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

async function taskUpdate(){
    const confirmBtn = document.getElementById("edit-task-button");
    confirmBtn.addEventListener("click", async function () {
        const employee = document.getElementById("emp-dropdown-id-task-edit").value;
        const taskName = document.getElementById("taskNameEdit").value;
        const taskDesc = document.getElementById("taskDescEdit").value;
        const taskId = document.getElementById("taskIdEdit").value;

        if (employee === "Select" || !taskName || !taskDesc) {
            alert("Please complete all fields.");
            togglePopup3(); // close popup if needed
            return;
        }

        try {
            const response = await fetch("/man_edit_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskID: taskId,
                    email: employee,
                    taskName: taskName,
                    taskDescription: taskDesc
                })
            });

            const result = await response.json();
            if (result.success) {
                togglePopup3();  // close first popup
                togglePopup4(); // open success popup
                document.getElementById("task-register-form").reset();
                dropdown();
                taskSubmit();
                attachActnBtns();
                taskUpdate();
            } else {
                alert("Failed to assign task: " + result.message);
                togglePopup3();  // close popup
            }
        } catch (err) {
            console.error("Error saving task:", err);
            alert("Error saving task.");
            togglePopup3();  // close popup
        }
    });
}


async function attachActnBtns(){
    // DELETE task
    document.querySelectorAll(".delete-task-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const taskId = btn.dataset.taskId;
            if (confirm("Are you sure you want to delete this task?")) {
                const res = await fetch(`/man_delete_task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId })
                });

                const data = await res.json();
                alert(data.message);
                if (data.success) location.reload();
            }
        });
    });

    // COMPLETE task
    document.querySelectorAll(".complete-task-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if(confirm("Are you sure you want to set this task as completed?")){
                const taskId = btn.dataset.taskId;
                const res = await fetch(`/man_complete_task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId })
                });

                const data = await res.json();
                alert(data.message);
                if (data.success) location.reload(); 
            }
            
        });
    });
}






function togglePopup(){
    document.getElementById("popup-2").classList.toggle("active");
}
function togglePopup2(){
    document.getElementById("popup-3").classList.toggle("active");
};

function togglePopup3(){
    document.getElementById("popup-4").classList.toggle("active");
}
function togglePopup4(){
    document.getElementById("popup-5").classList.toggle("active");
};


function toggleTaskFormPopup() {
    const popup = document.getElementById("popup-task-form");
    popup.classList.toggle("active");
};

function toggleEditPopup(btn) {
    document.getElementById("popup-man-edit").classList.toggle("active");

    if (btn) {
        const taskId = btn.dataset.taskId;
        document.getElementById("taskIdEdit").value = taskId;
    }
}

