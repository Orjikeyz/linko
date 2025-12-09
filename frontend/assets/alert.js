function showAlert(message, status) {
    const alertBox = document.getElementById("alertBox");

    // Check if alertBox exists to avoid ReferenceError
    if (!alertBox) {
        console.error("Alert box element not found.");
        return;
    }

    if (status === "error") {
        alertBox.textContent = message;
        alertBox.style.background = "#dc3545"; // custom color
        alertBox.classList.add("show");
    } else if (status === "success") {
        alertBox.textContent = message;
        alertBox.style.background = "#28a745"; // custom color
        alertBox.classList.add("show");
    }

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 3000); // auto-hide after 3s
}
