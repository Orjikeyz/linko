async function selectPlan(plan) {
    try {
        const response = await fetch(`http://localhost:3000/payment/processPayment`, {
            method: "GET",
        });

        const data = await response.json();

        if (data.status === "error") {
            showAlert(data.message, data.status);
            return;
        }

        // success
        sessionStorage.setItem("payStackReference", data.result.reference)
        window.location.href = `${data.result.authorization_url}`

    } catch (error) {
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}


async function verifySubscriptionPayment() {
    try {
        const response = await fetch(`http://localhost:3000/payment/verifyPayment?reference=${sessionStorage.getItem("payStackReference")}`, {
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
        console.log(data.result.status)
        if (data.status === "success") {
            if (data.result.status === "success") {
                showAlert(data.message, data.status);
                setTimeout(() => {
                    console.log(332)
                    window.location.href = `../vendor/?id=${username}`
                }, 1500);
            }
        }

    } catch (error) {
        console.error(error);
        showAlert("Network error. Please try again.");
    }
}
