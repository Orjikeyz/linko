async function selectPlan(plan) {
    let subscribeBtn = document.getElementById("subscribeBtn")
    subscribeBtn.disabled = true
    subscribeBtn.textContent = "Processing..."
    let username = JSON.parse(sessionStorage.getItem("vendorData")).username

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
        sessionStorage.setItem("payStackReference", data.result.reference)
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
        const response = await fetch(`http://localhost:3000/transaction/verifyPayment?reference=${sessionStorage.getItem("payStackReference")}`, {
            method: "GET",
        });

        const data = await response.json();
        let username = JSON.parse(sessionStorage.getItem("vendorData")).username

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
