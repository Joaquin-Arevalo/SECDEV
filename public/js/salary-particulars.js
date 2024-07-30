document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded, starting fetch for /salary_particulars");
    fetch("/salary_particulars")
        .then(response => {
            console.log("Received response from /salary_particulars", response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log("Received HTML from /salary_particulars", html);
            document.body.innerHTML = html;
            setupPrintFunction();
        })
        .catch(error => {
            console.error('Error fetching /salary_particulars', error);
        });

    function setupPrintFunction() {
        console.log("Setting up print function");
        var printButton = document.getElementById("print-button");
        if (printButton) {
            console.log("Found print button, adding event listener");
            printButton.addEventListener('click', printSalaryParticular);
        } else {
            console.error("Print button not found");
        }

        async function printSalaryParticular(event) {
            event.preventDefault();
            console.log("Print button clicked");

            try {
                const response = await fetch('/print_salary_particulars', {
                    method: 'POST',
                });
                console.log("Print request sent, response received", response);
                showModal(); // Show custom modal
            } catch(error) {
                console.error("Error during print request", error);
            }
        }
    }

    function showModal() {
        var modal = document.getElementById("print-modal");
        var closeButton = document.getElementsByClassName("close-button")[0];

        modal.style.display = "block";

        closeButton.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
