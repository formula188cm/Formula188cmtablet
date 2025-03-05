document.addEventListener('DOMContentLoaded', function() {
    // Get order details from sessionStorage
    const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
    
    // Update summary section
    document.getElementById('summaryQuantity').textContent = orderDetails.quantity;
    document.getElementById('summaryTotal').textContent = orderDetails.total;

    // Razorpay payment links (replace with your actual Razorpay payment links)
    const razorpayLinks = {
        1: "https://rzp.io/rzp/FTsov6Dt",
        2: "https://rzp.io/rzp/Pq140Wwf",
        3: "https://rzp.io/rzp/7k2mDXoo",
        4: "https://rzp.io/rzp/AwWf7Ud"
    };

    // Handle payment selection and order placement
    document.getElementById('placeOrderBtn').addEventListener('click', async function() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        // Add payment method to order details
        orderDetails.paymentMethod = selectedPayment.value;

        try {
            // Update Google Sheet with payment method
            await fetch('https://script.google.com/macros/s/AKfycbzGSMlCLy4o5WLT5NaQ_mxNheFJcjCp8lamqNKZV4Mwv6YWA5iA-dS9O5YMDthuRhY_iA/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails)
            });

            // Store payment details for thank you page
            sessionStorage.setItem('paymentDetails', JSON.stringify({
                method: selectedPayment.value,
                razorpayLink: selectedPayment.value === 'online' ? razorpayLinks[orderDetails.quantity] : null
            }));

            // Always redirect to thank you page
            window.location.href = 'thank-you.html';

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
        }
    });

    // Add visual feedback for payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
}); 