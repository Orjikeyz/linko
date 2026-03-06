let loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async function (e) {
    loginBtn.disabled = true
    loginBtn.textContent = "Authenticating..."
    function loginMsg () {
        loginBtn.disabled = false
        loginBtn.textContent = "ACCESS PORTAL"
    }

    let loginError = document.getElementById("loginError")
    function showAlert(message, error) {
        loginError.style.display = "block"
        loginError.textContent = message

        setTimeout(() => {
            loginMsg() 
        }, 1500);        
        setTimeout(() => {
            loginError.style.display = "none"
        }, 2000);
    }

    e.preventDefault(); // Prevent default form submission

    let loginEmail = document.getElementById("loginEmail").value.trim();
    let loginPassword = document.getElementById("loginPassword").value.trim();

    // Email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginEmail) {
        showAlert("Email is required", "error");
        return;
    } else if (!emailPattern.test(loginEmail)) {
        showAlert("Please enter a valid email address", "error");
        return;
    }

    if (!loginPassword) {
        showAlert("Password is required", "error");
        return;
    } else if (loginPassword.length < 6) {
        showAlert("Password must be at least 6 characters", "error");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            }),
        });

        const data = await response.json();

        if (data.status === "error") {
            showAlert(data.message || "Login failed", "error");
            return;
        }

        showAlert("Login successful!", "success");
        setTimeout(() => {
            loginBtn.disabled = true
            loginBtn.textContent = "ACCESS GRANTED"
            window.location.href = `./?id=${data.result.id}`
        }, 1501);
        
    } catch (error) {
        console.error("Login error:", error);
        showAlert("Something went wrong. Please try again.", "error");
    }
});


