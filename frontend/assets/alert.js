function showAlert(message, status) {
    if (status === "error") {
        const alertBox = document.getElementById("alertBox");
        alertBox.textContent = message;
        alertBox.style.background = "#dc3545"; // custom color
        alertBox.classList.add("show");
    }else if (status === "success") {
        const alertBox = document.getElementById("alertBox");
        alertBox.textContent = message;
        alertBox.style.background = "#28a745"; // custom color
        alertBox.classList.add("show");
    }

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000); // auto-hide after 3s
}

// Example: call after form submit
// showAlert("Patient registered successfully!", "success"); // green
// showAlert("Error saving record!", "error"); // red