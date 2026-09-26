
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

            if (transaction.status === "success") {
                statusClass = "green";
            } else if (transaction.status === "failed") {
                statusClass = "red";
            } else if (transaction.status === "pending") {
                statusClass = "amber";
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
              <buttonclass="icon-btn"title="View"onclick="viewTransaction('${transaction._id}')">👁</button>
              <button class="icon-btn red" style='color: red' title="Delete" onclick="deleteTransaction('${transaction._id}')">🗑</button>
            </div>
          </td>

        </tr>
      `;
        }).join("");

    } catch (error) {
        console.error("Failed to load transactions:", error);
    }
}

setTimeout(() => {
    loadTransactions()
}, 1500);
