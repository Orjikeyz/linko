const loginAuth = async () => {
    let loginBtn = document.getElementById("loginBtn"); 
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

    // e.preventDefault(); // Prevent default form submission

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
            console.log(data)
            // window.location.href = `./?id=${data.result.id}`
        }, 1501);
        
    } catch (error) {
        console.error("Login error:", error);
        showAlert("Something went wrong. Please try again.", "error");
    }
}

const logout = async () => {
    try {
        const res = await fetch(`${backendUrl}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = "./login.html";
        }
    } catch (error) {
        console.error("Logout failed:", error);
        showAlert("Sorry an error occurred", "error")
    }
}

const changePassword = async ()=> {
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const submitBtn = document.getElementById("submitPassword");

        const errors = validatePasswords({
            current: currentPassword.value,
            newPass: newPassword.value,
            confirm: confirmPassword.value
        });

        if (errors.length > 0) {
            showErrors(errors);
            return;
        }

        //Process Data
        try {

         const response = await fetch(`${backendUrl}/auth/changePassword`, {
            method: "PUT",
             body: JSON.stringify({
                 currentPassword: currentPassword.value,
                 newPassword: newPassword.value,
                 confirmPassword: confirmPassword.value,
             }),
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()
        if (data.status === "error") {
            showAlert(`${data.message}`, `${data.status}`)
        }else if (data.status === "success") {
            // reset values to empty
            currentPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";

            showAlert(`${data.message}`, `${data.status}`)
        }           
        } catch (error) {
            showAlert(`Sorry an error occurred. Please try again later`, `error`)
        }
    

    function validatePasswords({ current, newPass, confirm }) {
        const errors = [];

        if (!current) {
            errors.push("Current password is required.");
        }

        if (!newPass) {
            errors.push("New password is required.");
            return errors;
        }

        // Strong password rules
        if (newPass.length < 6) {
            errors.push("Password must be at least 6 characters.");
        }

        if (!/[A-Z]/.test(newPass)) {
            errors.push("Must include at least one uppercase letter.");
        }

        if (!/[a-z]/.test(newPass)) {
            errors.push("Must include at least one lowercase letter.");
        }

        if (!/[0-9]/.test(newPass)) {
            errors.push("Must include at least one number.");
        }

        // if (!/[^A-Za-z0-9]/.test(newPass)) {
        //     errors.push("Must include at least one special character.");
        // }

        if (newPass === current) {
            errors.push("New password must be different from current password.");
        }

        if (newPass !== confirm) {
            errors.push("Passwords do not match.");
        }

        return errors;
    }

    function showErrors(errors) {
        showAlert(`${errors[0]}`, "error")
    }
}
