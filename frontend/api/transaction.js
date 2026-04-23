
// Get Transaction Data
let currentPage = 1;
let limit = 10;
let totalPages = 1;

async function getTransaction(vendor_id) {
    try {
        let response = await fetch(`${backendUrl}/transaction/getTransaction?id=${vendor_id}&limit=${limit}&page=${currentPage}`, {
            method: "GET",
            credentials: "include"
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
        showAlert("Network error. Please try again.", "error");
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
        const response = await fetch(`${backendUrl}/transaction/processPayment?id=${username}`, {
            method: "GET",
            credentials: "include"
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
        setTimeout(() => {
            subscribeBtn.disabled = false
            subscribeBtn.textContent = "Choose Basic"
        }, 2000);

    } catch (error) {
        subscribeBtn.disabled = false
        subscribeBtn.textContent = "Choose Basic"
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}

// Verify Subscription Payment  
async function verifySubscriptionPayment() {
    try {
        const response = await fetch(`${backendUrl}/transaction/verifyPayment?reference=${localStorage.getItem("payStackReference")}`, {
            method: "GET",
            credentials: "include"
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


// Verify Bank Account Data and list all bank 
let bankName = document.getElementById("bankName")
let bankCode = document.getElementById("bankCode")
let accountNumber = document.getElementById("accountNumber")
let accountName = document.getElementById("accountName")

function bankDataLoop() {
    let bankList = JSON.parse(localStorage.getItem("allBankList"))
    bankName.innerHTML += "<option>Select bank name</option>"
    bankList.forEach(item => {
        bankName.innerHTML += `
                <option data-bankCode="${item.code}">${item.name}</option>
            `
    });
}

const getAllBankData = async () => {
    if (!localStorage.getItem("allBankList")) {
        try {
            let response = await fetch(`${backendUrl}/transaction/getAllBankData`, {
                credentials: "include"
            })
            let data = await response.json()

            if (data.status === "error") {
                showAlert(data.message, data.status)
                return
            }

            localStorage.setItem("allBankList", JSON.stringify(data.result))
            bankDataLoop()
        } catch (error) {
            console.log(error)
            showAlert("Network error. Please try again.", "error");
        }
    } else {
        bankDataLoop()
    }
}

getAllBankData()

bankName.addEventListener("change", function (e) {
    const bankNameValue = e.target.value
    const selectedOption = e.target.selectedOptions[0];
    const code = selectedOption.dataset.bankcode; 
    bankCode.value = code
})

// accountNumber.addEventListener("keyup", function () {
//     verifyBankAccountData(accountNumber.value, bankCode.value)
// })

const verifyBankAccountData = async (accountNumber, bankCode) => {
    try {
        let response = await fetch(`${backendUrl}/transaction/verifyBankAccountData?accountNumber=${accountNumber}&bankCode=${bankCode}`, {
            credentials: "include"
        })
        let data = await response.json()

        if (data.status === "error") {
            showAlert(data.message, data.status)
            return
        }

        accountName.value = data.data.account_name
    } catch (error) {
        console.log(error)
        showAlert("Network error. Please try again.", "error");
    }
}