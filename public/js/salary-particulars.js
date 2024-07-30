document.addEventListener("DOMContentLoaded", function(){
    fetch("/salary_particulars")
    .then(response =>{
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html =>{
        document.body.innerHTML = html;
        print_function();
    })
    .catch(error =>{
        console.error('Error fetching /salary_paraticulars', error);
    });

    function print_function(){
        var print_button = document.getElementById("print-button");
        print_button.addEventListener('click', print_salary_particular);

        async function print_salary_particular(event){
            event.preventDefault();

            try{
                const response = await fetch('/print_salary_particulars', {
                    method: 'POST',
                });
            }catch(error){
                console.error(error);
            }
        }
    }

    
});