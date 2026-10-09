
async function getTransactions() {
    try {
        const response = await fetch(`${backendUrl}/manager/transaction`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json()

        if (data.status === "error") {
            return showAlert(data.message, data.status)
        }

        // showAlert(data.message, data.status)
        return data

    } catch (error) {
        console.error("Error fetching transactions data:", error);
        return showAlert("Error fetching transactions data", "error")
    }
}

async function loadTransactions() {
    try {
        const data = await getTransactions();

        const transactions = data.result || [];

        const totalTransactions = transactions.length; //total transactions

        // Successful transactions
        const successfulTransactions = transactions.filter(
            transaction => transaction.status === "success"
        );

        const totalSuccessful = successfulTransactions.length;

        const pendingTransactions = transactions.filter(
            transaction => transaction.status === "pending" //pending transactions
        );

        const totalPending = pendingTransactions.length;

        // Total amount of successful transactions
        const totalSuccessfulAmount = successfulTransactions.reduce(
            (total, transaction) => {
                return total + Number(transaction.amount || 0);
            },
            0
        );

        let totalTransactionValue = document.querySelectorAll(".totalTransactions");
        for (let i = 0; i < totalTransactionValue.length; i++) {
            totalTransactionValue[i].textContent = totalTransactions
        }

        document.querySelector(".totalSuccessful").textContent = totalSuccessful;

        document.querySelector(".totalPending").textContent = totalPending;

        let totalSuccessfulAmountValue = document.querySelectorAll(".totalSuccessfulAmount");
        for (let i = 0; i < totalSuccessfulAmountValue.length; i++) {
            totalSuccessfulAmountValue[i].textContent = `₦${totalSuccessfulAmount.toLocaleString("en-NG")}`;
        }
        
        // document.querySelector(".totalSuccessfulAmount").textContent = `₦${totalSuccessfulAmount.toLocaleString("en-NG")}`;

        const tbody = document.querySelector("#transactionBody");

        if (!tbody) return;

        tbody.innerHTML = transactions.map(transaction => {

            // Status badge color
            let statusClass = "amber";
            let approveActionBtn =  `<button class="icon-btn reverse-btn" data-transaction-id="${transaction._id}" style='color: #fffb00; cursor: pointer; background: #5859278a; ' title="Reverse" onclick="reverseTransaction('${transaction._id}')" >Reverse</button>`

            if (transaction.status === "success") {
                statusClass = "green";
            } else if (transaction.status === "failed") {
                statusClass = "red";
            } else if (transaction.status === "pending") {
                statusClass = "red";
                approveActionBtn = `<button class="icon-btn approve-btn" data-transaction-id="${transaction._id}" style="color: #00ff6b; cursor: pointer; background: #2759278a" title="Approve" onclick="approveTransaction('${transaction._id}')">Approve</button>`
            }

            // Format amount
            const amount = Number(transaction.amount || 0).toLocaleString(
                "en-NG"
            );

            // Format date
            const date = transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                })
                : "—";

            return `
        <tr>

          <td class="mono">${transaction.reference_id || "—"}</td>

          <td class="cell-title">${transaction.description || "—"}</td>

          <td class="cell-sub mono">${transaction.vendor_id || "—"}</td>

          <td class="amount">₦${amount}</td>

          <td>
            <span class="badge ${statusClass}">${transaction.status || "unknown"}</span>
          </td>

          <td class="cell-sub">${date}</td>

          <td>
            <div class="row-actions">
              <button class="icon-btn viewTransactionBtn" title="View" style=' cursor: pointer; color: white' data-transaction-id="${transaction._id}">View</button>
              ${approveActionBtn}
            </div>
          </td>

        </tr>
      `;
        }).join("");

        // View Receipt Data Modal 
        let viewTransactionBtn = document.querySelectorAll(".viewTransactionBtn")
        for (let i = 0; i < viewTransactionBtn.length; i++) {
            viewTransactionBtn[i].addEventListener("click", async () => {
                let transactionId = viewTransactionBtn[i].dataset.transactionId;
                let transaction = transactions.find(item => item._id === transactionId);

                
                let receiptRef = document.querySelector("#receipt_ref");
                let receiptDescription = document.querySelector("#receipt_description");
                let receiptVendor = document.querySelector("#receipt_vendor");
                let receiptAmount = document.querySelector("#receipt_amount");
                let receiptDate = document.querySelector("#receipt_date");
                let receiptStatus = document.querySelector("#receipt_status");
                let receiptImg = document.querySelector("#receipt_img");

                receiptRef.textContent = transaction.reference_id || "-";
                receiptDescription.textContent = transaction.description || "-" ;
                receiptVendor.textContent = transaction.vendor_id || "-" ;
                receiptAmount.textContent = `₦${transaction.amount.toLocaleString()}` || "-" ;                
                receiptDate.textContent = transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "-";
                receiptStatus.textContent = transaction.status || "-" ;
                receiptImg.src = transaction.image_screenshot || ""


                let receiptModalOverlay = document.querySelector(".receipt-pop-modal");
                receiptModalOverlay.style.display = "block";
            });
        }

window.approveTransaction = async function (id) {
    let confirmApprove = confirm("Are you sure you want to approve this transaction?")
    if (!confirmApprove) return 

    try {
        let response = await fetch(`${backendUrl}/manager/transaction/approveTransaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id })
        });

        let data = await response.json();

        if (!response.ok || data.status === "error") {
            showAlert(data.message, "error");
            return;
        }

        let row = document.querySelector(
            `.approve-btn[data-transaction-id="${id}"]`
        )?.closest("tr");

        if (row) {
            let statusBadge = row.querySelector(".badge");
            let totalSuccessful = document.querySelector(".totalSuccessful");
            let totalPending = document.querySelector(".totalPending");

            // Update totals only if the row is still pending
            if (statusBadge.textContent.trim() === "pending") {
                statusBadge.textContent = "success";
                statusBadge.className = "badge green";

                totalSuccessful.textContent = Number(totalSuccessful.textContent) + 1;
                totalPending.textContent = Math.max(0, Number(totalPending.textContent) - 1);
            }

            row.querySelector(".approve-btn").outerHTML = `
                <button class="icon-btn reverse-btn"
                    data-transaction-id="${id}"
                    style="color: #fffb00; cursor: pointer; background: #5859278a"
                    title="Reverse"
                    onclick="reverseTransaction('${id}')">
                    Reverse
                </button>`;
        }

        showAlert(data.message, "success");

    } catch (error) {
        console.error("Error approving transaction:", error);
        showAlert("Something went wrong. Please try again.", "error");
    }
};

// Reverse transaction back to pending 
window.reverseTransaction = async function (id) {
    let confirmReverse = confirm("Are you sure you want to reverse this transaction?")
    if (!confirmReverse) return 

        try {
        let response = await fetch(`${backendUrl}/manager/transaction/reverseTransaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id })
        });

        let data = await response.json();

        if (!response.ok || data.status === "error") {
            showAlert(data.message, "error");
            return;
        }

        let row = document.querySelector(
            `.reverse-btn[data-transaction-id="${id}"]`
        )?.closest("tr");

        if (row) {
            let statusBadge = row.querySelector(".badge");
            let totalSuccessful = document.querySelector(".totalSuccessful");
            let totalPending = document.querySelector(".totalPending");

            // Update totals only if the row is still successful
            if (statusBadge.textContent.trim() === "success") {
                statusBadge.textContent = "pending";
                statusBadge.className = "badge red";

                totalSuccessful.textContent = Math.max(0, Number(totalSuccessful.textContent) - 1);
                totalPending.textContent = Number(totalPending.textContent) + 1;
            }

            row.querySelector(".reverse-btn").outerHTML = `
                <button class="icon-btn approve-btn"
                    data-transaction-id="${id}"
                    style="color: #00ff6b; cursor: pointer; background: #2759278a"
                    title="Approve"
                    onclick="approveTransaction('${id}')">
                    Approve
                </button>`;
        }

        showAlert(data.message, "success");

    } catch (error) {
        console.error("Error reversing transaction:", error);
        showAlert("Something went wrong. Please try again.", "error");
    }
};

    } catch (error) {
        console.error("Failed to load transactions:", error);
    }
}

setTimeout(() => {
    loadTransactions()
}, 1500);
