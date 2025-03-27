document.addEventListener('DOMContentLoaded', function() {
    // Clear any previous payment data when starting a new payment
    sessionStorage.removeItem('paymentDetails');
    
    // Get order details from sessionStorage
    const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
    
    if (!orderDetails) {
        // If no order details found, redirect back to checkout
        window.location.href = 'checkout.html';
        return;
    }
    
    // Update summary section
    document.getElementById('summaryQuantity').textContent = orderDetails.quantity;
    document.getElementById('summaryTotal').textContent = orderDetails.total;

    // Payment links for different quantities
    const paymentLinks = {
        1: "https://rzp.io/rzp/TWF5xmG1",  // Link for ₹1,299
        2: "https://rzp.io/rzp/fDZQCst",  // Link for ₹2,598
        3: "https://rzp.io/rzp/XfMvJv2",  // Link for ₹3,897
        4: "https://rzp.io/rzp/OHLRJvIc"   // Link for ₹5,196
    };

    // Handle payment selection and order placement
    document.getElementById('placeOrderBtn').addEventListener('click', async function() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method to continue');
            return;
        }

        if (selectedPayment.value === 'online') {
            // Get the appropriate payment link based on quantity
            const quantity = parseInt(orderDetails.quantity);
            const paymentLink = paymentLinks[quantity];
            
            if (paymentLink) {
                window.location.href = paymentLink;
            } else {
                alert('Invalid quantity selected');
            }
        } else {
            // Handle COD payment
            handlePaymentSuccess(null, orderDetails);
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

// Function to handle successful payment
async function handlePaymentSuccess(response, orderDetails) {
    try {
        // Add payment details to order
        orderDetails.paymentMethod = 'online';
        orderDetails.orderStatus = 'pending';
        orderDetails.orderId = orderDetails.orderId;
        if (response) {
            orderDetails.razorpayPaymentId = response.razorpay_payment_id;
            orderDetails.razorpayOrderId = response.razorpay_order_id;
            orderDetails.razorpaySignature = response.razorpay_signature;
        }

        // Update Google Sheet with payment method
        await fetch('https://script.google.com/macros/s/AKfycbwToNP9m2y-bfoXCZ4e6OJ8ZiFTzx5EVwwIdHr7CBV5TfBIa7NT8-A3oHpJxlM9hnKQPw/exec?sheet=Sheet3', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails)
        });

        // Store payment details for thank you page
        sessionStorage.setItem('paymentDetails', JSON.stringify({
            method: 'online',
            orderStatus: 'pending',
            orderId: orderDetails.orderId,
            razorpayPaymentId: response ? response.razorpay_payment_id : null
        }));

        // Redirect to thank you page
        window.location.href = 'thank-you.html';

    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your order. Please try again.');
    }
} 