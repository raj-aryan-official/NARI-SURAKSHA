document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mobileInput = document.getElementById('mobile');

    // Validate mobile number input
    mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mobileNumber = mobileInput.value;
        
        if (mobileNumber.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            // Send OTP to the user's mobile number
            const response = await sendOTP(mobileNumber);
            
            if (response.success) {
                // Store mobile number in session
                sessionStorage.setItem('userMobile', mobileNumber);
                
                // Redirect to OTP page
                window.location.href = 'otp.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send OTP. Please try again.');
        }
    });
});

async function sendOTP(mobileNumber) {
    // Replace with your actual API endpoint
    const API_URL = 'your-backend-api/send-otp';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile: mobileNumber })
        });

        return await response.json();
    } catch (error) {
        throw new Error('Failed to send OTP');
    }
}