/*
Functions:
-Request to server-side for new employee creation with the details inputted
*/

document.addEventListener("DOMContentLoaded", function(){
    var register_button_submit = document.getElementById("register-button");
    register_button_submit.addEventListener('click', register_function);

    async function register_function(event){
        event.preventDefault();

        var q1 = document.getElementById("question-one").value;
        var a1 = document.getElementById("answerOne").value;
        var q2 = document.getElementById("question-two").value;
        var a2 = document.getElementById("answerTwo").value;

        if (!q1 || !a1 || !q2 || !a2) {
            alert("Please fill in all fields");
            return; 
        }

        try{
            const response = await fetch('/save_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionOne: q1,
                    answerOne: a1,
                    questionTwo: q2,
                    answerTwo: a2,
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
