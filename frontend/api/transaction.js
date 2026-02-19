
// Get Transaction Data
let currentPage = 1;
let limit = 10;
let totalPages = 1;

async function getTransaction(vendor_id) {
    try {
        let response = await fetch(`http://localhost:3000/transaction/getTransaction?id=${vendor_id}&limit=${limit}&page=${currentPage}`, {
            method: "GET"
        })

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`)
            showAlert(`HTTP error! Status: ${response.status}`, `error`);
        }

        let data = await response.json()

        if (data.status === "error") {
            showAlert(data.message, data.status)
            return
        }

        if (data.status === "success") {

            if ($.fn.DataTable.isDataTable('#transactionTable')) {
                $('#transactionTable').DataTable().destroy()
            }
            document.querySelector("#transactionTable tbody").innerHTML = "";

            let dataTable = $('#transactionTable').DataTable({
                order: [],
                paging: false,
                info: false,
                pageLength: 30
            })

            // Humanize createdAt date
            function humanDate(dateValue) {
                const isoDate = `${dateValue}`;
                const date = new Date(isoDate);

                // Short human-friendly format: "Jan 30, 2026"
                const humanDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });

                return humanDate
            }

            // Number format for amount
            function formatAmount(num) {
                return Number(num).toLocaleString('en-US');
            }

            totalPages = data.result.totalPages
            data.result.data.forEach((value, index) => {
                dataTable.row.add([
                    index + 1 + (currentPage - 1) * limit,
                    value.reference_id,
                    formatAmount(value.amount),
                    `<center><span class="${value.status}">${value.status}</span></center>`,
                    value.description,
                    humanDate(value.createdAt),
                ])
            })

            dataTable.draw()   // 🔥 Important
        }


    } catch (error) {
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}

// Get transaction Data based on Next Button Pagination
async function transactionNextBtn() {
    if (currentPage < totalPages) {
        currentPage++;
        getTransaction(paramsValue);
    } else {
        showAlert("No more transactions to display", "info");
    }
}

// Get transaction Data based on Prev Button Pagination
async function transactionPrevBtn() {
    if (currentPage > 1) {   
        currentPage--;
        getTransaction(paramsValue);
    } else {
        showAlert("You are already on the first page", "info");
    }
}

async function selectPlan(plan) {
    let subscribeBtn = document.getElementById("subscribeBtn")
    subscribeBtn.disabled = true
    subscribeBtn.textContent = "Processing..."
    let username = JSON.parse(localStorage.getItem("vendorData")).username
    try {
        const response = await fetch(`http://localhost:3000/transaction/processPayment?id=${username}`, {
            method: "GET",
        });

        const data = await response.json();

        if (data.status === "error") {
            showAlert(data.message, data.status);
            subscribeBtn.disabled = false
            subscribeBtn.textContent = "Choose Basic"
            return;
        }

        // success

        localStorage.setItem("payStackReference", data.result.reference)
        window.location.href = `${data.result.authorization_url}`

    } catch (error) {
        subscribeBtn.disabled = false
        subscribeBtn.textContent = "Choose Basic"
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}


async function verifySubscriptionPayment() {
    try {
        const response = await fetch(`http://localhost:3000/transaction/verifyPayment?reference=${localStorage.getItem("payStackReference")}`, {
            method: "GET",
        });

        const data = await response.json();
        let username = JSON.parse(localStorage.getItem("vendorData")).username

        if (data.status === "error") {
            showAlert(data.message, data.status);
            setTimeout(() => {
                window.location.href = `../vendor/?id=${username}`
            }, 1500);
            return;
        }
 
        // success
        if (data.status === "success") {
            if (data.result.status === "success") {
                showAlert(data.message, data.status);
                setTimeout(() => {
                    window.location.href = `../vendor/?id=${username}`
                }, 1500);
            }
        }

    } catch (error) {
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}
