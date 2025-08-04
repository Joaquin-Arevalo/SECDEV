/*
Functions:
-Request to server-side for new employee creation with the details inputted
*/

document.addEventListener("DOMContentLoaded", function(){

    fetch("/display_change")
    .then(response =>{
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html =>{
        document.body.innerHTML = html;
        register_function();
        attach_button();
    })
    .catch(error =>{
        console.error('Error fetching /display_change', error);
    });
});



async function register_function(){
    // event.preventDefault();

    var register_button_submit = document.getElementById("register-button");
    register_button_submit.addEventListener('click', async function(){
        var a1 = document.getElementById("answerOne").value;
        var a2 = document.getElementById("answerTwo").value;
        var cP = document.getElementById("currPass").value;
        var nP = document.getElementById("newPass").value;
        var nP2 = document.getElementById("newPass2").value;

        if (!cP || !a1 || !nP || !a2 || !nP2) {
            alert("Please fill in all fields");
            return; 
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{16,}$/;
        if (!passwordRegex.test(nP)) {
            alert("Password must be at least 16 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
            return;
        }

        if (!passwordRegex.test(nP2)) {
            alert("Password must be at least 16 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
            return;
        }

        try{
            const response = await fetch('/save_change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    A1: a1,
                    A2: a2,
                    CP: cP,
                    NP: nP,
                    NP2: nP2,
                }),
            });
            const data = await response.json();
            if(data.success){
                togglePopup();
                togglePopup2();
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }else{
                console.log(data.message);
            }
        }catch(error){
            console.error(error);
        }
    });
}


function togglePopup(){
    document.getElementById("popup-2").classList.toggle("active");
}
function togglePopup2(){
    document.getElementById("popup-3").classList.toggle("active");
};

function attach_button(){
    let eyeicon1 = document.getElementById("eye-icon-1");
    let eyeicon2 = document.getElementById("eye-icon-2");
    let eyeicon3 = document.getElementById("eye-icon-3");
    let eyeicon4 = document.getElementById("eye-icon-4");
    let eyeicon5 = document.getElementById("eye-icon-5");

    let a1 = document.getElementById("answerOne");
    let a2 = document.getElementById("answerTwo");
    let cp = document.getElementById("currPass");
    let np = document.getElementById("newPass");
    let np2 = document.getElementById("newPass2");

    eyeicon1.onclick = function(){
        if(a1.type == "password"){
            a1.type = "text";
            eyeicon1.className = "fi fi-rr-eye pw-icon";
        }else{
            a1.type = "password";
            eyeicon1.className = "fi fi-rr-eye-crossed pw-icon";
        }
    }

    eyeicon2.onclick = function(){
        if(a2.type == "password"){
            a2.type = "text";
            eyeicon2.className = "fi fi-rr-eye pw-icon";
        }else{
            a2.type = "password";
            eyeicon2.className = "fi fi-rr-eye-crossed pw-icon";
        }
    }

    eyeicon3.onclick = function(){
        if(cp.type == "password"){
            cp.type = "text";
            eyeicon3.className = "fi fi-rr-eye pw-icon";
        }else{
            cp.type = "password";
            eyeicon3.className = "fi fi-rr-eye-crossed pw-icon";
        }
    }

    eyeicon4.onclick = function(){
        if(np.type == "password"){
            np.type = "text";
            eyeicon4.className = "fi fi-rr-eye pw-icon";
        }else{
            np.type = "password";
            eyeicon4.className = "fi fi-rr-eye-crossed pw-icon";
        }
    }

    eyeicon5.onclick = function(){
        if(np2.type == "password"){
            np2.type = "text";
            eyeicon5.className = "fi fi-rr-eye pw-icon";
        }else{
            np2.type = "password";
            eyeicon5.className = "fi fi-rr-eye-crossed pw-icon";
        }
    }
}
