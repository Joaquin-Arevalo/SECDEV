/*
Functions:
-Request to server-side for Admin: Employee Management - Weekly Payroll data depending on the employee and week chosen
-Request to server-side for updating the employee payroll data depending on the employee and week chosen
*/

var curr_emp;

document.addEventListener("DOMContentLoaded", function(){
    fetch("/employee_task")
    .then(response =>{
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html =>{
        document.body.innerHTML = html; 
        //document.getElementById("select-week-dropdown-id").style.visibility = "hidden";
        taskSubmit();
        attachActnBtns();
        taskUpdate();
    })
    .catch(error =>{
        console.error('Error fetching /emp_employee_total:', error);
    });
    
});

async function taskSubmit(){
    const confirmBtn = document.getElementById("task-button");
    confirmBtn.addEventListener("click", async function () {
        const taskName = document.getElementById("taskName").value;
        const taskDesc = document.getElementById("taskDesc").value;

        if (!taskName || !taskDesc) {
            alert("Please complete all fields.");
            togglePopup(); // close popup if needed
            return;
        }

        try {
            const response = await fetch("/emp_assign_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskName: taskName,
                    taskDescription: taskDesc
                })
            });

            const result = await response.json();
            if (result.success) {
                togglePopup();  // close first popup
                togglePopup2(); // open success popup
                document.getElementById("task-register-form").reset();
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
        const taskName = document.getElementById("taskNameEdit").value;
        const taskDesc = document.getElementById("taskDescEdit").value;
        const taskId = document.getElementById("taskIdEdit").value;

        if (!taskName || !taskDesc) {
            alert("Please complete all fields.");
            togglePopup3(); // close popup if needed
            return;
        }

        try {
            const response = await fetch("/emp_edit_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskID: taskId,
                    taskName: taskName,
                    taskDescription: taskDesc
                })
            });

            const result = await response.json();
            if (result.success) {
                togglePopup3();  // close first popup
                togglePopup4(); // open success popup
                document.getElementById("task-register-form").reset();
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
                const res = await fetch(`/emp_delete_task`, {
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
                const res = await fetch(`/emp_complete_task`, {
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

