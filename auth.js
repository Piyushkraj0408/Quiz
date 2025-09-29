let generatedOtp = "";
function showForm(formType) {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('signinForm').classList.add('hidden');
    document.getElementById('otpSection').classList.add('hidden');

    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('signinTab').classList.remove('active');

    if (formType === 'signup') {
        document.getElementById('signupForm').classList.remove('hidden');
        document.getElementById('signupTab').classList.add('active');
    } else if (formType === 'signin') {
        document.getElementById('signinForm').classList.remove('hidden');
        document.getElementById('signinTab').classList.add('active');
    } else if (formType === 'otp') {
        document.getElementById('otpSection').classList.remove('hidden');
    }
}

function sendOtp() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const countryCode = document.getElementById("countryCode").value;
    const phone = document.getElementById("phone").value;

    if (!firstName || !lastName || !email || !phone) {
        alert("Please fill in all details for sign up.");
        return;
    }

    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    alert("Simulated OTP sent to " + countryCode + phone + ": " + generatedOtp);
    showForm('otp');
}

function verifyOtp() {
    const otp = document.getElementById("otp").value;
    if (otp === generatedOtp) {
        alert("Account created and OTP verified! Redirecting to role selection.");
        window.location.href = "role.html"; 
    } else {
        alert("Invalid OTP! Please try again.");
    }
}
function verifySignIn() {
    const signinEmail = document.getElementById("signinEmail").value;
    const signinPassword = document.getElementById("signinPassword").value;

    if (!signinEmail || !signinPassword) {
        alert("Please enter both email and password.");
        return;
    }

    alert("Simulated sign in for " + signinEmail + ". No actual verification implemented.");
    window.location.href = "role.html";
}

document.addEventListener('DOMContentLoaded', () => {
    showForm('signup');
});