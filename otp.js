document.addEventListener('DOMContentLoaded', () => {
    const otpForm = document.getElementById('otpForm');
    const otpInput = document.getElementById('otp');

    // WebOTP API support
    if ('OTPCredential' in window) {
        const ac = new AbortController();
        
        navigator.credentials.get({
            otp: { transport:['sms'] },
            signal: ac.signal
        }).then(otp => {
            otpInput.value = otp.code;
            otpForm.submit();
        }).catch(err => {
            console.log('WebOTP Error:', err);
        });

        // Abort if OTP input is manually entered
        otpInput.addEventListener('input', () => {
            if (otpInput.value.length > 0) {
                ac.abort();
            }
        });
    }

    // Timer for resend OTP
    let timeLeft = 30;
    const timerSpan = document.querySelector('#timer span');
    
    const countdown = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById('timer').innerHTML = 
                '<a href="#" class="resend-link">Resend OTP</a>';
        }
    }, 1000);

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const otp = otpInput.value;
        const mobileNumber = sessionStorage.getItem('userMobile');

        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            const response = await verifyOTP(mobileNumber, otp);
            
            if (response.success) {
                // Redirect to main page after successful verification
                window.location.href = 'main.html';
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to verify OTP. Please try again.');
        }
    });
});

async function verifyOTP(mobile, otp) {
    // Replace with your actual API endpoint
    const API_URL = 'your-backend-api/verify-otp';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                mobile: mobile,
                otp: otp 
            })
        });

        return await response.json();
    } catch (error) {
        throw new Error('Failed to verify OTP');
    }
}