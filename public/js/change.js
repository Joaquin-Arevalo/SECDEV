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
    })
    .catch(error =>{
        console.error('Error fetching /display_change', error);
    });


    var register_button_submit = document.getElementById("register-button");
    register_button_submit.addEventListener('click', register_function);

    async function register_function(event){
        event.preventDefault();

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
    }


})
function togglePopup(){
    document.getElementById("popup-2").classList.toggle("active");
}
function togglePopup2(){
    document.getElementById("popup-3").classList.toggle("active");
};
